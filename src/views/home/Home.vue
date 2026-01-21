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
          @generate="handleGenerate"
          @switch-to-chat="showResult = true"
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
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'
import { cloudService } from '@/utils/cloud'
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

// Logic
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const loadChatHistory = async () => {
  if (historyLoaded.value || !userStore.currentUser) return

  isLoadingHistory.value = true
  try {
    // 使用云对象获取历史记录
    const res = await cloudService.callObject('chat-service', 'getRecipeList', [
      userStore.currentUser.id,
    ])

    let historyList = []
    if (Array.isArray(res)) {
      historyList = res
    } else if (res && res.data && Array.isArray(res.data)) {
      historyList = res.data
    } else if (typeof res === 'string') {
      try {
        const parsed = JSON.parse(res)
        historyList = Array.isArray(parsed) ? parsed : []
      } catch {
        historyList = []
      }
    }

    if (historyList.length > 0) {
      // 后端返回的数据通常按时间倒序或正序，文档未明确，假设可能乱序，先排序
      const sortedData = historyList.sort((a, b) => {
        const t1 = new Date(a.createdAt || a.timestamp).getTime()
        const t2 = new Date(b.createdAt || b.timestamp).getTime()
        return t1 - t2
      })

      const serverMessages = []
      sortedData.forEach((item) => {
        // 1. 用户提问
        if (item.userQuery) {
          serverMessages.push({
            role: 'user',
            text: item.userQuery,
            timestamp: formatTime(item.createdAt),
            isLocal: false,
          })
        }

        // 2. AI 回复 (需解析 JSON 字符串)
        if (item.aiResponse) {
          let aiData = null
          try {
            aiData = JSON.parse(item.aiResponse)
          } catch (e) {
            // 如果不是 JSON，直接作为文本
            aiData = { text: item.aiResponse }
          }

          const aiMsg = {
            role: 'ai',
            text: '',
            recipeData: null,
            timestamp: formatTime(item.createdAt),
            isLocal: false,
          }

          // 处理解析后的 AI 数据结构
          if (aiData) {
            // 兼容直接返回结果或包含 result 包装的情况
            const result = aiData.result || aiData

            if (result.recipeData) {
              aiMsg.recipeData = result.recipeData
              aiMsg.text = result.text || '为你推荐这道菜：'
            } else if (result.text) {
              aiMsg.text = result.text
            } else {
              aiMsg.text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          }
          serverMessages.push(aiMsg)
        }
      })

      // Merge with existing local messages (preserve local ones at end if any)
      const localMessages = chatMessages.value.filter((msg) => msg.isLocal)
      chatMessages.value = [...serverMessages, ...localMessages]
    }
    historyLoaded.value = true
  } catch (e) {
    console.error('Failed to load chat history:', e)
  } finally {
    isLoadingHistory.value = false
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

  chatMessages.value.push({
    role: 'user',
    text: text,
    timestamp: formatTime(Date.now()),
  })
  isGenerating.value = true

  try {
    // 使用云对象生成菜谱
    const res = await cloudService.callObject('chat-service', 'generateRecipe', [
      userStore.currentUser?.id,
      text,
    ])

    let data
    if (typeof res === 'string') {
      try {
        data = JSON.parse(res)
      } catch {
        // 如果解析失败，可能返回的是纯文本错误或其他
        throw new Error(res)
      }
    } else {
      data = res
    }

    // 检查业务状态码
    if (data && data.ret && data.ret.code !== 0) {
      throw new Error(data.ret.desc || '生成失败')
    }

    // 获取实际结果数据
    const result = data.result || data

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
</script>

<style scoped>
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
