<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pb-24 relative">
    <!-- Top Gradient Decoration -->
    <div
      class="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-orange-200/60 to-gray-50 pointer-events-none"
    ></div>

    <div class="relative px-4 space-y-6 flex-1 flex flex-col">
      <!-- Header -->
      <HomeHeader
        :nickname="userStore.currentUser?.nickname"
        :avatar-url="userStore.currentUser?.avatarUrl"
      />

      <Transition name="fade" mode="out-in">
        <!-- View A: Input Mode -->
        <HomeInputView
          v-if="!showResult"
          v-model="userInput"
          :is-generating="isGenerating"
          :recent-recipes="recentRecipes"
          :has-more="hasMoreHistory"
          :is-logged-in="!!userStore.currentUser"
          @generate="handleGenerate"
          @switch-to-chat="showResult = true"
          @start-cooking="handleStartCooking"
          @toggle-collect="handleToggleCollect"
        />

        <!-- View B: Result/Chat Mode -->
        <HomeChatView
          v-else
          :messages="chatMessages"
          :is-generating="isGenerating"
          :is-loading-history="isLoadingHistory"
          @send="handleChatSend"
          @back="showResult = false"
          @start-cooking="handleStartCooking"
          @toggle-collect="handleToggleCollect"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'
// import { cloudService } from '@/utils/cloud' // No longer needed directly here
import { ChatService } from '@/services/ChatService'
import { RecipeService } from '@/services/RecipeService'
import { Snackbar } from '@varlet/ui'

// Components
import HomeHeader from './components/HomeHeader.vue'
import HomeInputView from './components/HomeInputView.vue'
import HomeChatView from './components/HomeChatView.vue'

const router = useRouter()
const userStore = useUserStore()
const recipeStore = useRecipeStore()

// State
const userInput = ref('')
const isGenerating = ref(false)
const isLoadingHistory = ref(false)
const showResult = ref(false)
const chatMessages = ref([])
const historyLoaded = ref(false)
const recentRecipes = ref([])
const cachedHistoryList = ref([]) // Cache for raw history data

// Logic
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const fetchHistoryData = async () => {
  if (!userStore.currentUser) {
    recentRecipes.value = []
    cachedHistoryList.value = []
    return
  }

  try {
    const historyList = await RecipeService.getRecipeList(userStore.currentUser.id)
    cachedHistoryList.value = historyList // Store raw data

    // 1. Update Recent Recipes
    // Sort by time desc
    const sortedData = [...historyList].sort((a, b) => {
      const t1 = new Date(a.createdAt || a.timestamp).getTime()
      const t2 = new Date(b.createdAt || b.timestamp).getTime()
      return t2 - t1 // Descending
    })

    const recipes = []
    for (const item of sortedData) {
      if (item.aiResponse) {
        try {
          let aiData = JSON.parse(item.aiResponse)
          const result = aiData.result || aiData
          if (result && result.recipeData) {
            recipes.push({
              ...result.recipeData,
              id: item._id || item.id, // Ensure ID exists if needed
              recipeId: result.recipeData.recipeId || item.recipeId || item.id, // Ensure recipeId exists
              isCollected: !!(item.isCollected || result.recipeData.isCollected),
            })
          }
        } catch (e) {
          // ignore parse error
        }
      }
      if (recipes.length >= 10) break
    }
    recentRecipes.value = recipes
    historyLoaded.value = true // Mark as loaded
  } catch (e) {
    console.error('Failed to fetch history data:', e)
  }
}

onMounted(() => {
  fetchHistoryData()
})

watch(
  () => userStore.currentUser,
  () => {
    fetchHistoryData()
  },
)

const loadChatHistory = async () => {
  if (!userStore.currentUser) return

  // Use cached data if available, otherwise fetch
  if (!historyLoaded.value) {
    isLoadingHistory.value = true
    await fetchHistoryData()
    isLoadingHistory.value = false
  }

  // Process cached data for Chat View
  const historyList = cachedHistoryList.value

  if (historyList.length > 0) {
    // Sort logic same as before
    const sortedData = [...historyList].sort((a, b) => {
      const t1 = new Date(a.createdAt || a.timestamp).getTime()
      const t2 = new Date(b.createdAt || b.timestamp).getTime()
      return t1 - t2 // Ascending for chat
    })

    const serverMessages = []
    sortedData.forEach((item) => {
      // 1. User Query
      if (item.userQuery) {
        serverMessages.push({
          role: 'user',
          text: item.userQuery,
          timestamp: formatTime(item.createdAt),
          isLocal: false,
        })
      }

      // 2. AI Response
      if (item.aiResponse) {
        let aiData = null
        try {
          aiData = JSON.parse(item.aiResponse)
        } catch (e) {
          aiData = { text: item.aiResponse }
        }

        const aiMsg = {
          role: 'ai',
          text: '',
          recipeData: null,
          timestamp: formatTime(item.createdAt),
          isLocal: false,
        }

        if (aiData) {
          // [Refactor]: Use nullish coalescing
          const result = aiData.result ?? aiData

          if (result.recipeData) {
            aiMsg.recipeData = result.recipeData
            aiMsg.text = result.text || '为你推荐这道菜：'
            // [Refactor]: Ensure isCollected is correctly synced using nullish coalescing
            aiMsg.recipeData.isCollected = !!(item.isCollected ?? result.recipeData.isCollected)
            aiMsg.recipeData.recipeId = result.recipeData.recipeId ?? item.recipeId ?? item.id
          } else if (result.text) {
            aiMsg.text = result.text
          } else {
            aiMsg.text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }
        }
        serverMessages.push(aiMsg)
      }
    })

    // Merge with existing local messages
    const localMessages = chatMessages.value.filter((msg) => msg.isLocal)
    chatMessages.value = [...serverMessages, ...localMessages]
  }
}

