<template>
  <Teleport to="body">
    <div
      class="
        fixed
        inset-0
        z-40
        flex
        items-center
        justify-center
        bg-pink-950/20
        p-4
        backdrop-blur-sm
      "
      @click.self="close"
    >

      <div
        class="
          flex
          max-h-[85vh]
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-pink-100
          bg-white
          shadow-2xl
          shadow-pink-200/50
        "
      >

        <!-- Header -->

        <div
          class="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-pink-100
            px-5
            py-4
          "
        >

          <div>
            <p
              class="
                text-xs
                font-medium
                text-pink-400
              "
            >
              กิจกรรมประจำวัน
            </p>

            <h2
              class="
                mt-1
                text-lg
                font-bold
                text-pink-950
              "
            >
              {{ formattedDate }}
            </h2>

            <p
              class="
                mt-1
                text-xs
                text-pink-400
              "
            >
              {{ activities.length }} รายการ
            </p>
          </div>

          <button
            type="button"
            class="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-pink-400
              transition
              hover:bg-pink-50
              hover:text-pink-600
            "
            @click="close"
          >
            ✕
          </button>

        </div>

        <!-- Activity list -->

        <div
          class="
            overflow-y-auto
            p-5
          "
        >

          <!-- มีรายการ -->

          <div
            v-if="activities.length"
            class="space-y-3"
          >

            <button
              v-for="activity in activities"
              :key="activity.id"
              type="button"
              class="
                group
                w-full
                rounded-2xl
                border
                border-pink-100
                bg-pink-50/40
                p-4
                text-left
                transition
                hover:border-pink-200
                hover:bg-pink-50
                active:scale-[0.99]
              "
              @click="openActivity(activity)"
            >

              <div
                class="
                  flex
                  items-start
                  gap-3
                "
              >

                <!-- Time -->

                <div
                  class="
                    w-16
                    shrink-0
                  "
                >
                  <p
                    class="
                      text-sm
                      font-bold
                      text-pink-600
                    "
                  >
                    {{ activity.startTime }}
                  </p>

                  <p
                    class="
                      mt-0.5
                      text-xs
                      text-pink-300
                    "
                  >
                    {{ activity.endTime }}
                  </p>
                </div>

                <!-- Content -->

                <div
                  class="
                    min-w-0
                    flex-1
                  "
                >

                  <h3
                    class="
                      truncate
                      text-sm
                      font-semibold
                      text-pink-950
                    "
                  >
                    {{ activity.title }}
                  </h3>

                  <p
                    v-if="activity.location"
                    class="
                      mt-1
                      truncate
                      text-xs
                      text-pink-400
                    "
                  >
                    📍 {{ activity.location }}
                  </p>

                  <!-- Status -->

                  <span
                    class="
                      mt-2
                      inline-flex
                      rounded-full
                      px-2
                      py-1
                      text-[10px]
                      font-medium
                    "
                    :class="
                      statusMap[
                        activity.status
                      ].class
                    "
                  >
                    {{
                      statusMap[
                        activity.status
                      ].label
                    }}
                  </span>

                </div>

                <!-- Arrow -->

                <div
                  class="
                    pt-1
                    text-pink-300
                    transition
                    group-hover:translate-x-1
                    group-hover:text-pink-500
                  "
                >
                  →
                </div>

              </div>

            </button>

          </div>

          <!-- ไม่มีรายการ -->

          <div
            v-else
            class="
              py-10
              text-center
            "
          >

            <div
              class="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-pink-50
                text-3xl
              "
            >
              📅
            </div>

            <h3
              class="
                mt-4
                text-sm
                font-semibold
                text-pink-950
              "
            >
              ไม่มีรายการ
            </h3>

            <p
              class="
                mt-1
                text-xs
                text-pink-400
              "
            >
              วันนี้ยังไม่มีกิจกรรมที่บันทึกไว้
            </p>

          </div>

        </div>

        <!-- Footer -->

        <div
          class="
            shrink-0
            border-t
            border-pink-100
            p-4
          "
        >
          <button
            type="button"
            class="
              w-full
              rounded-xl
              bg-pink-500
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-pink-200
              transition
              hover:bg-pink-600
              active:scale-[0.99]
            "
            @click="close"
          >
            ปิด
          </button>
        </div>

      </div>

    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue'

import type {
  Activity,
} from '../types/activity'

const props = defineProps<{
  date: string
  activities: Activity[]
}>()

const emit = defineEmits<{
  close: []
  selectActivity: [
    activity: Activity
  ]
}>()

const statusMap = {
  pending: {
    label: 'รอดำเนินการ',
    class:
      'bg-yellow-50 text-yellow-600',
  },

  'in-progress': {
    label: 'กำลังทำ',
    class:
      'bg-blue-50 text-blue-600',
  },

  completed: {
    label: 'เสร็จแล้ว',
    class:
      'bg-green-50 text-green-600',
  },

  cancelled: {
    label: 'ยกเลิก',
    class:
      'bg-red-50 text-red-600',
  },
}

const formattedDate = computed(() => {
  const date =
    new Date(
      `${props.date}T00:00:00`
    )

  return new Intl.DateTimeFormat(
    'th-TH',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(date)
})

function close() {
  emit('close')
}

function openActivity(
  activity: Activity
) {
  emit(
    'selectActivity',
    activity
  )
}
</script>