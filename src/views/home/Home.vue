<template>
  <div class="home-dashboard min-h-screen pb-[120px] space-y-4">
    <header class="px-5 pt-8 pb-2 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-orange-900">{{ greeting }}</h1>
        <p class="text-amber-700/80 text-sm mt-1">欢迎回家，厨房已经为你准备好灵感 🍽️</p>
      </div>
      <div
        @click="router.push('/profile')"
        class="cursor-pointer active:scale-95 transition-transform"
      >
        <var-avatar
          :src="userStore?.currentUser?.avatarUrl"
          size="48"
          bordered
          class="border-2 border-white"
        />
      </div>
    </header>

    <section class="px-4">
      <div
        class="rounded-2xl p-5 text-orange-950 bg-gradient-to-r from-orange-400 to-amber-300 relative overflow-hidden"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="text-white/80 text-xs mb-1">{{ today }}</div>
            <div class="text-lg font-bold text-white">秋天到了，来碗南瓜汤暖暖胃吧 🎃</div>
          </div>
          <div class="text-3xl select-none">🥣</div>
        </div>
      </div>
    </section>

    <section class="px-4">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="action in quickActions"
          :key="action.label"
          class="flex flex-col items-center gap-2 cursor-pointer"
          @click="handleAction(action)"
        >
          <div
            class="w-14 h-14 bg-white rounded-2xl border border-amber-100 flex items-center justify-center text-2xl active:scale-95 transition-all"
          >
            {{ action.icon }}
          </div>
          <span class="text-xs text-orange-800 font-medium">{{ action.label }}</span>
        </div>
      </div>
    </section>

    <section class="px-5 space-y-3">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-orange-900 text-lg">本周热门</h3>
        <span class="text-xs text-orange-600 font-medium">查看全部</span>
      </div>

      <div class="space-y-3">
        <div
          v-for="(item, idx) in recommendedRecipes"
          :key="item.id"
          class="rounded-2xl border border-amber-100 active:scale-[0.99] transition-transform overflow-hidden"
          @click="router.push(`/recipe/${item.id}`)"
        >
          <div :class="['px-4 py-3 flex items-center gap-3', toneClass(idx)]">
            <div
              class="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-2xl"
            >
              {{ item.icon }}
            </div>
            <div class="flex-1">
              <div class="font-bold text-orange-900 text-base">{{ item.title }}</div>
              <div class="mt-0.5 text-xs text-amber-700 flex items-center gap-3">
                <span class="inline-flex items-center gap-1"
                  ><var-icon name="clock-outline" size="14" /> {{ item.time }} 分钟</span
                >
                <span class="inline-block h-[14px] w-px bg-amber-300"></span>
                <span>{{ item.tag }}</span>
              </div>
            </div>
            <div class="text-lg select-none">🍽️</div>
          </div>
        </div>
      </div>
    </section>

    <div class="fixed bottom-[70px] left-0 right-0 px-4 z-50">
      <div
        class="bg-orange-900 text-white rounded-full p-1 pl-4 flex items-center active:scale-[0.98] transition-transform"
        @click="showChat = true"
      >
        <div class="flex-1 text-sm font-medium flex items-center">
          <span class="mr-2">✨</span>
          <span class="opacity-90">今天想做点什么？</span>
        </div>
        <div class="bg-orange-500 rounded-full p-2">
          <var-icon name="message-processing-outline" size="20" />
        </div>
      </div>
    </div>

    <var-popup
      v-model:show="showChat"
      position="bottom"
      class="rounded-t-3xl h-[85vh] flex flex-col"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
    >
      <div class="flex-none px-6 py-4 flex justify-between items-center border-b border-amber-100">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="font-bold text-orange-900">AI 厨师在线中</span>
        </div>
        <var-button round text color="transparent" text-color="#A15C00" @click="showChat = false">
          <var-icon name="chevron-down" size="24" />
        </var-button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFBF5]" ref="chatContainer">
        <div class="flex justify-start">
          <div
            class="bg-white p-3 rounded-2xl rounded-tl-none text-amber-900 text-sm max-w-[85%] border border-amber-100"
          >
            你好！我是你的专属 AI 厨师。👋 你的冰箱里现在有哪些食材？或者告诉我你今天的饮食目标？
          </div>
        </div>

        <div v-for="msg in messages" :key="msg.id" class="w-full space-y-2">
          <div class="flex w-full" :class="msg.type === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="p-3 rounded-2xl text-sm max-w-[85%]"
              :class="
                msg.type === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-none'
                  : 'bg-white text-amber-900 rounded-tl-none border border-amber-100'
              "
            >
              {{ msg.content }}
            </div>
          </div>
          <div v-if="msg.recipe" class="flex w-full justify-start">
            <var-card
              :elevation="2"
              class="recipe-card rounded-xl border border-amber-100 w-[92%] bg-white"
            >
              <div class="px-4 py-3 space-y-3">
                <div>
                  <div class="text-lg font-bold text-gray-800">
                    {{ msg.recipe.title || '推荐菜谱' }}
                  </div>
                  <div
                    class="mt-2 flex flex-wrap gap-2"
                    v-if="msg.recipe.tags && msg.recipe.tags.length"
                  >
                    <var-chip
                      v-for="tag in msg.recipe.tags"
                      :key="tag"
                      size="mini"
                      type="warning"
                      plain
                    >
                      {{ tag }}
                    </var-chip>
                  </div>
                </div>
                <div
                  class="bg-orange-50 rounded px-3 py-2 text-orange-600 text-xs flex items-center justify-between"
                >
                  <div class="inline-flex items-center gap-1">
                    <var-icon name="clock-outline" size="14" />
                    <span>烹饪时长：{{ msg.recipe.time }}</span>
                  </div>
                  <div class="inline-flex items-center gap-1">
                    <span>🔥</span>
                    <span>热量：{{ msg.recipe.calories }} kcal</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="text-sm font-bold text-amber-900">🥦 所需食材</div>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="(ing, i) in msg.recipe.ingredients || []"
                      :key="i"
                      class="bg-gray-50 p-2 rounded flex items-center justify-between"
                    >
                      <span class="text-sm text-amber-900">{{ ing.name }}</span>
                      <span class="text-xs text-gray-500">{{ ing.amount }}</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="text-sm font-bold text-amber-900">👨‍🍳 烹饪步骤</div>
                  <div class="space-y-2">
                    <div
                      v-for="(step, idx) in msg.recipe.steps || []"
                      :key="idx"
                      class="flex items-start gap-2"
                    >
                      <div
                        class="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs"
                      >
                        {{ idx + 1 }}
                      </div>
                      <div class="text-sm text-amber-900 leading-relaxed">{{ step }}</div>
                    </div>
                  </div>
                </div>
                <div class="pt-2 flex justify-end">
                  <var-button round text color="transparent" text-color="#A15C00">
                    <var-icon name="heart-outline" size="18" />
                    <span class="ml-1 text-sm">收藏</span>
                  </var-button>
                </div>
              </div>
            </var-card>
          </div>
        </div>
      </div>

      <div class="flex-none p-4 bg-white border-t border-amber-100 pb-8">
        <div class="flex gap-3">
          <input
            v-model="inputText"
            @keyup.enter="sendMessage"
            type="text"
            class="flex-1 bg-amber-50 rounded-full px-4 text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all"
            placeholder="输入消息..."
            auto-focus
          />
          <var-button round type="primary" :disabled="loading || !inputText" @click="sendMessage">
            <var-icon name="send" />
          </var-button>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { cloudService } from '@/utils/cloud'