watch(showResult, (val) => {
  if (val) {
    loadChatHistory()
  }
})

const handleStartCooking = (recipeData) => {
  if (!recipeData) return

  let steps = recipeData.steps || []
  if (steps.length > 0 && typeof steps[0] === 'string') {
    steps = steps.map((s) => ({ text: s, imageUrl: '' }))
  }

  const finalRecipeData = {
    ...recipeData,
    steps: steps,
    timeRequired: parseInt(recipeData.time) || 15,
    calories: parseInt(recipeData.calories) || 300,
  }

  try {
    const newRecipe = recipeStore.addRecipe(finalRecipeData)
    Snackbar.success('已开始烹饪！')
    router.push({ name: 'recipe-detail', params: { id: newRecipe.id } })
  } catch (e) {
    console.error(e)
    Snackbar.error('无法开始烹饪')
  }
}

const sendMessage = async (text) => {
  if (!text.trim()) return

  const isLogin = localStorage.getItem('user_token')
  if (!isLogin) {
    Snackbar.warning('请先登录后再使用 AI 厨师功能')
    router.push('/profile')
    return
  }

  if (!userStore.currentUser) {
    Snackbar.warning('用户信息加载中，请稍后再试')
    return
  }

  chatMessages.value.push({
    role: 'user',
    text: text,
    timestamp: formatTime(Date.now()),
    isLocal: true,
  })
  isGenerating.value = true

  try {
    // 使用 Service 生成菜谱
    const result = await ChatService.generateRecipe(userStore.currentUser?.id, text)

    const aiMsg = {
      role: 'ai',
      text: '',
      recipeData: null,
      timestamp: formatTime(Date.now()),
      isLocal: true,
    }

    if (result && result.recipeData) {
      aiMsg.recipeData = result.recipeData
      aiMsg.text = result.text || '为你推荐这道菜：'
    } else if (result && result.text) {
      aiMsg.text = result.text
    } else {
      aiMsg.text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    }

    chatMessages.value.push(aiMsg)
  } catch (e) {
    console.error(e)
    chatMessages.value.push({
      role: 'ai',
      text: e.message || '抱歉，生成出错了，请稍后再试。',
      timestamp: formatTime(Date.now()),
      isLocal: true,
    })
    Snackbar.error(e.message || '生成失败')
  } finally {
    isGenerating.value = false
  }
}

const handleGenerate = (text) => {
  userInput.value = ''
  showResult.value = true
  sendMessage(text)
}

const handleChatSend = (text) => {
  sendMessage(text)
}

const handleToggleCollect = async (recipe) => {
  console.log('handleToggleCollect')
  console.log('handleToggleCollect called with:', recipe)
  if (!userStore.currentUser) {
    console.warn('User not logged in')
    Snackbar.warning('请先登录')
    return
  }

  if (!recipe || !recipe.recipeId) {
    console.error('Invalid recipe object:', recipe)
    Snackbar.warning('无法操作：缺少菜谱ID')
    return
  }

  try {
    if (recipe.isCollected) {
      await RecipeService.uncollectRecipe(userStore.currentUser.id, recipe.recipeId)
      recipe.isCollected = false
      recipe.collectId = null
      Snackbar.success('已取消收藏')
    } else {
      const res = await RecipeService.collectRecipe(userStore.currentUser.id, recipe.recipeId)
      recipe.isCollected = true
      recipe.collectId = res.id
      Snackbar.success('已收藏')
    }
  } catch (e) {
    console.error('Toggle collect failed:', e)
    Snackbar.error(e.message || '操作失败')
  }
}
</script>

<style scoped>
@import "tailwindcss";

/* [Refactor]: Extract repeating utility classes to component-scoped CSS */
.recipe-card {
  @apply bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 active:scale-[0.99] transition-transform cursor-pointer;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
