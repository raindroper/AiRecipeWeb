<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.initAuth()
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
