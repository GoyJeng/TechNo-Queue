import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

type Role = 'techno' | 'viewer'

interface Profile {
  id: string
  role: Role
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => {
    return !!user.value
  })

  const isTechno = computed(() => {
    return profile.value?.role === 'techno'
  })

  async function loadUser() {
    loading.value = true

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Get session error:', error)

      user.value = null
      profile.value = null
      loading.value = false

      return
    }

    user.value = session?.user ?? null

    if (session?.user) {
      await loadProfile(session.user.id)
    } else {
      profile.value = null
    }

    loading.value = false
  }

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile error:', error)
      profile.value = null
      return
    }

    profile.value = data
  }

  async function login(
    email: string,
    password: string
  ) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      throw error
    }

    await loadUser()
  }

  async function logout() {
    const { error } =
      await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return
    }

    user.value = null
    profile.value = null
  }

  function listenToAuthChanges() {
    return supabase.auth.onAuthStateChange(
      async (_event, session) => {
        user.value = session?.user ?? null

        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          profile.value = null
        }

        loading.value = false
      }
    )
  }

  return {
    user,
    profile,
    loading,

    isLoggedIn,
    isTechno,

    loadUser,
    login,
    logout,
    listenToAuthChanges,
  }
})