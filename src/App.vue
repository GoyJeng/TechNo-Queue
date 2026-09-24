<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import AppSidebar from './components/AppSidebar.vue'
import MobileNav from './components/MobileNav.vue'

const route = useRoute()
const authStore = useAuthStore()

const isLoginPage = computed(() => {
  return route.path === '/login'
})

let subscription: {
  unsubscribe: () => void
} | null = null

onMounted(async () => {
  await authStore.loadUser()

  const {
    data: { subscription: authSubscription },
  } = authStore.listenToAuthChanges()

  subscription = authSubscription
})

onUnmounted(() => {
  subscription?.unsubscribe()
})
</script>

<template>
  <!-- หน้า Login ไม่มี Navbar -->
  <router-view v-if="isLoginPage" />

  <!-- หน้าอื่นมี Layout -->
  <div
    v-else
    class="min-h-screen bg-pink-50"
  >
    <AppSidebar />

    <div class="lg:pl-64">

      <main class="pb-20 lg:pb-0">
        <router-view />
      </main>
    </div>

    <MobileNav />
  </div>
</template>