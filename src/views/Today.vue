<script setup lang="ts">
import { computed, ref } from 'vue'

import { useActivityStore } from '../stores/activityStore'

import ActivityCard from '../components/ActivityCard.vue'
import ActivityDetail from '../components/ActivityDetail.vue'
import ActivityModal from '../components/ActivityModal.vue'

import type {
  Activity,
  ActivityStatus,
} from '../types/activity'

const activityStore = useActivityStore()

/* ========================================
   STATE
======================================== */

const selectedActivity =
  ref<Activity | null>(null)

const editingActivity =
  ref<Activity | null>(null)

const showDetail = ref(false)
const showModal = ref(false)

/* ========================================
   TODAY
======================================== */

const today = new Date()

const todayString = [
  today.getFullYear(),
  String(
    today.getMonth() + 1
  ).padStart(2, '0'),
  String(
    today.getDate()
  ).padStart(2, '0'),
].join('-')

/* ========================================
   ACTIVITIES
======================================== */

const todayActivities = computed(() =>
  activityStore.getActivitiesByDate(
    todayString
  )
)

/* ========================================
   FORMATTED DATE
======================================== */

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(
    'th-TH',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(today)
})

/* ========================================
   DETAIL
======================================== */

function openDetail(
  activity: Activity
) {
  selectedActivity.value =
    activity

  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  selectedActivity.value = null
}

/* ========================================
   EDIT
======================================== */

function editActivity(
  activity: Activity
) {
  editingActivity.value = {
    ...activity,
  }

  showDetail.value = false
  showModal.value = true
}

/* ========================================
   DELETE
======================================== */

function deleteActivity(
  id: string
) {
  activityStore.deleteActivity(id)

  closeDetail()
}

/* ========================================
   CREATE
======================================== */

function openCreateModal() {
  editingActivity.value = null
  showModal.value = true
}

/* ========================================
   CLOSE MODAL
======================================== */

function closeModal() {
  showModal.value = false
  editingActivity.value = null
}

/* ========================================
   SAVE
======================================== */

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

/* ========================================
   UPDATE STATUS
======================================== */

function updateStatus(
  id: string,
  status: ActivityStatus
) {
  activityStore.updateStatus(
    id,
    status
  )

  /*
   * ดึงข้อมูลล่าสุดจาก store
   * เพื่อให้ ActivityDetail
   * แสดงสถานะใหม่ทันที
   */
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
</script>

<template>
  <section
    class="mx-auto max-w-5xl
           px-4 py-6
           sm:px-6
           lg:px-8"
  >

    <!-- ==================================
         HEADER
    =================================== -->

    <div class="mb-8">

      <p
        class="text-sm
               font-medium
               text-pink-400"
      >
        วันนี้
      </p>

      <h1
        class="mt-1
               text-3xl
               font-bold
               text-pink-950"
      >
        {{ formattedDate }}
      </h1>

      <p
        class="mt-2
               text-sm
               text-pink-400"
      >
        {{ todayActivities.length }}
        กิจกรรม
      </p>

    </div>

    <!-- ==================================
         ADD BUTTON
    =================================== -->

    <div
      class="mb-6
             flex
             justify-end"
    >
      <button
        type="button"
        class="rounded-xl
               bg-pink-500
               px-5
               py-2.5
               text-sm
               font-semibold
               text-white
               shadow-lg
               shadow-pink-200
               transition
               hover:bg-pink-600
               hover:shadow-pink-300
               active:scale-95"
        @click="openCreateModal"
      >
        + เพิ่มกิจกรรม
      </button>
    </div>

    <!-- ==================================
         ACTIVITIES
    =================================== -->

    <div
      v-if="todayActivities.length"
      class="space-y-3"
    >

      <ActivityCard
        v-for="
          activity in todayActivities
        "
        :key="activity.id"
        :activity="activity"
        @click="openDetail"
      />

    </div>

    <!-- ==================================
         EMPTY STATE
    =================================== -->

    <div
      v-else
      class="rounded-3xl
             border
             border-dashed
             border-pink-200
             bg-white
             p-12
             text-center
             shadow-sm"
    >

      <div
        class="mx-auto
               flex
               h-16
               w-16
               items-center
               justify-center
               rounded-2xl
               bg-pink-50
               text-4xl"
      >
        📋
      </div>

      <h2
        class="mt-4
               font-semibold
               text-pink-900"
      >
        วันนี้ยังไม่มีรายการ
      </h2>

      <p
        class="mt-2
               text-sm
               text-pink-400"
      >
        ยังมีเวลาว่างให้ระบบบันทึกว่า
        กำลังนั่งมองหน้าจออยู่
      </p>

      <button
        type="button"
        class="mt-5
               rounded-xl
               bg-pink-50
               px-4
               py-2
               text-sm
               font-medium
               text-pink-600
               transition
               hover:bg-pink-100"
        @click="openCreateModal"
      >
        + เพิ่มกิจกรรมแรก
      </button>

    </div>

  </section>

  <!-- ====================================
       ACTIVITY DETAIL
  ===================================== -->

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

  <!-- ====================================
       ADD / EDIT MODAL
  ===================================== -->

  <ActivityModal
    v-if="showModal"
    :activity="editingActivity"
    :initial-date="todayString"
    @close="closeModal"
    @save="saveActivity"
  />

</template>