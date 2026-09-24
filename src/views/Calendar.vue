<script setup lang="ts">
import { computed, ref } from 'vue'

import { useActivityStore } from '../stores/activityStore'

import CalendarMonth from '../components/CalendarMonth.vue'
import ActivityCard from '../components/ActivityCard.vue'
import ActivityDetail from '../components/ActivityDetail.vue'
import ActivityModal from '../components/ActivityModal.vue'
import ActivityDayModal from '../components/ActivityDayModal.vue'
import type { Activity,ActivityStatus } from '../types/activity'

const activityStore = useActivityStore()

/* =========================
   Calendar state
========================= */

const today = new Date()

const currentYear = ref(
  today.getFullYear()
)

const currentMonth = ref(
  today.getMonth()
)

const selectedDate = ref(
  [
    currentYear.value,
    String(currentMonth.value + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
)

/* =========================
   Activity state
========================= */

const selectedActivity =
  ref<Activity | null>(null)

const editingActivity =
  ref<Activity | null>(null)

const showDetail = ref(false)
const showModal = ref(false)

const selectedDay =
  ref<string | null>(null)

const showDayModal =
  ref(false)

/* =========================
   Activities for calendar
========================= */

const calendarActivities = computed(() => {
  return activityStore.activities
})

/* =========================
   Selected day activities
========================= */

const selectedActivities = computed(() => {
  return activityStore.getActivitiesByDate(
    selectedDate.value
  )
})

/* =========================
   Calendar events
========================= */

function handleSelectDate(
  date: string
) {
  selectedDate.value = date
  selectedDay.value = date
  showDayModal.value = true
}

function handlePreviousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function handleNextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function handleToday() {
  const now = new Date()

  currentYear.value =
    now.getFullYear()

  currentMonth.value =
    now.getMonth()

  selectedDate.value = [
    now.getFullYear(),
    String(
      now.getMonth() + 1
    ).padStart(2, '0'),
    String(
      now.getDate()
    ).padStart(2, '0'),
  ].join('-')
}

/* =========================
   Activity detail
========================= */

function openActivityDetail(
  activity: Activity
) {
  showDayModal.value = false
  selectedActivity.value = activity
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  selectedActivity.value = null
}

/* =========================
   Update
========================= */
function updateStatus(
  id: string,
  status: ActivityStatus
) {
  activityStore.updateStatus(
    id,
    status
  )

  const updated =
    activityStore.activities.find(
      activity =>
        activity.id === id
    )

  if (updated) {
    selectedActivity.value =
      updated
  }
}

/* =========================
   Edit
========================= */
function editActivity(
  activity: Activity
) {
  editingActivity.value = {
    ...activity,
  }

  showDetail.value = false
  showModal.value = true
}

/* =========================
   Delete
========================= */

function deleteActivity(
  id: string
) {
  activityStore.deleteActivity(id)

  closeDetail()
}

/* =========================
   Modal
========================= */

function openCreateModal() {
  editingActivity.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingActivity.value = null
}

function saveActivity(
  activity: Activity
) {
  if (editingActivity.value) {
    activityStore.updateActivity(
      activity
    )
  } else {
    activityStore.addActivity(
      activity
    )
  }

  closeModal()
}
</script>

<template>
  <section
    class="mx-auto max-w-6xl px-4 py-6
           sm:px-6 lg:px-8"
  >

    <!-- =========================
         Header
    ========================== -->

    <div class="mb-6">
      <h1
        class="text-3xl font-bold text-pink-950"
      >
        Calendar
      </h1>

      <p
        class="mt-2 text-sm text-zinc-500"
      >
        ดูกิจกรรมทั้งหมดตามวัน
      </p>
    </div>

    <!-- =========================
         Calendar
    ========================== -->

    <CalendarMonth
      :year="currentYear"
      :month="currentMonth"
      :activities="calendarActivities"
      @select-date="handleSelectDate"
      @previous-month="handlePreviousMonth"
      @next-month="handleNextMonth"
      @today="handleToday"
    />

    <!-- =========================
         Selected date
    ========================== -->

    <div class="mt-8">

      <div
        class="mb-4 flex items-center
               justify-between gap-4"
      >

        <div>
          <h2
            class="text-lg font-semibold text-white"
          >
            กิจกรรม
          </h2>

          <p
            class="mt-1 text-sm text-zinc-500"
          >
            {{ selectedDate }}
          </p>
        </div>

        <button
          type="button"
  class="rounded-xl
         bg-pink-500
         px-5 py-2.5
         text-sm font-semibold
         text-white
         shadow-lg
         shadow-pink-200
         transition
         hover:bg-pink-600
         hover:shadow-pink-300"
          @click="openCreateModal"
        >
          + เพิ่ม
        </button>

      </div>

      <!-- =========================
           Activity list
      ========================== -->

      <div
        v-if="selectedActivities.length"
        class="space-y-3"
      >

<ActivityCard
  v-for="activity in selectedActivities"
  :key="activity.id"
  :activity="activity"
  @click="openActivityDetail"
/>

      </div>

      <!-- Empty -->

      <div
        v-else
        class="rounded-3xl
               border border-dashed
               border-zinc-800
               p-10 text-center"
      >
        <div class="text-3xl">
          📅
        </div>

        <p
          class="mt-3 text-sm
                 text-zinc-500"
        >
          ไม่มีรายการในวันนี้
        </p>

        <button
          type="button"
          class="mt-4 rounded-xl
                 border border-zinc-800
                 px-4 py-2
                 text-sm text-pink-300
                 hover:bg-pink-500"
          @click="openCreateModal"
        >
          เพิ่มกิจกรรม
        </button>
      </div>

    </div>

  </section>
    <!-- =========================
       Activity DayModal
  ========================== -->
  <ActivityDayModal
  v-if="
    showDayModal &&
    selectedDay
  "
  :date="selectedDay"
  :activities="selectedActivities"
  @close="showDayModal = false"
  @select-activity="openActivityDetail"
/>

  <!-- =========================
       Activity Detail
  ========================== -->

<ActivityDetail
  v-if="
    showDetail &&
    selectedActivity
  "
  :activity="selectedActivity"
  @close="closeDetail"
  @edit="editActivity"
  @delete="deleteActivity"
  @update-status="updateStatus"
/>

  <!-- =========================
       Add / Edit Modal
  ========================== -->

  <ActivityModal
    v-if="showModal"
    :activity="editingActivity"
    :initial-date="selectedDate"
    @close="closeModal"
    @save="saveActivity"
  />

</template>