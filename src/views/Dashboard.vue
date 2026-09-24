<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivityStore } from '../stores/activityStore'

const activityStore = useActivityStore()

type Range = 'week' | 'month' | 'year'

const selectedRange = ref<Range>('week')

const rangeOptions = [
  {
    value: 'week' as Range,
    label: 'สัปดาห์',
  },
  {
    value: 'month' as Range,
    label: 'เดือน',
  },
  {
    value: 'year' as Range,
    label: 'ปี',
  },
]

const completedCount = computed(
  () => activityStore.completedCount
)

const totalActivities = computed(
  () => activityStore.activities.length
)

const inProgressCount = computed(
  () => activityStore.inProgressCount
)

const totalHours = computed(() => {
  return (
    activityStore.totalDuration / 3600
  ).toFixed(1)
})

function getDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function startOfWeek(date: Date) {
  const result = new Date(date)

  const day = result.getDay()

  const diff =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() + diff
  )

  result.setHours(0, 0, 0, 0)

  return result
}

function getWeekData() {
  const now = new Date()
  const start = startOfWeek(now)

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(start)

      date.setDate(
        start.getDate() + index
      )

      const key = getDateKey(date)

      const activities =
        activityStore.activities.filter(
          activity =>
            activity.date === key
        )

      const completed =
        activities.filter(
          activity =>
            activity.status ===
            'completed'
        ).length

      return {
        label: new Intl.DateTimeFormat(
          'th-TH',
          {
            weekday: 'short',
          }
        ).format(date),

        date: key,

        value: activities.length,

        completed,
      }
    }
  )
}

function getMonthData() {
  const now = new Date()

  return Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date(now)

      date.setDate(
        now.getDate() - 29 + index
      )

      const key = getDateKey(date)

      const activities =
        activityStore.activities.filter(
          activity =>
            activity.date === key
        )

      return {
        label: `${date.getDate()}`,

        date: key,

        value: activities.length,

        completed:
          activities.filter(
            activity =>
              activity.status ===
              'completed'
          ).length,
      }
    }
  )
}

function getYearData() {
  const now = new Date()

  return Array.from(
    { length: 12 },
    (_, index) => {
      const month = index

      const activities =
        activityStore.activities.filter(
          activity => {
            const date =
              new Date(
                `${activity.date}T00:00:00`
              )

            return (
              date.getFullYear() ===
                now.getFullYear() &&
              date.getMonth() ===
                month
            )
          }
        )

      return {
        label:
          new Intl.DateTimeFormat(
            'th-TH',
            {
              month: 'short',
            }
          ).format(
            new Date(
              now.getFullYear(),
              month,
              1
            )
          ),

        value: activities.length,

        completed:
          activities.filter(
            activity =>
              activity.status ===
              'completed'
          ).length,
      }
    }
  )
}

const chartData = computed(() => {
  if (selectedRange.value === 'week') {
    return getWeekData()
  }

  if (selectedRange.value === 'month') {
    return getMonthData()
  }

  return getYearData()
})

/*
|--------------------------------------------------------------------------
| Chart
|--------------------------------------------------------------------------
*/

const maxValue = computed(() => {
  const max = Math.max(
    ...chartData.value.map(
      item => item.value
    ),
    1
  )

  /*
   * อย่างน้อยให้กราฟมีแกน Y 0 - 4
   * จะได้ไม่แบนติดพื้นเวลามีกิจกรรมน้อย
   */
  return Math.max(max, 4)
})

const chartPoints = computed(() => {
  const width = 1000
  const height = 300

  const paddingX = 55
  const paddingY = 30

  const usableWidth =
    width - paddingX * 2

  const usableHeight =
    height - paddingY * 2

  return chartData.value.map(
    (item, index) => {
      const x =
        paddingX +
        (index /
          Math.max(
            chartData.value.length - 1,
            1
          )) *
          usableWidth

      const y =
        height -
        paddingY -
        (item.value / maxValue.value) *
          usableHeight

      return {
        ...item,
        x,
        y,
      }
    }
  )
})

/*
|--------------------------------------------------------------------------
| Y Axis
|--------------------------------------------------------------------------
*/

const yAxisLabels = computed(() => {
  const steps = 4

  return Array.from(
    { length: steps + 1 },
    (_, index) => {
      const value =
        maxValue.value -
        (index / steps) *
          maxValue.value

      const y =
        30 +
        (index / steps) * 240

      return {
        value: Math.round(value),
        y,
      }
    }
  )
})

/*
|--------------------------------------------------------------------------
| Hover
|--------------------------------------------------------------------------
*/

const hoveredPoint = ref<number | null>(
  null
)

function handlePointEnter(index: number) {
  hoveredPoint.value = index
}

