<template>
  <div class="favorites-view min-h-screen bg-[#FFFBF5] pb-[80px]">
    <var-app-bar title="我的收藏" fixed safe-area-top color="#fff" text-color="#333"></var-app-bar>

    <div class="pt-14 px-5">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-10">
        <var-loading type="cube" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="items.length === 0"
        class="bg-white rounded-2xl p-8 border border-amber-100 text-center mt-4"
      >
        <div class="text-5xl mb-3 select-none">🍯</div>
        <p class="text-amber-900 font-medium">还没有收藏美味哦~</p>
        <p class="text-amber-700/80 text-sm mt-1">去首页逛逛，发现更多暖心菜谱</p>
        <var-button class="mt-4" type="warning" text round @click="router.push('/')">去逛逛</var-button>
      </div>

      <!-- List -->
      <div v-else class="space-y-3 mt-4">
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          class="rounded-2xl overflow-hidden border border-amber-100 bg-white active:scale-[0.99] transition-transform"
          @click="goToDetail(item.id)"
        >
          <div :class="['px-4 py-3 flex items-center gap-3', toneClass(idx)]">
            <div
              class="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-2xl"
            >
              {{ item.icon }}
            </div>
            <div class="flex-1">
              <div class="font-bold text-orange-900 text-base line-clamp-1">{{ item.title }}</div>
              <div class="mt-0.5 text-xs text-amber-700 flex items-center gap-3">
                <span class="inline-flex items-center gap-1"
                  ><var-icon name="clock-outline" size="14" /> {{ item.time }} 分钟</span
                >
                <span class="inline-block h-[14px] w-px bg-amber-300"></span>
                <span class="line-clamp-1">{{ item.tag }}</span>
              </div>
            </div>
            <var-button round text color="transparent" @click.stop="handleToggleLike(item)">
              <var-icon
                :name="item.liked ? 'heart' : 'heart-outline'"
                :color="item.liked ? 'red' : '#f97316'"
                size="24"
                :transition="200"
              />
            </var-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { RecipeService } from '@/services/RecipeService'
import { Snackbar } from '@varlet/ui'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const items = ref([])

const icons = ['🍲', '🥘', '🥣', '🥗', '🍝', '🍛', '🍱', '🍤', '🍚', '🍗']
const getRandomIcon = (id) => {
  const charCode = id.charCodeAt(id.length - 1)
  return icons[charCode % icons.length]
}

const loadData = async () => {
  if (!userStore.currentUser) return
  loading.value = true
  try {
    const res = await RecipeService.getCollectedRecipes(userStore.currentUser.id, 1, 100) // Get top 100 for now
    items.value = (res.list || []).map(item => ({
      id: item.recipeId || item.id,
      title: item.recipeName,
      time: item.duration || 15,
      tag: item.tags ? item.tags.split(',')[0] : '美味',
      liked: true,
      icon: getRandomIcon(item.id || 'default')
    }))
  } catch (e) {
    console.error(e)
    Snackbar.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

watch(() => userStore.currentUser, (newVal) => {
    if (newVal) {
        loadData()
    } else {
        items.value = []
    }
})

const handleToggleLike = async (item) => {
    // If it's liked, we are uncollecting
    if (item.liked) {
        try {
            await RecipeService.uncollectRecipe(userStore.currentUser.id, item.id)
            item.liked = false
            // Optional: Remove from list immediately or wait for refresh
            // Let's remove it to reflect "Favorites" list behavior
            items.value = items.value.filter(i => i.id !== item.id)
            Snackbar.success('已取消收藏')
        } catch(e) {
            Snackbar.error('操作失败')
            item.liked = true // Revert
        }
    }
}

const goToDetail = (id) => {
    router.push({ name: 'recipe-detail', params: { id } })
}

const toneClass = (idx) => {
  const tones = ['bg-orange-50', 'bg-amber-50', 'bg-yellow-50']
  return tones[idx % tones.length]
}

onMounted(() => {
    if (!userStore.currentUser) {
        // Maybe redirect or show empty
    } else {
        loadData()
    }
})
</script>

<style scoped>
/* Scoped styles if needed */
</style>
