<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const menus = [
  {
    name: 'วันนี้',
    path: '/today',
    icon: '◷',
  },
  {
    name: 'ปฏิทิน',
    path: '/calendar',
    icon: '▦',
  },
  {
    name: 'สถิติ',
    path: '/dashboard',
    icon: '▥',
  },
]
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-40
           hidden h-screen w-64
           border-r border-pink-100
           bg-white
           lg:block"
  >
    <div class="flex h-full flex-col p-5">

      <!-- Logo -->
      <div class="mb-8 flex items-center gap-3">
        <div
          class="flex h-11 w-11
                 items-center justify-center
                 rounded-2xl
                 bg-pink-100
                 text-2xl"
        >
          💻
        </div>

        <div>
          <h1
            class="text-lg font-bold
                   text-pink-600"
          >
            TechNo Queue
          </h1>

          <p
            class="text-xs text-pink-300"
          >
            ตารางการทำงานเทคโน
          </p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="flex items-center gap-3
                 rounded-2xl px-4 py-3
                 text-sm font-medium
                 text-pink-900/70
                 transition
                 hover:bg-pink-50
                 hover:text-pink-600"
          active-class="bg-pink-100 text-pink-600"
        >
          <span
            class="flex h-8 w-8
                   items-center justify-center
                   rounded-xl
                   bg-pink-50
                   text-lg"
          >
            {{ menu.icon }}
          </span>

          {{ menu.name }}
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="mt-auto">

        <!-- User -->
        <div
          class="flex items-center gap-3
                 border-t border-pink-100
                 pt-4"
        >
          <!-- Avatar -->
          <div
            class="flex h-10 w-10 shrink-0
                   items-center justify-center
                   rounded-full
                   bg-pink-100
                   text-sm font-bold
                   text-pink-600"
          >
            {{
              authStore.user?.email
                ?.charAt(0)
                ?.toUpperCase() ?? '?'
            }}
          </div>

          <!-- User info -->
          <div class="min-w-0">
            <p
              class="truncate text-sm
                     font-semibold
                     text-pink-900"
            >
              {{ authStore.user?.email ?? 'Guest' }}
            </p>

            <p
              class="mt-0.5 text-xs
                     text-pink-400"
            >
              {{
                authStore.isTechno
                  ? 'Techno'
                  : 'Viewer'
              }}
            </p>
          </div>
        </div>

      </div>
    </div>
  </aside>
</template>