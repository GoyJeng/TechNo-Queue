<template>
  <div
    class="
      overflow-hidden
      rounded-3xl
      border
      border-pink-100
      bg-white
      shadow-sm
      shadow-pink-100/50
    "
  >

    <!-- =========================
         Calendar Header
    ========================== -->

    <div
      class="
        flex
        items-center
        justify-between
        border-b
        border-pink-100
        bg-white
        px-4
        py-4
        sm:px-6
      "
    >
      <button
        type="button"
        class="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          text-lg
          font-medium
          text-pink-500
          transition
          hover:bg-pink-50
          hover:text-pink-600
          active:scale-95
        "
        @click="emit('previous-month')"
      >
        ‹
      </button>

      <div class="text-center">
        <h2
          class="
            text-base
            font-bold
            text-pink-950
            sm:text-lg
          "
        >
          {{ monthName }}
        </h2>

        <p
          class="
            mt-0.5
            text-xs
            text-pink-400
          "
        >
          {{ year + 543 }}
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
          text-lg
          font-medium
          text-pink-500
          transition
          hover:bg-pink-50
          hover:text-pink-600
          active:scale-95
        "
        @click="emit('next-month')"
      >
        ›
      </button>
    </div>

    <!-- =========================
         Today Button
    ========================== -->

    <div
      class="
        flex
        justify-end
        border-b
        border-pink-100
        px-4
        py-3
        sm:px-6
      "
    >
      <button
        type="button"
        class="
          rounded-xl
          bg-pink-50
          px-3
          py-1.5
          text-xs
          font-semibold
          text-pink-600
          transition
          hover:bg-pink-100
          active:scale-95
        "
        @click="emit('today')"
      >
        วันนี้
      </button>
    </div>

    <!-- =========================
         Weekdays
    ========================== -->

    <div
      class="
        grid
        grid-cols-7
        border-b
        border-pink-100
        bg-pink-50/40
      "
    >
      <div
        v-for="day in weekDays"
        :key="day"
        class="
          p-2
          text-center
          text-[11px]
          font-semibold
          text-pink-400
          sm:p-4
          sm:text-xs
        "
      >
        {{ day }}
      </div>
    </div>

    <!-- =========================
         Days
    ========================== -->

    <div
      class="
        grid
        grid-cols-7
        bg-white
      "
    >

      <button
        v-for="day in days"
        :key="day.key"
        type="button"
        class="
          relative
          min-h-20
          border-b
          border-r
          border-pink-100
          bg-white
          p-2
          text-left
          transition
          hover:bg-pink-50/60
          active:bg-pink-100
          sm:min-h-28
          sm:p-3
        "
        :class="{
          'bg-pink-50/40':
            !day.currentMonth,

          'bg-pink-50':
            day.isToday,

          'ring-2 ring-inset ring-pink-400':
            day.selected,
        }"
        @click="emit('select-date', day.date)"
      >

        <!-- =========================
             Date Number
        ========================== -->

        <span
          class="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            text-xs
            font-semibold
            sm:text-sm
          "
          :class="{
            'bg-pink-500 text-white shadow-sm shadow-pink-200':
              day.isToday,

            'text-pink-200':
              !day.currentMonth,

            'text-black':
              day.currentMonth &&
              !day.isToday,
          }"
        >
          {{ day.day }}
        </span>

        <!-- =========================
             Activities
        ========================== -->

        <div
          class="
            mt-2
            space-y-1
          "
        >

          <div
            v-for="activity in day.activities.slice(0, 3)"
            :key="activity.id"
            class="
              truncate
              rounded-lg
              border
              border-pink-100
              bg-pink-50
              px-1.5
              py-1
              text-[10px]
              font-medium
              text-pink-700
              sm:text-xs
            "
          >
            <span class="text-pink-400">
              {{ activity.startTime }}
            </span>

            {{ activity.title }}
          </div>

          <div
            v-if="day.activities.length > 3"
            class="
              px-1
              text-[10px]
              font-medium
              text-pink-400
            "
          >
            +{{ day.activities.length - 3 }}
            รายการ
          </div>

        </div>

      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue'

import type {
  Activity,
} from '../types/activity'

const props = defineProps<{
  year: number
  month: number
  activities: Activity[]
  selectedDate?: string
}>()

const emit = defineEmits<{
  'select-date': [date: string]
  'previous-month': []
  'next-month': []
  today: []
}>()

/* =========================
   Weekdays
========================= */

const weekDays = [
  'จ',
  'อ',
  'พ',
  'พฤ',
  'ศ',
  'ส',
  'อา',
]

/* =========================
   Month Name
========================= */

const monthName = computed(() => {
  const date = new Date(
    props.year,
    props.month,
    1
  )

  return new Intl.DateTimeFormat(
    'th-TH',
    {
      month: 'long',
    }
  ).format(date)
})

/* =========================
   Calendar Days
========================= */

const days = computed(() => {
  const result: Array<{
    key: string
    date: string
    day: number
    currentMonth: boolean
    isToday: boolean
    selected: boolean
    activities: Activity[]
  }> = []

  const firstDay =
    new Date(
      props.year,
      props.month,
      1
    )

  const lastDay =
    new Date(
      props.year,
      props.month + 1,
      0
    )

  let startDay =
    firstDay.getDay()

  /*
   * JavaScript:
   * Sunday = 0
   *
   * Calendar:
   * Monday = 0
   */

  startDay =
    startDay === 0
      ? 6
      : startDay - 1

  const daysInMonth =
    lastDay.getDate()

  const previousMonthLastDay =
    new Date(
      props.year,
      props.month,
      0
    ).getDate()

  /* =========================
     Previous Month
  ========================== */

  for (
    let i = startDay - 1;
    i >= 0;
    i--
  ) {
    const day =
      previousMonthLastDay - i

    const date =
      new Date(
        props.year,
        props.month - 1,
        day
      )

    result.push(
      createDay(
        date,
        false
      )
    )
  }

  /* =========================
     Current Month
  ========================== */

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const date =
      new Date(
        props.year,
        props.month,
        day
      )

    result.push(
      createDay(
        date,
        true
      )
    )
  }

  /* =========================
     Next Month
  ========================== */

  let nextDay = 1

  while (
    result.length % 7 !== 0
  ) {
    const date =
      new Date(
        props.year,
        props.month + 1,
        nextDay++
      )

    result.push(
      createDay(
        date,
        false
      )
    )
  }

  return result
})

/* =========================
   Create Day
========================= */

function createDay(
  date: Date,
  currentMonth: boolean
) {
  const dateString =
    formatDate(date)

  const activities =
    props.activities.filter(
      activity =>
        activity.date === dateString
    )

  return {
    key: dateString,
    date: dateString,
    day: date.getDate(),

    currentMonth,

    isToday:
      dateString ===
      formatDate(new Date()),

    selected:
      dateString ===
      props.selectedDate,

    activities,
  }
}

/* =========================
   Format Date
========================= */

function formatDate(
  date: Date
) {
  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}
</script>