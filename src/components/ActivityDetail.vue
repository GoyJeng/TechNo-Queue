<script setup lang="ts">
import type {
  Activity,
  ActivityStatus,
} from '../types/activity'

const props = defineProps<{
  activity: Activity
}>()

const emit = defineEmits<{
  close: []
  edit: [activity: Activity]
  delete: [id: string]
  updateStatus: [
    id: string,
    status: ActivityStatus
  ]
}>()

const statusMap = {
  pending: {
    label: 'รอดำเนินการ',
    class:
      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dot: 'bg-yellow-400',
  },

  'in-progress': {
    label: 'กำลังทำ',
    class:
      'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },

  completed: {
    label: 'เสร็จแล้ว',
    class:
      'bg-green-500/10 text-green-400 border-green-500/20',
    dot: 'bg-green-400',
  },

  cancelled: {
    label: 'ยกเลิก',
    class:
      'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-400',
  },
}

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`)

  return new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value)
}

function formatDuration(seconds?: number) {
  if (!seconds) {
    return '-'
  }

  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor(
    (seconds % 3600) / 60
  )

  if (hours > 0) {
    return `${hours} ชม. ${minutes} นาที`
  }

  return `${minutes} นาที`
}

function changeStatus(
  event: Event
) {
  const target =
    event.target as HTMLSelectElement

  const status =
    target.value as ActivityStatus

  emit(
    'updateStatus',
    props.activity.id,
    status
  )
}

function handleDelete() {
  const confirmed = window.confirm(
    `ต้องการลบกิจกรรม "${props.activity.title}" หรือไม่?`
  )

  if (!confirmed) {
    return
  }

  emit(
    'delete',
    props.activity.id
  )
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center
           justify-center bg-black/70 p-4
           backdrop-blur-sm"
    @click.self="emit('close')"
  >

    <!-- Modal -->
    <div
      class="flex max-h-[90vh] w-full max-w-lg
             flex-col overflow-hidden
             rounded-3xl border border-zinc-800
             bg-zinc-950 shadow-2xl"
    >

      <!-- =========================
           Header
      ========================== -->

      <div
        class="flex shrink-0 items-center
               justify-between border-b
               border-zinc-800 px-5 py-4"
      >
        <div>
          <p class="text-xs text-zinc-500">
            Activity
          </p>

<h2
  class="text-lg font-semibold
         text-pink-900"
>
  รายละเอียดกิจกรรม
</h2>
        </div>

        <button
          type="button"
          class="flex h-9 w-9 items-center
                 justify-center rounded-full
                 text-zinc-400
                 transition
                 hover:bg-zinc-800
                 hover:text-white"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- =========================
           Content
      ========================== -->

      <div
        class="overflow-y-auto p-5"
      >

        <!-- Title -->
        <div>
          <h3
            class="text-2xl font-bold
                   leading-tight text-zinc-400"
          >
            {{ activity.title }}
          </h3>

          <!-- Current Status -->
          <div
            class="mt-3 inline-flex
                   items-center gap-2
                   rounded-full border
                   px-3 py-1.5 text-xs"
            :class="
              statusMap[activity.status].class
            "
          >
            <span
              class="h-2 w-2 rounded-full"
              :class="
                statusMap[activity.status].dot
              "
            />

            {{
              statusMap[
                activity.status
              ].label
            }}
          </div>
        </div>

        <!-- =========================
             Change Status
        ========================== -->

        <div
          class="mt-6 rounded-2xl
                 border border-zinc-800
                 bg-zinc-900/70 p-4"
        >
          <label
            for="activity-status"
            class="text-sm font-medium
                   text-zinc-300"
          >
            สถานะ
          </label>

          <select
            id="activity-status"
            :value="activity.status"
            class="mt-2 w-full rounded-xl
                   border border-zinc-700
                   bg-zinc-950 px-4 py-3
                   text-sm text-zinc-200
                   outline-none
                   transition
                   focus:border-violet-500
                   focus:ring-2
                   focus:ring-violet-500/20"
            @change="changeStatus"
          >
            <option value="pending">
              รอดำเนินการ
            </option>

            <option value="in-progress">
              กำลังทำ
            </option>

            <option value="completed">
              เสร็จแล้ว
            </option>

            <option value="cancelled">
              ยกเลิก
            </option>
          </select>
        </div>

        <!-- =========================
             Information
        ========================== -->

        <div
          class="mt-4 grid gap-3
                 sm:grid-cols-2"
        >

          <!-- Date -->
          <div
            class="rounded-2xl
                   bg-zinc-900 p-4"
          >
            <p
              class="text-xs text-zinc-500"
            >
              วันที่
            </p>

            <p
              class="mt-1 text-sm
                     leading-6 text-zinc-200"
            >
              {{ formatDate(activity.date) }}
            </p>
          </div>

          <!-- Time -->
          <div
            class="rounded-2xl
                   bg-zinc-900 p-4"
          >
            <p
              class="text-xs text-zinc-500"
            >
              เวลา
            </p>

            <p
              class="mt-1 text-sm
                     text-zinc-200"
            >
              {{ activity.startTime }}
              -
              {{ activity.endTime }}
            </p>
          </div>

          <!-- Location -->
          <div
            class="rounded-2xl
                   bg-zinc-900 p-4
                   sm:col-span-2"
          >
            <p
              class="text-xs text-zinc-500"
            >
              สถานที่
            </p>

            <p
              class="mt-1 text-sm
                     text-zinc-200"
            >
              {{
                activity.location ||
                'ไม่ได้ระบุสถานที่'
              }}
            </p>
          </div>

        </div>

        <!-- =========================
             Description
        ========================== -->

        <div
          class="mt-4 rounded-2xl
                 bg-zinc-900 p-4"
        >
          <p
            class="text-xs text-zinc-500"
          >
            รายละเอียด
          </p>

          <p
            class="mt-2 whitespace-pre-wrap
                   text-sm leading-6
                   text-zinc-300"
          >
            {{
              activity.description ||
              'ไม่มีรายละเอียด'
            }}
          </p>
        </div>

        <!-- =========================
             Duration
        ========================== -->

        <div
          v-if="activity.duration"
          class="mt-4 rounded-2xl
                 border border-zinc-800
                 bg-zinc-900/50 p-4"
        >
          <div
            class="flex items-center
                   justify-between"
          >
            <div>
              <p
                class="text-xs text-zinc-500"
              >
                เวลาที่ใช้จริง
              </p>

              <p
                class="mt-1 text-lg
                       font-semibold
                       text-white"
              >
                {{
                  formatDuration(
                    activity.duration
                  )
                }}
              </p>
            </div>

            <div
              class="text-2xl"
            >
              ⏱️
            </div>
          </div>
        </div>

        <!-- Started / Completed -->
        <div
          v-if="
            activity.startedAt ||
            activity.completedAt
          "
          class="mt-4 grid gap-3
                 sm:grid-cols-2"
        >

          <div
            v-if="activity.startedAt"
            class="rounded-2xl
                   bg-zinc-900 p-4"
          >
            <p
              class="text-xs text-zinc-500"
            >
              เริ่มทำ
            </p>

            <p
              class="mt-1 text-sm
                     text-zinc-300"
            >
              {{
                new Date(
                  activity.startedAt
                ).toLocaleString(
                  'th-TH'
                )
              }}
            </p>
          </div>

          <div
            v-if="activity.completedAt"
            class="rounded-2xl
                   bg-zinc-900 p-4"
          >
            <p
              class="text-xs text-zinc-500"
            >
              เสร็จสิ้น
            </p>

            <p
              class="mt-1 text-sm
                     text-zinc-300"
            >
              {{
                new Date(
                  activity.completedAt
                ).toLocaleString(
                  'th-TH'
                )
              }}
            </p>
          </div>

        </div>

      </div>

      <!-- =========================
           Footer
      ========================== -->

      <div
        class="flex shrink-0 gap-3
               border-t border-zinc-800
               p-5"
      >

        <!-- Edit -->
        <button
          type="button"
  class="flex-1 rounded-xl
         bg-pink-50
         px-4 py-3
         text-sm font-medium
         text-pink-700
         transition
         hover:bg-pink-100"
          @click="
            emit(
              'edit',
              activity
            )
          "
        >
          ✏️ แก้ไข
        </button>

        <!-- Delete -->
        <button
          type="button"
          class="flex-1 rounded-xl
                 bg-red-500/10 px-4 py-3
                 text-sm font-medium
                 text-red-400
                 transition
                 hover:bg-red-500/20"
          @click="handleDelete"
        >
          🗑 ลบ
        </button>

      </div>

    </div>
  </div>
</template>