import { Snackbar } from '@varlet/ui'

const USE_MOCK = true

const router = useRouter()
const userStore = useUserStore()
const showChat = ref(false)
const inputText = ref('')
const messages = ref([])
const chatContainer = ref(null)
const loading = ref(false)

const today = computed(() => new Date().toLocaleDateString('zh-CN'))

const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = userStore?.currentUser?.nickname || '朋友'
  if (hour < 12) return `早上好，${name} ☀️`
  if (hour < 18) return `下午好，${name} ☕`
  return `晚上好，${name} 🌙`
})

const quickActions = [
  { label: '我的冰箱', icon: '🧊', route: '/profile' },
  { label: '历史记录', icon: '📜', route: '/profile' },
  { label: '我的收藏', icon: '❤️', route: '/favorites' },
  { label: '家庭档案', icon: '👨‍👩‍👧', route: '/profile' },
]

const handleAction = (action) => {
  router.push(action.route)
}

const recommendedRecipes = [
  {
    id: 201,
    title: '南瓜奶油汤',
    time: 25,
    tag: '暖胃',
    icon: '🥣',
  },
  {
    id: 202,
    title: '香烤鸡腿配玉米',
    time: 40,
    tag: '人气菜',
    icon: '🍗',
  },
  {
    id: 203,
    title: '蜂蜜黄油吐司',
    time: 10,
    tag: '早餐',
    icon: '🍞',
  },
  {
    id: 204,
    title: '番茄牛肉炖菜',
    time: 60,
    tag: '家常',
    icon: '🍲',
  },
]

