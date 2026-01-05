import { defineStore } from 'pinia'
import { Recipe } from '@/models/Recipe'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [
      new Recipe({
        id: '1',
        title: 'Healthy Chicken Salad',
        coverUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        author: 'Chef Anna',
        calories: 350,
        difficulty: 'easy',
        timeRequired: 15,
        ingredients: JSON.stringify([
          { name: 'Chicken', amount: '200', unit: 'g' },
          { name: 'Lettuce', amount: '1', unit: 'head' },
        ]),
        steps: JSON.stringify([
          { text: 'Grill chicken', imageUrl: '' },
          { text: 'Mix with veggies', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Low Carb', 'Lunch']),
        aiTags: JSON.stringify(['High Protein']),
        toolTags: JSON.stringify(['Grill']),
      }),
      new Recipe({
        id: '2',
        title: 'Air Fryer Fries',
        coverUrl:
          'https://images.unsplash.com/photo-1630384060421-a4323ce5663e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        author: 'Mike Cooks',
        calories: 280,
        difficulty: 'medium',
        timeRequired: 25,
        ingredients: JSON.stringify([
          { name: 'Potatoes', amount: '3', unit: 'pcs' },
          { name: 'Oil', amount: '1', unit: 'tbsp' },
        ]),
        steps: JSON.stringify([
          { text: 'Cut potatoes', imageUrl: '' },
          { text: 'Air fry at 200C', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Snack']),
        toolTags: JSON.stringify(['Air Fryer']),
        aiTags: JSON.stringify(['Crispy']),
      }),
      new Recipe({
        id: '3',
        title: 'Super Sweet Donut',
        coverUrl:
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        author: 'Sweet Tooth',
        calories: 500,
        ingredients: JSON.stringify([
          { name: 'Flour', amount: '500', unit: 'g' },
          { name: 'Sugar', amount: '200', unit: 'g' },
        ]),
        steps: JSON.stringify([
          { text: 'Mix dough', imageUrl: '' },
          { text: 'Fry', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Dessert', 'Sweet']),
        aiTags: JSON.stringify(['Sugar']),
      }),
      new Recipe({
        id: '4',
        title: 'Peanut Butter Cookies',
        coverUrl:
          'https://images.unsplash.com/photo-1499636138143-bd630f5cf386?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        author: 'Grandma',
        calories: 450,
        ingredients: JSON.stringify([
          { name: 'Peanut Butter', amount: '1', unit: 'cup' },
          { name: 'Flour', amount: '2', unit: 'cups' },
        ]),
        steps: JSON.stringify([
          { text: 'Mix ingredients', imageUrl: '' },
          { text: 'Bake', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Dessert']),
        aiTags: JSON.stringify(['High Fat']),
        toolTags: JSON.stringify(['Oven']),
      }),
    ],
  }),
  actions: {
    addRecipe(recipeData) {
      const newRecipe = new Recipe({
        ...recipeData,
        id: Date.now().toString(), // Simple ID generation
        author: 'Me', // Current user
        likeCount: 0,
        views: 0,
      })
      this.recipes.unshift(newRecipe)
    },
    getRecipeById(id) {
      return this.recipes.find((r) => r.id === id)
    },
    toggleLike(id) {
      const recipe = this.recipes.find((r) => r.id === id)
      if (recipe) {
        // Toggle logic (simplified)
        // In real app, this would update UserCollect table
        recipe.isLiked = !recipe.isLiked
        if (recipe.isLiked) recipe.likeCount++
        else recipe.likeCount--
      }
    },
  },
})
