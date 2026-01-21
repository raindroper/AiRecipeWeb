<template>
  <div class="space-y-6">
    <!-- Hero Card -->
    <div
      class="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-6 mt-4 border border-orange-100 relative overflow-hidden"
    >
      <!-- Decorative background blob -->
      <div
        class="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"
      ></div>

      <div class="relative">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full bg-gray-50/50 rounded-2xl p-4 text-gray-800 text-base outline-none resize-none h-32 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all border border-transparent focus:border-orange-200"
          placeholder="输入冰箱里的食材（如：鸡蛋、番茄）或描述你的心情..."
        ></textarea>
      </div>

      <div class="flex gap-2 mt-4">
        <var-button
          block
          class="flex-1"
          type="warning"
          color="#f97316"
          :loading="isGenerating"
          @click="handleGenerate"
        >
          ✨ 生成烹饪灵感
        </var-button>

        <var-button
          class="w-24 shrink-0"
          type="primary"
          color="#fff7ed"
          text-color="#f97316"
          @click="$emit('switch-to-chat')"
        >
          灵感记录
        </var-button>
      </div>
    </div>

    <!-- Quick Command Grid -->
    <div>
      <h3 class="text-sm font-bold text-gray-500 mb-3 px-1">快捷指令</h3>
      <div class="grid grid-cols-3 gap-3">
        <var-button
          v-for="tag in sceneTags"
          :key="tag.label"
          class="bg-white !rounded-2xl !h-auto aspect-[4/3] shadow-sm border border-gray-100 active:scale-95 transition-all hover:border-orange-200 hover:shadow-md"
          color="#ffffff"
          text-color="#333"
          @click="appendTag(tag.label)"
          :ripple="false"
        >
          <div class="flex flex-col items-center justify-center gap-2 w-full h-full py-2">
            <span class="text-2xl">{{ tag.icon }}</span>
            <span class="text-xs font-medium text-gray-600">{{ tag.label }}</span>
          </div>
        </var-button>
      </div>
    </div>

    <!-- Kitchen Update Module -->
    <div class="space-y-3">
      <div
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform group cursor-pointer"
        @click="router.push('/profile')"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl"
          >
            🧊
          </div>
          <div class="text-sm text-gray-700">
            冰箱里有
            <span class="text-orange-500 font-bold text-lg mx-1">3</span> 种食材即将过期
          </div>
        </div>
        <div
          class="text-xs font-medium text-gray-400 flex items-center group-hover:text-orange-500 transition-colors"
        >
          去处理 <var-icon name="chevron-right" size="14" class="ml-0.5" />
        </div>
      </div>
    </div>

    <!-- Recent Creations Module -->
    <div>
      <h3 class="text-sm font-bold text-gray-500 mb-3 px-1">🕒 最近生成</h3>
      <div class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 active:scale-[0.99] transition-transform"
        >
          <div class="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
            <!-- Placeholder Image -->
            <div
              class="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100"
            >
              🍽️
            </div>
          </div>
          <div class="flex flex-col justify-center flex-1 min-w-0">
            <div class="font-bold text-gray-800 text-sm truncate">番茄滑蛋牛肉 {{ i }}</div>
            <div class="text-xs text-gray-400 mt-1">高蛋白 · 15分钟 · 家常菜</div>
          </div>
          <div class="flex items-center px-2">
            <var-button
              round
              icon-container
              color="#fff7ed"
              text-color="#f97316"
              class="!w-8 !h-8"
            >
              <var-icon name="plus" size="16" />
            </var-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Snackbar } from '@varlet/ui'

const router = useRouter()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  isGenerating: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'generate', 'switch-to-chat'])

const sceneTags = [
  { icon: '🔥', label: '减脂餐' },
  { icon: '⚡️', label: '快手菜' },
  { icon: '🧊', label: '清冰箱' },
  { icon: '🥡', label: '带饭' },
  { icon: '🍲', label: '暖胃' },
  { icon: '🎲', label: '随机' },
]

const appendTag = (label) => {
  const newVal = props.modelValue + (props.modelValue ? ' ' : '') + `帮我推荐 ${label}`
  emit('update:modelValue', newVal)
}

const handleGenerate = () => {
  if (!props.modelValue.trim()) {
    Snackbar.warning('请先输入内容~')
    return
  }
  emit('generate', props.modelValue)
}
</script>
