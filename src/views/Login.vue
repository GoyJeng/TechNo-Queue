<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login(
      email.value,
      password.value
    )

    router.push('/today')
  } catch (error: any) {
    errorMessage.value =
      error?.message ?? 'เข้าสู่ระบบไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center
           justify-center bg-pink-50 px-4"
  >
    <div
      class="w-full max-w-md rounded-3xl
             border border-pink-100 bg-white
             p-8 shadow-xl"
    >
      <h1 class="text-2xl font-bold text-pink-900">
        Techno Login
      </h1>

      <p class="mt-2 text-sm text-pink-400">
        เข้าสู่ระบบสำหรับเจ้าหน้าที่ Techno
      </p>

      <form
        class="mt-8 space-y-5"
        @submit.prevent="handleLogin"
      >
        <div>
          <label class="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-xl border
                   border-pink-200 px-4 py-3"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-xl border
                   border-pink-200 px-4 py-3"
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-xl bg-red-50 p-3
                 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-pink-500
                 px-4 py-3 font-semibold text-white
                 hover:bg-pink-600
                 disabled:opacity-50"
        >
          {{
            loading
              ? 'กำลังเข้าสู่ระบบ...'
              : 'เข้าสู่ระบบ'
          }}
        </button>
      </form>
    </div>
  </div>
</template>