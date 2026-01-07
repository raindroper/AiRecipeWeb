<template>
  <div class="favorites-view min-h-screen bg-[#FFFBF5] pb-[80px]">
    <var-app-bar title="我的收藏" fixed safe-area-top color="#fff" text-color="#333"></var-app-bar>

    <div class="pt-14 px-5">
      <div
        v-if="items.length === 0"
        class="bg-white rounded-2xl p-8 border border-amber-100 text-center"
      >
        <div class="text-5xl mb-3 select-none">🍯</div>
        <p class="text-amber-900 font-medium">还没有收藏美味哦~</p>
        <p class="text-amber-700/80 text-sm mt-1">去首页逛逛，发现更多暖心菜谱</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          class="rounded-2xl overflow-hidden border border-amber-100"
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
            <var-icon
              :name="item.liked ? 'heart' : 'heart-outline'"
              :color="item.liked ? 'red' : '#f97316'"
              size="20"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 'f1', title: '黄油南瓜浓汤', time: 30, tag: '暖胃', liked: true, icon: '🥣' },
  { id: 'f2', title: '烤玉米鸡腿', time: 45, tag: '人气菜', liked: false, icon: '🍗' },
])

const toneClass = (idx) => {
  const tones = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50']
  return tones[idx % tones.length]
}
</script>

<style scoped></style>
