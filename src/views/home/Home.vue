<template>
  <div class="home-dashboard min-h-screen bg-slate-50 pb-[120px]">
    <!-- 1. Header & Greeting -->
    <header class="px-5 pt-8 pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">{{ greeting }}</h1>
        <p class="text-slate-500 text-sm mt-1">今天想吃点健康的吗？🌿</p>
      </div>
      <div
        @click="router.push('/profile')"
        class="cursor-pointer transition-transform active:scale-95"
      >
        <var-avatar
          :src="userStore?.currentUser?.avatarUrl"
          size="48"
          bordered
          class="border-2 border-white shadow-sm"
        />
      </div>
    </header>

    <!-- 2. Core Health Widget -->
    <section class="px-4 mb-6">
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 relative overflow-hidden"
        @click="router.push('/profile')"
      >
        <!-- Decor -->
        <div
          class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"
        ></div>

        <div class="flex justify-between items-center relative z-10">
          <div>
            <div class="text-blue-100 text-xs font-medium mb-1 uppercase tracking-wider">
              Health Status
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold">{{ bmi }}</span>
              <span class="text-sm opacity-80">BMI</span>
            </div>
            <div class="mt-2 inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs">
              <var-icon name="fire" size="12" class="mr-1" /> 目标：减脂增肌
            </div>
          </div>
          <div
            class="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <var-icon name="chevron-right" color="#fff" />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Quick Actions Grid -->
    <section class="px-4 mb-8">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="action in quickActions"
          :key="action.label"
          class="flex flex-col items-center gap-2 group cursor-pointer"
          @click="handleAction(action)"
        >
          <div
            class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl group-active:scale-95 transition-all"
          >
            {{ action.icon }}
          </div>
          <span class="text-xs text-slate-600 font-medium">{{ action.label }}</span>
        </div>
      </div>
    </section>

    <!-- 4. Recent Recommendations -->
    <section class="mb-6">
      <div class="px-5 flex justify-between items-center mb-3">
        <h3 class="font-bold text-slate-800 text-lg">为您推荐</h3>
        <span class="text-xs text-blue-600 font-medium">查看全部</span>
      </div>

      <!-- Horizontal Scroll Container -->
      <div class="flex overflow-x-auto px-5 pb-4 gap-4 scrollbar-hide">
        <div
          v-for="item in recommendedRecipes"
          :key="item.id"
          class="flex-none w-[160px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 active:scale-95 transition-transform"
          @click="router.push(`/recipe/${item.id}`)"
        >
          <div class="h-24 w-full relative">
            <img :src="item.cover" class="w-full h-full object-cover" />
            <div
              class="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white flex items-center"
            >
              <var-icon name="fire" size="10" class="mr-0.5" /> {{ item.calories }}
            </div>
          </div>
          <div class="p-3">
            <h4 class="font-bold text-slate-800 text-sm truncate">{{ item.title }}</h4>
            <div class="mt-2 flex items-center gap-1">
              <span class="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{{
                item.tag
              }}</span>
              <div class="flex-1"></div>
              <var-icon name="heart-outline" size="16" class="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Floating AI Bar (Sticky) -->
    <div class="fixed bottom-[70px] left-0 right-0 px-4 z-50">
      <div
        class="bg-slate-800 text-white rounded-full p-1 pl-4 flex items-center shadow-xl shadow-slate-300 active:scale-[0.98] transition-transform"
        @click="showChat = true"
      >
        <div class="flex-1 text-sm font-medium flex items-center">
          <span class="mr-2">✨</span>
          <span class="opacity-90">今天想做点什么？</span>
        </div>
        <div class="bg-blue-600 rounded-full p-2">
          <var-icon name="message-processing-outline" size="20" />
        </div>
      </div>
    </div>

    <!-- AI Chat Popup (Bottom Sheet) -->
    <var-popup
      v-model:show="showChat"
      position="bottom"
      class="rounded-t-3xl h-[85vh] flex flex-col"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
    >
      <!-- Sheet Header -->
      <div class="flex-none px-6 py-4 flex justify-between items-center border-b border-slate-50">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="font-bold text-slate-800">AI 厨师在线中</span>
        </div>
        <var-button round text color="transparent" text-color="#999" @click="showChat = false">
          <var-icon name="chevron-down" size="24" />
        </var-button>
      </div>

      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref="chatContainer">
        <div class="flex justify-start">
          <div
            class="bg-white p-3 rounded-2xl rounded-tl-none text-slate-700 text-sm shadow-sm max-w-[85%] border border-slate-100"
          >
            你好！我是你的专属 AI 厨师。👋 <br />
            你的冰箱里现在有哪些食材？或者告诉我你今天的饮食目标？
          </div>
        </div>

        <!-- Dynamic Messages -->
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex w-full"
          :class="msg.type === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="p-3 rounded-2xl text-sm shadow-sm max-w-[85%]"
            :class="
              msg.type === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            "
          >
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="flex-none p-4 bg-white border-t border-slate-100 pb-8">
        <div class="flex gap-3">
          <input
            v-model="inputText"
            @keyup.enter="sendMessage"
            type="text"
            class="flex-1 bg-slate-100 rounded-full px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="输入消息..."
            auto-focus
          />
          <var-button
            round
            type="primary"
            :disabled="!inputText"
            @click="sendMessage"
            class="shadow-lg shadow-blue-200"
          >
            <var-icon name="send" />
          </var-button>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const showChat = ref(false)
const inputText = ref('')
const messages = ref([])
const chatContainer = ref(null)

// 1. Dynamic Greeting
const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = userStore?.currentUser?.nickname || 'User'
  if (hour < 12) return `早上好，${name} ☀️`
  if (hour < 18) return `下午好，${name} ☕`
  return `晚上好，${name} 🌙`
})

// 2. Dynamic BMI
const bmi = computed(() => {
  if (!userStore?.currentUser?.bodyMetrics) return '--'
  const { height, weight } = userStore.currentUser.bodyMetrics
  if (!height || !weight) return '--'
  return (weight / (height / 100) ** 2).toFixed(1)
})

// 2. Quick Actions
const quickActions = [
  { label: '我的冰箱', icon: '🧊', route: '/profile' }, // Placeholder routes
  { label: '历史对话', icon: '📜', route: '/profile' },
  { label: '我的收藏', icon: '❤️', route: '/profile' },
  { label: '发布菜谱', icon: '📝', route: '/publish' },
]

const handleAction = (action) => {
  router.push(action.route)
}

// 3. Recommended Data
const recommendedRecipes = [
  {
    id: 101,
    title: '牛油果大虾沙拉',
    calories: 240,
    tag: '减脂',
    cover:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 102,
    title: '全麦鸡胸肉卷',
    calories: 320,
    tag: '增肌',
    cover:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 103,
    title: '莓果燕麦酸奶碗',
    calories: 180,
    tag: '早餐',
    cover:
      'https://images.unsplash.com/photo-1511690656952-34342d5c2895?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 104,
    title: '香煎三文鱼',
    calories: 450,
    tag: '晚餐',
    cover:
      'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
]

// 4. Chat Logic
const sendMessage = async () => {
  if (!inputText.value.trim()) return

  messages.value.push({ id: Date.now(), type: 'user', content: inputText.value })
  const userText = inputText.value
  inputText.value = ''

  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight

  // Mock AI Reply
  setTimeout(async () => {
    messages.value.push({
      id: Date.now() + 1,
      type: 'ai',
      content: `收到！你刚才说的 "${userText}" 听起来不错。我建议你可以尝试做一道低卡版的，用橄榄油代替黄油，味道也很棒！`,
    })
    await nextTick()
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }, 1000)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
