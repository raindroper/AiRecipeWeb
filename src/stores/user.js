import { defineStore } from 'pinia'
import { UserProfile } from '@/models/UserProfile'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    updateProfile(data) {
      if (!data) {
        this.currentUser = null
        return
      }
      if (!this.currentUser) {
        this.currentUser = new UserProfile(data)
      } else {
        Object.assign(this.currentUser, data)
      }
    }
  }
})
