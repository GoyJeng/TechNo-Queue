<template>
  <header
    class="
      sticky
      top-0
      z-30
      border-b
      border-zinc-800
      bg-zinc-950/90
      px-4
      py-4
      backdrop-blur
      lg:px-8
    "
  >

    <div
      class="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <div>
        <p
          class="
            text-xs
            text-zinc-500
          "
        >
          {{ formattedDate }}
        </p>

        <h1
          class="
            mt-1
            text-lg
            font-semibold
          "
        >
          {{ title }}
        </h1>
      </div>

      <button
        @click="$emit('add')"
        class="
          rounded-xl
          bg-pink-500
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:bg-pink-400
        "
      >
        <span class="sm:hidden">
          +
        </span>

        <span class="hidden sm:inline">
          + เพิ่มกิจกรรม
        </span>
      </button>

    </div>

  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
}>()

defineEmits<{
  add: []
}>()

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(
    'th-TH',
    {
      dateStyle: 'long',
    }
  ).format(new Date())
})
</script>