function handlePointLeave() {
  hoveredPoint.value = null
}

/*
|--------------------------------------------------------------------------
| Line
|--------------------------------------------------------------------------
*/

const linePath = computed(() => {
  return chartPoints.value
    .map(
      (point, index) =>
        `${
          index === 0 ? 'M' : 'L'
        } ${point.x} ${point.y}`
    )
    .join(' ')
})

/*
|--------------------------------------------------------------------------
| Area
|--------------------------------------------------------------------------
*/

const areaPath = computed(() => {
  if (!chartPoints.value.length) {
    return ''
  }

  const points =
    chartPoints.value

  const first = points[0]

  const last =
    points[points.length - 1]

  const bottom = 270

  return `
    M ${first.x} ${bottom}
    L ${points
      .map(
        point =>
          `${point.x} ${point.y}`
      )
      .join(' L ')}
    L ${last.x} ${bottom}
    Z
  `
})

/*
|--------------------------------------------------------------------------
| Title
|--------------------------------------------------------------------------
*/

const chartTitle = computed(() => {
  if (selectedRange.value === 'week') {
    return 'กิจกรรมในสัปดาห์นี้'
  }

  if (selectedRange.value === 'month') {
    return 'กิจกรรมในช่วง 30 วัน'
  }

  return 'กิจกรรมในปีนี้'
})

const chartTotal = computed(() =>
  chartData.value.reduce(
    (sum, item) =>
      sum + item.value,
    0
  )
)
</script>

