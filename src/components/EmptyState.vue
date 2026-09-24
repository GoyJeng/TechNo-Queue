<template>
  <div
    class="
      flex
      min-h-64
      flex-col
      items-center
      justify-center
      rounded-2xl
      border
      border-dashed
      border-zinc-800
      p-8
      text-center
    "
  >

    <div
      class="
        mb-4
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-zinc-900
        text-2xl
      "
    >
      {{ icon }}
    </div>

    <h3
      class="
        font-medium
        text-white
      "
    >
      {{ title }}
    </h3>

    <p
      class="
        mt-2
        max-w-sm
        text-sm
        text-zinc-500
      "
    >
      {{ description }}
    </p>

    <button
      v-if="showButton"
      @click="$emit('action')"
      class="
        mt-5
        rounded-xl
        bg-pink-500
        px-4
        py-2.5
        text-sm
        font-medium
        hover:bg-pink-400
      "
    >
      + เพิ่มกิจกรรม
    </button>

  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    icon?: string
    showButton?: boolean
  }>(),
  {
    icon: '📋',
    showButton: false,
  }
)

defineEmits<{
  action: []
}>()
</script>