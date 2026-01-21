<template>
  <header class="flex justify-between items-center pt-8 px-2 shrink-0">
    <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
      {{ greeting }}
    </h1>
    <div
      class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm border border-white/50"
    >
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        alt="Avatar"
        class="w-full h-full object-cover"
      />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nickname: {
    type: String,
    default: '朋友',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = props.nickname
  if (hour < 12) return `👋 早上好，${name}`
  if (hour < 18) return `👋 下午好，${name}`
  return `👋 晚上好，${name}`
})
</script>
