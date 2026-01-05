<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref(0)

// Map tabs to routes
// 0: Home (/), 1: Publish (/create), 2: Profile (/profile)
const tabs = [
  { path: '/', index: 0 },
  { path: '/publish', index: 1 },
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

    <!-- Bottom Navigation -->
    <var-bottom-navigation v-model:active="activeTab" fixed safe-area @change="handleChange">
      <var-bottom-navigation-item label="Home" icon="home" />
      <var-bottom-navigation-item label="Publish" icon="plus-box" />
      <var-bottom-navigation-item label="Profile" icon="account-circle" />
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
