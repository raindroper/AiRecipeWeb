<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref(0)

// 标签与路由映射
// 0: 首页 (/), 1: 收藏 (/favorites), 2: 我的 (/profile)
const tabs = [
  { path: '/', index: 0 },
  { path: '/favorites', index: 1 },
  { path: '/profile', index: 2 },
]

const handleChange = (val) => {
  const target = tabs.find((t) => t.index === val)
  if (target) {
    router.push(target.path)
  }
}

// Sync active tab with current route
watch(
  () => route.path,
  (path) => {
    const found = tabs.find((t) => t.path === path)
    if (found) {
      activeTab.value = found.index
    } else {
      // If path is not exact match (e.g. sub-routes), maybe keep current or unselect?
      // For now, if we are on detail page, this layout might not be used or we handle it.
      // If we use this layout for detail pages too, we might want to hide nav or handle active state.
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-layout min-h-screen relative">
    <!-- Main Content Area with bottom padding to avoid overlap -->
    <div class="content pb-[50px]">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>

    <!-- 底部导航 -->
    <var-bottom-navigation
      v-model:active="activeTab"
      fixed
      safe-area
      active-color="#f97316"
      class=""
      @change="handleChange"
    >
      <var-bottom-navigation-item label="首页" icon="home" />
      <var-bottom-navigation-item label="收藏" icon="heart" />
      <var-bottom-navigation-item label="我的" icon="account-circle" />
    </var-bottom-navigation>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
