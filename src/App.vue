<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  const profileStr = localStorage.getItem('user_profile')
  if (profileStr) {
    try {
      const user = JSON.parse(profileStr)
      userStore.updateProfile(user)
    } catch (e) {
      console.error('Failed to restore user profile:', e)
    }
  }
})
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
/* Global styles are imported in main.js */
</style>
