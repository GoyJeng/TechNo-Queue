<template>
  <span
    class="
      inline-flex
      items-center
      gap-1.5
      rounded-full
      px-2.5
      py-1
      text-xs
      font-medium
    "
    :class="statusClass"
  >
    <span>
      {{ statusIcon }}
    </span>

    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  ActivityStatus,
} from '../types/activity'

const props = defineProps<{
  status: ActivityStatus
}>()

const statusText = computed(() => {
  const map = {
    pending: 'รอดำเนินการ',
    'in-progress': 'กำลังทำ',
    completed: 'เสร็จแล้ว',
    cancelled: 'ยกเลิก',
  }

  return map[props.status]
})

const statusIcon = computed(() => {
  const map = {
    pending: '○',
    'in-progress': '◉',
    completed: '✓',
    cancelled: '×',
  }

  return map[props.status]
})

const statusClass = computed(() => {
  const map = {
    pending:
      'bg-amber-500/10 text-amber-400',

    'in-progress':
      'bg-blue-500/10 text-blue-400',

    completed:
      'bg-emerald-500/10 text-emerald-400',

    cancelled:
      'bg-red-500/10 text-red-400',
  }

  return map[props.status]
})
</script>