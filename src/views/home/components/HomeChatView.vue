<template>
  <div class="flex flex-col h-full absolute inset-0 bg-gray-50 z-50">
    <!-- Top Nav (Fixed) -->
    <div class="px-4 pt-4 pb-2 bg-gray-50 shrink-0">
      <var-button round text color="transparent" text-color="#666" @click="$emit('back')">
        <var-icon name="chevron-left" /> 返回首页
      </var-button>
    </div>

    <!-- Chat List Area (Scrollable) -->
    <div class="flex-1 overflow-y-auto space-y-6 px-4 pb-4 scrollbar-hide" ref="chatContainerRef">
      <!-- Empty State -->
      <div
        v-if="messages.length === 0"
        class="h-full flex flex-col items-center justify-center text-gray-400 gap-3"
      >
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-2"
        >
          🤖
        </div>
        <p class="text-sm">还没有生成任何灵感</p>
        <p class="text-xs text-gray-300">在下方输入框说说你想吃什么吧~</p>
      </div>

      <!-- Messages -->
      <div v-for="(msg, index) in messages" :key="index" class="w-full">
        <!-- User Message -->
        <div v-if="msg.role === 'user'" class="flex justify-end mb-4">
          <div
            class="bg-orange-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md text-sm leading-relaxed"
          >
            {{ msg.text }}
          </div>
        </div>

        <!-- AI Message -->
        <div v-else class="flex justify-start mb-4">
          <div
            class="bg-white rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- AI Text Content -->
            <div
              v-if="msg.text"
              class="p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
            >
              {{ msg.text }}
            </div>

            <!-- AI Recipe Card -->
            <div v-if="msg.recipeData" class="p-4 pt-2">
              <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                <span class="text-xl">🍲</span>
                <h2 class="font-bold text-gray-800 text-lg">{{ msg.recipeData.title }}</h2>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <div
                  class="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg"
                >
                  <var-icon name="clock-outline" size="12" />
                  {{ msg.recipeData.time || '15分钟' }}
                </div>
                <div
                  class="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg"
                >
                  🔥 {{ msg.recipeData.calories || '300' }} kcal
                </div>
                <div
                  v-for="tag in msg.recipeData.tags"
                  :key="tag"
                  class="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg"
                >
                  #{{ tag }}
                </div>
              </div>

              <!-- Ingredients (Collapsed view for chat) -->
              <div class="bg-gray-50 rounded-xl p-3 mb-3">
                <div class="text-xs font-bold text-gray-500 mb-2">所需食材</div>
                <div class="text-sm text-gray-700 leading-relaxed">
                  {{ msg.recipeData.ingredients.map((i) => i.name).join('、') }}
                </div>
              </div>

              <!-- Steps (Collapsed view for chat) -->
              <div class="bg-gray-50 rounded-xl p-3 mb-3">
                <div class="text-xs font-bold text-gray-500 mb-2">简要步骤</div>
                <div class="space-y-2">
                  <div
                    v-for="(step, idx) in msg.recipeData.steps"
                    :key="idx"
                    class="flex gap-2 text-sm text-gray-700"
                  >
                    <span class="text-orange-500 font-bold shrink-0">{{ idx + 1 }}.</span>
                    <span class="leading-relaxed">{{
                      typeof step === 'string' ? step : step.text
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 mt-2">
                <var-button
                  type="primary"
                  block
                  color="#f97316"
                  size="small"
                  @click="$emit('start-cooking', msg.recipeData)"
                >
                  开始烹饪
                </var-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isGenerating" class="flex justify-start mb-4">
        <div
          class="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-2"
        >
          <div
            class="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></div>
          <div
            class="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></div>
          <div
            class="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></div>
        </div>
      </div>
    </div>

    <!-- Bottom Input Area (Fixed) -->
    <div class="px-4 py-3 bg-gray-50 shrink-0 safe-area-bottom">
      <div
        class="bg-white rounded-[24px] shadow-sm border border-gray-100 flex items-end p-2 gap-2"
      >
        <textarea
          v-model="chatInput"
          rows="1"
          class="flex-1 bg-transparent border-0 outline-none text-sm px-3 py-3 resize-none max-h-24"
          placeholder="继续追加要求，例如：换成鸡肉..."
          @keydown.enter.prevent="handleChatSend"
        ></textarea>
        <var-button
          round
          type="primary"
          color="#f97316"
          text-color="#ffffff"
          :disabled="!chatInput.trim() || isGenerating"
          @click="handleChatSend"
          class="shrink-0 mb-1 !w-10 !h-10"
          :ripple="false"
        >
          <Icon icon="mdi:arrow-up" width="24" height="24" />
        </var-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  isGenerating: {
    type: Boolean,
    default: false,
  },
  isLoadingHistory: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['send', 'back', 'start-cooking'])

const chatInput = ref('')
const chatContainerRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  })
}

// Watch messages change to auto-scroll
watch(
  () => props.messages.length,
  () => {
    scrollToBottom()
  },
)

// Also scroll on load/show
watch(
  () => chatContainerRef.value,
  (val) => {
    if (val) scrollToBottom()
  },
)

const handleChatSend = () => {
  if (!chatInput.value.trim() || props.isGenerating) return
  const text = chatInput.value
  chatInput.value = ''
  emit('send', text)
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
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
