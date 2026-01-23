
import { defineStore } from 'pinia'
import { Recipe } from '@/models/Recipe'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [
      new Recipe({
        id: '1',
        name: 'Healthy Chicken Salad',
        description: 'A fresh and nutritious salad perfect for lunch.',
        userId: 'user_1',
        calories: '350',
        duration: '20 min',
        ingredients: JSON.stringify([
          { name: 'Chicken', amount: '200', unit: 'g' },
          { name: 'Lettuce', amount: '1', unit: 'head' },
        ]),
        steps: JSON.stringify([
          { text: 'Grill chicken', imageUrl: '' },
          { text: 'Mix with veggies', imageUrl: '' },
        ]),
        tags: JSON.stringify(['High Protein', 'Low Carb', 'Easy']),
        createdAt: 1672531200000,
        status: 1
      }),
      new Recipe({
        id: '2',
        name: 'Air Fryer Fries',
        description: 'Crispy fries with less oil.',
        userId: 'user_2',
        calories: '280',
        duration: '15 min',
        ingredients: JSON.stringify([
          { name: 'Potatoes', amount: '3', unit: 'pcs' },
          { name: 'Oil', amount: '1', unit: 'tbsp' },
        ]),
        steps: JSON.stringify([
          { text: 'Cut potatoes', imageUrl: '' },
          { text: 'Air fry at 200C', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Crispy', 'Snack', 'Air Fryer', 'Medium']),
        createdAt: 1672617600000,
        status: 1
      }),
      new Recipe({
        id: '3',
        name: 'Super Sweet Donut',
        description: 'Delicious sweet treat for dessert.',
        userId: 'user_3',
        calories: '500',
        duration: '45 min',
        ingredients: JSON.stringify([
          { name: 'Flour', amount: '500', unit: 'g' },
          { name: 'Sugar', amount: '200', unit: 'g' },
        ]),
        steps: JSON.stringify([
          { text: 'Mix dough', imageUrl: '' },
          { text: 'Fry', imageUrl: '' },
        ]),
        tags: JSON.stringify(['Sugar', 'Dessert', 'Hard']),
        createdAt: 1672704000000,
        status: 1
      }),
      new Recipe({
        id: '4',
        name: 'Peanut Butter Cookies',
        description: 'Classic homemade cookies.',
        userId: 'user_4',
        calories: '450',
        duration: '30 min',
        ingredients: JSON.stringify([
          { name: 'Peanut Butter', amount: '1', unit: 'cup' },
          { name: 'Flour', amount: '2', unit: 'cups' },
        ]),
        steps: JSON.stringify([
          { text: 'Mix ingredients', imageUrl: '' },
          { text: 'Bake', imageUrl: '' },
        ]),
        tags: JSON.stringify(['High Fat', 'Dessert', 'Oven', 'Easy']),
        createdAt: 1672790400000,
        status: 1
      }),
    ],
  }),
  actions: {
    addRecipe(recipeData) {
      const newRecipe = new Recipe({
        ...recipeData,
        id: Date.now().toString(),
        userId: 'me', // TODO: Replace with actual current user ID
        createdAt: Date.now(),
        status: 1
      })
      this.recipes.unshift(newRecipe)
      return newRecipe
    },
    getRecipeById(id) {
      return this.recipes.find((r) => r.id === id)
    },
  },
})