<template>
  <section
    class="mx-auto max-w-7xl px-4 py-6
           sm:px-6 lg:px-8"
  >

    <!-- =====================================================
         Header
    ====================================================== -->

    <div
      class="flex flex-col gap-4
             sm:flex-row
             sm:items-end
             sm:justify-between"
    >
      <div>
        <p
          class="text-sm font-medium
                 text-pink-500"
        >
          Overview
        </p>

        <h1
          class="mt-1 text-3xl font-bold
                 text-pink-950"
        >
          Dashboard
        </h1>

        <p
          class="mt-2 text-sm text-zinc-500"
        >
          ภาพรวมกิจกรรมและเวลาที่ใช้
        </p>
      </div>

      <!-- Range -->
      <div
        class="flex rounded-xl
               border border-pink-100
               bg-white p-1
               shadow-sm"
      >
        <button
          v-for="option in rangeOptions"
          :key="option.value"
          type="button"
          class="rounded-lg px-4 py-2
                 text-sm font-medium
                 transition"
          :class="
            selectedRange === option.value
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'
          "
          @click="
            selectedRange = option.value
          "
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- =====================================================
         Stats
    ====================================================== -->

    <div
      class="mt-8 grid gap-4
             sm:grid-cols-2
             xl:grid-cols-4"
    >

      <!-- Total -->
      <div
        class="rounded-2xl
               border border-pink-200
               bg-pink-500
               p-5
               shadow-lg shadow-pink-100"
      >
        <p class="text-sm text-white/80">
          กิจกรรมทั้งหมด
        </p>

        <p
          class="mt-2 text-3xl
                 font-bold text-white"
        >
          {{ totalActivities }}
        </p>
      </div>

      <!-- Completed -->
      <div
        class="rounded-2xl
               border border-pink-200
               bg-pink-500
               p-5
               shadow-lg shadow-pink-100"
      >
        <p class="text-sm text-white/80">
          เสร็จแล้ว
        </p>

        <p
          class="mt-2 text-3xl
                 font-bold text-white"
        >
          {{ completedCount }}
        </p>
      </div>

      <!-- In progress -->
      <div
        class="rounded-2xl
               border border-pink-200
               bg-pink-500
               p-5
               shadow-lg shadow-pink-100"
      >
        <p class="text-sm text-white/80">
          กำลังทำ
        </p>

        <p
          class="mt-2 text-3xl
                 font-bold text-white"
        >
          {{ inProgressCount }}
        </p>
      </div>

      <!-- Hours -->
      <div
        class="rounded-2xl
               border border-pink-200
               bg-pink-500
               p-5
               shadow-lg shadow-pink-100"
      >
        <p class="text-sm text-white/80">
          เวลาที่ใช้
        </p>

        <p
          class="mt-2 text-3xl
                 font-bold text-white"
        >
          {{ totalHours }}

          <span
            class="text-base
                   font-normal text-white/80"
          >
            ชั่วโมง
          </span>
        </p>
      </div>

    </div>

    <!-- =====================================================
         Chart Card
    ====================================================== -->

    <div
      class="mt-6 rounded-3xl
             border border-pink-100
             bg-white p-5
             shadow-sm
             sm:p-6"
    >

      <!-- Chart Header -->
      <div
        class="flex items-center
               justify-between"
      >
        <div>
          <h2
            class="font-semibold
                   text-pink-950"
          >
            {{ chartTitle }}
          </h2>

          <p
            class="mt-1 text-sm
                   text-pink-400"
          >
            {{ chartTotal }} กิจกรรม
          </p>
        </div>
      </div>

      <!-- ===================================================
           Graph
      ==================================================== -->

      <div
        class="mt-8 overflow-x-auto"
      >
        <div
          class="min-w-[700px]"
        >

          <!-- Graph + Tooltip -->
          <div class="relative">

            <svg
              viewBox="0 0 1000 320"
              class="h-[320px] w-full
                     overflow-visible"
              preserveAspectRatio="none"
            >

              <!-- ==========================================
                   Y Axis labels
              =========================================== -->

              <g>
                <text
                  v-for="item in yAxisLabels"
                  :key="`y-${item.value}`"
                  x="8"
                  :y="item.y + 4"
                  class="fill-pink-400"
                  font-size="14"
                  font-weight="500"
                  text-anchor="start"
                >
                  {{ item.value }}
                </text>
              </g>

              <!-- ==========================================
                   Grid
              =========================================== -->

              <g>
                <line
                  v-for="item in yAxisLabels"
                  :key="`grid-${item.value}`"
                  x1="55"
                  :y1="item.y"
                  x2="960"
                  :y2="item.y"
                  stroke="currentColor"
                  class="text-pink-100"
                  stroke-width="1"
                />
              </g>

              <!-- ==========================================
                   Area
              =========================================== -->

              <path
                :d="areaPath"
                class="fill-pink-400/10"
              />

              <!-- ==========================================
                   Line
              =========================================== -->

              <path
                :d="linePath"
                fill="none"
                stroke="currentColor"
                class="text-pink-500"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <!-- ==========================================
                   Points
              =========================================== -->

              <g
                v-for="(
                  point,
                  index
                ) in chartPoints"
                :key="`${point.label}-${point.x}`"
              >

                <!--
                  Invisible hit area
                  ทำให้เอาเมาส์ชี้ง่ายขึ้น
                -->
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="18"
                  fill="transparent"
                  class="cursor-pointer"
                  @mouseenter="
                    handlePointEnter(index)
                  "
                  @mouseleave="
                    handlePointLeave
                  "
                />

                <!-- Actual point -->
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="5"
                  class="fill-white
                         stroke-pink-500"
                  stroke-width="3"
                  pointer-events="none"
                />

                <!-- Value -->
                <text
                  :x="point.x"
                  :y="point.y - 14"
                  text-anchor="middle"
                  class="fill-pink-600"
                  font-size="13"
                  font-weight="600"
                >
                  {{ point.value }}
                </text>

              </g>

            </svg>

            <!-- ==========================================
                 Tooltip
            =========================================== -->

            <div
              v-if="hoveredPoint !== null"
              class="pointer-events-none
                     absolute z-20"
              :style="{
                left: `${
                  chartPoints[
                    hoveredPoint
                  ].x / 10
                }%`,

                top: `${
                  (chartPoints[
                    hoveredPoint
                  ].y / 320) * 100
                }%`,

                transform:
                  'translate(-50%, -115%)',
              }"
            >

              <div
                class="min-w-[160px]
                       rounded-xl
                       border
                       border-pink-200
                       bg-white
                       px-4 py-3
                       text-center
                       shadow-xl
                       shadow-pink-200/40"
              >

                <!-- Date / Day -->
                <p
                  class="text-xs
                         font-medium
                         text-pink-400"
                >
                  {{
                    chartPoints[
                      hoveredPoint
                    ].label
                  }}
                </p>

                <!-- Total -->
                <p
                  class="mt-1 text-lg
                         font-bold
                         text-pink-700"
                >
                  {{
                    chartPoints[
                      hoveredPoint
                    ].value
                  }}

                  <span
                    class="text-xs
                           font-normal
                           text-pink-400"
                  >
                    กิจกรรม
                  </span>
                </p>

                <!-- Completed -->
                <p
                  class="mt-1 text-xs
                         text-pink-400"
                >
                  เสร็จแล้ว
                  {{
                    chartPoints[
                      hoveredPoint
                    ].completed
                  }}
                  รายการ
                </p>

              </div>
            </div>

          </div>

          <!-- ==========================================
               X Axis labels
          =========================================== -->

          <div
            class="mt-2 flex
                   justify-between
                   px-[5.5%]"
          >
            <span
              v-for="point in chartPoints"
              :key="`label-${point.label}-${point.x}`"
              class="text-xs
                     text-pink-400"
            >
              {{ point.label }}
            </span>
          </div>

        </div>
      </div>

    </div>

  </section>
</template>