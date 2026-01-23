
<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe'
import { useUserStore } from '@/stores/user'
import { RecipeService } from '@/services/RecipeService'
import { Snackbar } from '@varlet/ui'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const userStore = useUserStore()

// State
const recipe = ref(null)
const ingredients = ref([])
const steps = ref([])
const isFavorite = ref(false)

onMounted(async () => {
  const id = route.params.id
  const found = recipeStore.getRecipeById(id)
  
  if (found) {
    recipe.value = found
    
    // Parse Ingredients
    try {
      // The model already parses JSON, but just in case or if double-encoded
      const ing = typeof found.ingredients === 'string' ? JSON.parse(found.ingredients) : found.ingredients
      ingredients.value = Array.isArray(ing) ? ing.map(i => ({ ...i, checked: false })) : []
    } catch (e) {
      ingredients.value = []
    }

    // Parse Steps
    try {
      const stp = typeof found.steps === 'string' ? JSON.parse(found.steps) : found.steps
      // Normalize steps
      steps.value = Array.isArray(stp) ? stp.map(s => {
        if (typeof s === 'string') return { text: s, imageUrl: '' }
        return s
      }) : []
    } catch (e) {
      steps.value = []
    }

    // Check collection status
    if (userStore.currentUser?.id) {
        try {
            const status = await RecipeService.isRecipeCollected(userStore.currentUser.id, id)
            isFavorite.value = status.isCollected
        } catch (e) {
            console.error('Check collection status failed', e)
        }
    }
  } else {
    Snackbar.warning('未找到该菜谱')
    router.replace('/')
  }
})

// Methods
const goBack = () => {
  router.back()
}

const toggleLike = async () => {
  if (!recipe.value) return

  if (!userStore.currentUser?.id) {
      Snackbar.warning('请先登录')
      return
  }

  const recipeId = recipe.value.id
  try {
      if (isFavorite.value) {
          await RecipeService.uncollectRecipe(userStore.currentUser.id, recipeId)
          isFavorite.value = false
          Snackbar.success('已取消收藏')
      } else {
          await RecipeService.collectRecipe(userStore.currentUser.id, recipeId)
          isFavorite.value = true
          Snackbar.success('已收藏')
      }
  } catch (e) {
      Snackbar.error('操作失败，请重试')
      console.error(e)
  }
}

</script>

<template>
  <div class="recipe-detail min-h-screen bg-[#FDFBF7] font-sans text-slate-800 pb-10">
    
    <!-- Navbar -->
    <div class="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-[#FDFBF7] border-b border-orange-100">
        <div class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-50 active:bg-orange-100 transition-colors" @click="goBack">
              <var-icon name="chevron-left" :size="24" color="#333" />
        </div>
        <div class="text-base font-bold text-gray-800 truncate px-4 max-w-[200px]">{{ recipe?.name }}</div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-50 active:bg-orange-100 transition-colors" @click="toggleLike">
              <var-icon
                :name="isFavorite ? 'heart' : 'heart-outline'"
                :color="isFavorite ? 'red' : '#333'"
                :size="24"
                :transition="200"
            />
        </div>
    </div>

    <div v-if="recipe" class="px-5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Title & Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {{ recipe.name }}
            </h1>
            <p v-if="recipe.description" class="text-sm text-gray-500 mb-4 leading-relaxed">
                {{ recipe.description }}
            </p>
            
            <!-- Tags / Stats -->
            <div class="flex flex-wrap gap-3">
                <div v-if="recipe.calories" class="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-bold rounded border border-orange-200 flex items-center gap-1">
                    <var-icon name="fire" size="12" />
                    <span>{{ recipe.calories }} kcal</span>
                </div>
                <div v-if="recipe.duration" class="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 flex items-center gap-1">
                    <var-icon name="clock" size="12" />
                    <span>{{ recipe.duration }}</span>
                </div>
                
                <!-- Tags -->
                <template v-if="recipe.tags && recipe.tags.length">
                    <div 
                        v-for="tag in recipe.tags" 
                        :key="tag"
                        class="px-2 py-1.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                    >
                        {{ tag }}
                    </div>
                </template>
            </div>
        </div>

        <div class="space-y-8">
            <!-- Ingredients Section -->
            <section>
                <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="w-1.5 h-5 bg-orange-500 rounded-full"></span>
                    食材清单
                </h2>
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                        v-for="(ing, idx) in ingredients" 
                        :key="idx" 
                        class="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-orange-50/30 transition-colors"
                    >
                        <span class="text-gray-800 font-medium text-[15px]">{{ ing.name }}</span>
                        <span class="text-gray-500 text-sm">{{ ing.amount }} {{ ing.unit }}</span>
                    </div>
                     <!-- Empty State -->
                    <div v-if="ingredients.length === 0" class="text-center py-6 text-gray-400 text-sm">
                        暂无食材信息
                    </div>
                </div>
            </section>

            <!-- Steps Section -->
            <section>
                <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="w-1.5 h-5 bg-orange-500 rounded-full"></span>
                    烹饪步骤
                </h2>
                <div class="space-y-4">
                    <div v-for="(step, idx) in steps" :key="idx" class="flex gap-4">
                        <div class="flex-shrink-0 mt-1">
                            <div class="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold border border-orange-200">
                                {{ idx + 1 }}
                            </div>
                        </div>
                        <div class="flex-1 pb-2 border-b border-gray-100 last:border-0">
                            <p class="text-gray-800 leading-relaxed text-[15px] mb-2 text-justify">{{ step.text }}</p>
                            <img v-if="step.imageUrl" :src="step.imageUrl" class="mt-2 rounded border border-gray-200 w-full h-40 object-cover bg-gray-50" />
                        </div>
                    </div>
                    <!-- Empty State -->
                    <div v-if="steps.length === 0" class="text-center py-6 text-gray-400 text-sm bg-white border border-gray-200 rounded-lg">
                        暂无步骤信息
                    </div>
                </div>
            </section>
        </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="flex justify-center items-center h-[60vh]">
          <var-loading type="cube" color="#f97316" size="large" />
    </div>

  </div>
</template>

<style scoped>
/* No custom styles needed, using Tailwind */
</style>
