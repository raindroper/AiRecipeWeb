<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe'
import { Recipe } from '@/models/Recipe'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const recipe = ref(new Recipe())

onMounted(() => {
  const id = route.params.id
  const found = recipeStore.getRecipeById(id)
  if (found) {
    recipe.value = found
  } else {
    // Handle not found
  }
})

const goBack = () => {
  router.back()
}

const toggleLike = () => {
  recipeStore.toggleLike(recipe.value.id)
  // Force update local ref if needed, or rely on reactivity if we used computed
  // Since recipe is a ref copy, we might need to sync.
  // Better: make recipe a computed property or use store directly.
}
</script>

<template>
  <div class="recipe-detail pb-4">
    <var-app-bar :title="recipe.title" fixed safe-area-top>
      <template #left>
        <var-button round text color="transparent" text-color="#fff" @click="goBack">
          <var-icon name="chevron-left" :size="24" />
        </var-button>
      </template>
      <template #right>
        <var-button round text color="transparent" text-color="#fff" @click="toggleLike">
          <var-icon
            :name="recipe.isLiked ? 'heart' : 'heart-outline'"
            :color="recipe.isLiked ? 'red' : '#fff'"
            :size="24"
          />
        </var-button>
      </template>
    </var-app-bar>

    <div class="pt-14">
      <var-image :src="recipe.coverUrl" height="250px" fit="cover" />

      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">{{ recipe.title }}</h1>
          <div class="text-gray-500 text-sm">by {{ recipe.author }}</div>
        </div>

        <div class="flex gap-4 mb-6 text-center">
          <div class="flex-1 bg-gray-100 p-2 rounded">
            <div class="font-bold">{{ recipe.calories }}</div>
            <div class="text-xs text-gray-500">kcal</div>
          </div>
          <div class="flex-1 bg-gray-100 p-2 rounded">
            <div class="font-bold">{{ recipe.timeRequired }}</div>
            <div class="text-xs text-gray-500">min</div>
          </div>
          <div class="flex-1 bg-gray-100 p-2 rounded">
            <div class="font-bold capitalize">{{ recipe.difficulty }}</div>
            <div class="text-xs text-gray-500">level</div>
          </div>
        </div>

        <var-tabs class="mb-4">
          <var-tab>Ingredients</var-tab>
          <var-tab>Steps</var-tab>
        </var-tabs>

        <!-- Simplified for MVP, ideally use v-model on tabs -->

        <div class="mb-6">
          <h3 class="font-bold text-lg mb-2">Ingredients</h3>
          <var-cell v-for="(ing, index) in recipe.ingredients" :key="index" border>
            <template #default>
              <div class="flex justify-between">
                <span>{{ ing.name }}</span>
                <span class="text-gray-500">{{ ing.amount }} {{ ing.unit }}</span>
              </div>
            </template>
          </var-cell>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-2">Steps</h3>
          <div v-for="(step, index) in recipe.steps" :key="index" class="mb-4 flex gap-3">
            <div
              class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm"
            >
              {{ index + 1 }}
            </div>
            <div>
              <p>{{ step.text }}</p>
              <var-image
                v-if="step.imageUrl"
                :src="step.imageUrl"
                class="mt-2 rounded"
                height="150"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