const toneClass = (idx) => {
  const tones = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50']
  return tones[idx % tones.length]
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

const mockGenerateRecipe = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (message && message.includes('辣')) {
        resolve({
          type: 'recipe',
          text: '想吃辣的？这道川菜经典绝对满足你！🌶️ (Mock)',
          recipeData: {
            title: '正宗麻婆豆腐',
            calories: 320,
            time: '20分钟',
            tags: ['下饭', '川菜', '重口'],
            ingredients: [
              { name: '嫩豆腐', amount: '1盒' },
              { name: '牛肉末', amount: '100g' },
              { name: '豆瓣酱', amount: '2勺' },
            ],
            steps: ['豆腐切块焯水', '炒香肉末和豆瓣酱', '加入豆腐和水焖煮', '勾芡出锅'],
          },
        })
        return
      }
      if (message && message.includes('汤')) {
        resolve({
          type: 'recipe',
          text: '天气干燥，来碗清淡的汤吧~ (Mock)',
          recipeData: {
            title: '番茄菌菇汤',
            calories: 150,
            time: '15分钟',
            tags: ['低脂', '清淡', '快手'],
            ingredients: [
              { name: '番茄', amount: '2个' },
              { name: '金针菇', amount: '1把' },
            ],
            steps: ['番茄炒出汁', '加水烧开', '放入菌菇煮熟'],
          },
        })
        return
      }
      resolve({ type: 'chat', text: '我是您的AI厨房助手，请告诉我您想吃什么？(Mock)' })
    }, 1000)
  })
}

const sendMessage = async () => {
  if (!inputText.value.trim() || loading.value) return
  const isLogin = localStorage.getItem('user_token')
  if (!isLogin) {
    Snackbar.warning('请先登录后再使用 AI 厨师功能')
    router.push('/profile')
    return
  }
  const userText = inputText.value
  messages.value.push({ id: Date.now(), type: 'user', content: userText })
  loading.value = true
  inputText.value = ''
  await scrollToBottom()
  try {
    let data
    if (USE_MOCK) {
      console.log('🚧 使用本地 Mock 数据')
      data = await mockGenerateRecipe(userText)
    } else {
      const res = await cloudService.callFunction('generate-recipe', { message: userText })
      if (typeof res === 'string') {
        try {
          data = JSON.parse(res)
        } catch {
          data = { type: 'chat', text: res }
        }
      } else if (res && typeof res === 'object' && 'data' in res) {
        data = res.data
      } else {
        data = res
      }
    }
    if (data) {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: data?.text || '好的，我来为你生成建议。',
      }
      if (data && data.type === 'recipe' && data.recipeData) {
        aiMsg.recipe = data.recipeData
      }
      messages.value.push(aiMsg)
    }
  } catch (e) {
    console.error(e)
    messages.value.push({ id: Date.now() + 2, type: 'ai', content: '网络开小差了，请稍后再试。' })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

onMounted(async () => {
  try {
    await cloudService.loginAnonymously()
  } catch {}
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.recipe-card {
  margin: 0;
}
</style>
