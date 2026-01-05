import { defineStore } from 'pinia'
import { UserProfile } from '@/models/UserProfile'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: new UserProfile({
      id: 'u1',
      nickname: 'Healthy Eater',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      // Stored as strings in DB simulation
      bodyMetrics: JSON.stringify({ height: 175, weight: 70, age: 30, gender: 'male' }),
      healthConfig: JSON.stringify({ 
        chronicDiseases: ['Diabetes'], // Added Diabetes to test filter
        allergies: ['Peanuts'], 
        dietaryGoals: ['Muscle Gain'] 
      }),
      kitchenProfile: JSON.stringify({ 
        appliances: ['Air Fryer', 'Blender'], // Added Air Fryer to test rank
        spices: ['Salt', 'Pepper'] 
      })
    })
  }),
  actions: {
    updateProfile(data) {
      // Logic to update state and ideally sync with backend
      Object.assign(this.currentUser, data)
    }
  }
})
