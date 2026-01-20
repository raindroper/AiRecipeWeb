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
          @send="handleChatSend"
          @back="showResult = false"
          @start-cooking="handleStartCooking"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
const showResult = ref(false)
const chatMessages = ref([])

// Logic
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

  chatMessages.value.push({ role: 'user', text: text })
  isGenerating.value = true

  try {
    const res = await cloudService.callFunction('generate-recipe', {
      message: text,
      userId: userStore.currentUser?.id,
    })

    let data
    if (typeof res === 'string') {
      try {
        data = JSON.parse(res)
      } catch {
        data = { type: 'chat', text: res }
      }
    } else if (res && typeof res === 'object') {
      if ('result' in res) data = res.result
      else if ('data' in res) data = res.data
      else data = res
    } else {
      data = res
    }

    const aiMsg = { role: 'ai', text: '', recipeData: null }

    if (data && data.recipeData) {
      aiMsg.recipeData = data.recipeData
      aiMsg.text = data.text || '为你推荐这道菜：'
    } else if (data && data.text) {
      aiMsg.text = data.text
    } else {
      aiMsg.text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    }

    chatMessages.value.push(aiMsg)
  } catch (e) {
    console.error(e)
    chatMessages.value.push({ role: 'ai', text: '抱歉，生成出错了，请稍后再试。' })
    Snackbar.error('生成失败')
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
