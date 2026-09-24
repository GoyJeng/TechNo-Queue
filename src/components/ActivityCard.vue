<script setup lang="ts">
import type { Activity } from '../types/activity'

const props = defineProps<{
  activity: Activity
}>()

const emit = defineEmits<{
  click: [activity: Activity]
}>()

const statusMap = {
  pending: {
    label: 'รอดำเนินการ',
    class:
      'bg-orange-50 text-orange-500 border-orange-100',
    dot: 'bg-orange-400',
  },

  'in-progress': {
    label: 'กำลังทำ',
    class:
      'bg-blue-50 text-blue-500 border-blue-100',
    dot: 'bg-blue-400',
  },

  completed: {
    label: 'เสร็จแล้ว',
    class:
      'bg-green-50 text-green-500 border-green-100',
    dot: 'bg-green-400',
  },

  cancelled: {
    label: 'ยกเลิก',
    class:
      'bg-red-50 text-red-500 border-red-100',
    dot: 'bg-red-400',
  },
}

function openDetail() {
  emit('click', props.activity)
}
</script>

<template>
  <button
    type="button"
    class="group w-full text-left"
    @click="openDetail"
  >
    <div
      class="rounded-2xl
             border border-pink-100
             bg-white
             p-4
             shadow-[0_4px_20px_rgba(236,72,153,0.05)]
             transition-all
             hover:-translate-y-0.5
             hover:border-pink-200
             hover:shadow-[0_8px_30px_rgba(236,72,153,0.10)]"
    >
      <div
        class="flex items-start gap-4"
      >

        <!-- Time -->
        <div
          class="w-20 shrink-0"
        >
          <p
            class="text-sm font-bold
                   text-pink-800"
          >
            {{ activity.startTime }}
          </p>

          <p
            class="mt-1 text-xs
                   text-pink-300"
          >
            {{ activity.endTime }}
          </p>
        </div>

        <!-- Content -->
        <div
          class="min-w-0 flex-1"
        >
          <div
            class="flex flex-wrap
                   items-center gap-2"
          >
            <h3
              class="truncate
                     text-sm font-semibold
                     text-pink-900
                     group-hover:text-pink-600"
            >
              {{ activity.title }}
            </h3>

            <span
              class="rounded-full
                     border px-2.5 py-1
                     text-[11px]"
              :class="
                statusMap[
                  activity.status
                ].class
              "
            >
              <span
                class="mr-1 inline-block
                       h-1.5 w-1.5
                       rounded-full"
                :class="
                  statusMap[
                    activity.status
                  ].dot
                "
              />

              {{
                statusMap[
                  activity.status
                ].label
              }}
            </span>
          </div>

          <div
            v-if="activity.location"
            class="mt-2 text-xs
                   text-pink-400"
          >
            📍 {{ activity.location }}
          </div>
        </div>

        <!-- Arrow -->
        <div
          class="mt-1 text-pink-200
                 transition-transform
                 group-hover:translate-x-1
                 group-hover:text-pink-500"
        >
          →
        </div>
      </div>
    </div>
  </button>
</template>