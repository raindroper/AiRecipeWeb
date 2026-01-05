<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe'
import { Snackbar } from '@varlet/ui'

const router = useRouter()
const recipeStore = useRecipeStore()

const form = reactive({
  title: '',
  coverUrl:
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Default placeholder
  calories: '',
  timeRequired: '',
  difficulty: 'medium',
  ingredients: [{ name: '', amount: '', unit: '' }],
  steps: [{ text: '' }],
})

const addIngredient = () => {
  form.ingredients.push({ name: '', amount: '', unit: '' })
}

const removeIngredient = (index) => {
  form.ingredients.splice(index, 1)
}

const addStep = () => {
  form.steps.push({ text: '' })
}

const removeStep = (index) => {
  form.steps.splice(index, 1)
}

const submit = () => {
  if (!form.title) {
    Snackbar.warning('Please enter a title')
    return
  }

  // Convert complex objects to JSON strings as per our Model/DB schema requirement
  // In a real app, we might handle this in the Service layer or Store,
  // but our Recipe model expects stringified JSON in constructor or we adapt it.
  // Actually, the Recipe model constructor calls parseJson.
  // If we pass objects directly, parseJson might fail if it expects string,
  // OR we should adjust Recipe model to handle both.
  // Let's look at Recipe.js:
  // this.ingredients = this.parseJson(data.ingredients, []);
  // parseJson checks if (typeof value === 'string'). If not, it returns value.
  // So passing objects directly is fine!

  const recipeData = {
    title: form.title,
    coverUrl: form.coverUrl,
    calories: Number(form.calories) || 0,
    timeRequired: Number(form.timeRequired) || 0,
    difficulty: form.difficulty,
    ingredients: JSON.stringify(form.ingredients), // We simulate DB storage format which is string
    steps: JSON.stringify(form.steps),
    tags: JSON.stringify(['User Created']), // Default tag
    aiTags: JSON.stringify([]),
    toolTags: JSON.stringify([]),
  }

  recipeStore.addRecipe(recipeData)
  Snackbar.success('Recipe Created!')
  router.push('/')
}
</script>

<template>
  <div class="create-recipe pb-16">
    <var-app-bar title="New Recipe" fixed safe-area-top>
      <template #right>
        <var-button text text-color="#fff" @click="submit"> Save </var-button>
      </template>
    </var-app-bar>

    <div class="pt-16 p-4">
      <var-space direction="column" :size="16">
        <var-input placeholder="Recipe Title" v-model="form.title" variant="outlined" />

        <var-input placeholder="Cover Image URL" v-model="form.coverUrl" variant="outlined" />

        <div class="flex gap-2">
          <var-input
            placeholder="Calories (kcal)"
            v-model="form.calories"
            type="number"
            variant="outlined"
          />
          <var-input
            placeholder="Time (min)"
            v-model="form.timeRequired"
            type="number"
            variant="outlined"
          />
        </div>

        <var-select placeholder="Difficulty" v-model="form.difficulty" variant="outlined">
          <var-option label="Easy" value="easy" />
          <var-option label="Medium" value="medium" />
          <var-option label="Hard" value="hard" />
        </var-select>

        <var-paper :elevation="1" class="p-3 rounded">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">Ingredients</h3>
            <var-button type="primary" size="mini" round @click="addIngredient">
              <var-icon name="plus" />
            </var-button>
          </div>

          <div
            v-for="(ing, index) in form.ingredients"
            :key="index"
            class="mb-2 flex gap-2 items-center"
          >
            <var-input placeholder="Name" v-model="ing.name" size="small" class="flex-1" />
            <var-input placeholder="Amt" v-model="ing.amount" size="small" class="w-16" />
            <var-input placeholder="Unit" v-model="ing.unit" size="small" class="w-16" />
            <var-button text round size="mini" color="transparent" @click="removeIngredient(index)">
              <var-icon name="minus-circle" color="red" />
            </var-button>
          </div>
        </var-paper>

        <var-paper :elevation="1" class="p-3 rounded">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">Steps</h3>
            <var-button type="primary" size="mini" round @click="addStep">
              <var-icon name="plus" />
            </var-button>
          </div>

          <div v-for="(step, index) in form.steps" :key="index" class="mb-2 flex gap-2 items-start">
            <span class="mt-2 text-sm text-gray-500">{{ index + 1 }}.</span>
            <var-input
              type="textarea"
              placeholder="Describe this step..."
              v-model="step.text"
              rows="2"
              class="flex-1"
            />
            <var-button
              text
              round
              size="mini"
              color="transparent"
              class="mt-1"
              @click="removeStep(index)"
            >
              <var-icon name="minus-circle" color="red" />
            </var-button>
          </div>
        </var-paper>
      </var-space>
    </div>
  </div>
</template>
