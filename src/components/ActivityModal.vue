<template>
  <Teleport to="body">

    <div
      class="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        p-4
      "
      @click.self="close"
    >

      <div
        class="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-3xl
          border
          border-pink-100
          bg-white
          p-6
          shadow-2xl
        "
      >

        <!-- Header -->
        <div
          class="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <div>
            <h2 class="text-xl font-semibold text-pink-900">
              {{ isEdit ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม' }}
            </h2>

            <p
              class="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              บันทึกสิ่งที่ทำในวันนี้
            </p>
          </div>

          <button
            @click="close"
            class="
              rounded-xl
              p-2
              border-pink-100
              hover:border-pink-500
              hover:text-white
            "
          >
            ✕
          </button>

        </div>

        <!-- Form -->
        <form
          class="space-y-5"
          @submit.prevent="submit"
        >

          <!-- Title -->
          <div>
            <label class="label">
              ชื่อกิจกรรม
            </label>

            <input
              v-model="form.title"
              type="text"
              placeholder=""
              class="input"
              required
            />
          </div>

          <!-- Date -->
          <div>
            <label class="label">
              วันที่
            </label>

            <input
              v-model="form.date"
              type="date"
              class="input"
              required
            />
          </div>

          <!-- Time -->
          <div
            class="
              grid
              grid-cols-2
              gap-3
            "
          >

            <div>
              <label class="label">
                เวลาเริ่ม
              </label>

<input
  type="text"
  :value="form.startTime"
  placeholder="1330"
  inputmode="numeric"
  maxlength="5"
  class="w-full rounded-xl border border-zinc-700
          px-4 py-3
         text-sm text-zinc-200
         outline-none
         bg-gray-800
         transition
         focus:border-pink-500
         focus:ring-2
         focus:ring-pink-500/20"
  @input="formatTimeInput('startTime', $event)"
/>
            </div>

            <div>
              <label class="label">
                เวลาสิ้นสุด
              </label>

<input
  type="text"
  :value="form.endTime"
  placeholder="1430"
  inputmode="numeric"
  maxlength="5"
  class="w-full rounded-xl border border-zinc-700
         bg-white px-4 py-3
         text-sm text-zinc-200
         outline-none
         transition
         focus:border-pink-500
         focus:ring-2
         focus:ring-pink-500/20"
  @input="formatTimeInput('endTime', $event)"
/>
            </div>

          </div>
          <!-- Location -->
          <div>
            <label class="label">
              สถานที่
            </label>

            <input
              v-model="form.location"
              type="text"
              placeholder="เช่น ห้องประชุมชั้น 10"
              class="input"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="label">
              รายละเอียด
            </label>

            <textarea
              v-model="form.description"
              rows="4"
              placeholder="รายละเอียดเพิ่มเติม..."
              class="input resize-none"
            />
          </div>

          <!-- Error -->
          <p
            v-if="error"
            class="
              rounded-xl
              bg-red-500/10
              p-3
              text-sm
              text-red-400
            "
          >
            {{ error }}
          </p>

          <!-- Buttons -->
          <div
            class="
              flex
              gap-3
              pt-2
            "
          >

            <button
              type="button"
              @click="close"
              class="
                flex-1
                rounded-xl
                border-pink-100
                px-4
                py-3
                text-sm
                font-medium
                hover:bg-zinc-700
              "
            >
              ยกเลิก
            </button>

<button
  type="submit"
  class="flex-1 rounded-xl
         bg-pink-500
         px-4 py-3
         text-sm font-medium
         text-white
         shadow-lg
         shadow-pink-200
         transition
         hover:bg-pink-600"
>
  {{ isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มกิจกรรม' }}
</button>

          </div>

        </form>

      </div>

    </div>

  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
} from 'vue'

import type {
  Activity,
  ActivityCategory,
} from '../types/activity'

function formatTimeInput(
  field: 'startTime' | 'endTime',
  event: Event
) {
  const input = event.target as HTMLInputElement

  let value = input.value.replace(/\D/g, '')

  // รับได้สูงสุด 4 ตัว
  if (value.length > 4) {
    value = value.slice(0, 4)
  }

  // ยังพิมพ์ไม่ครบ 4 ตัว
  if (value.length < 4) {
    form[field] = value
    return
  }

  const hour = Number(value.slice(0, 2))
  const minute = Number(value.slice(2, 4))

  // ชั่วโมงต้อง 00-23
  if (hour > 23) {
    form[field] = ''
    return
  }

  // นาทีต้อง 00-59
  if (minute > 59) {
    form[field] = `${value.slice(0, 2)}:`
    return
  }

  form[field] = `${value.slice(0, 2)}:${value.slice(2, 4)}`
}

const props = defineProps<{
  activity?: Activity | null
  initialDate?: string
}>()

const emit = defineEmits<{
  close: []
  save: [activity: Activity]
}>()

const isEdit = computed(
  () => !!props.activity
)

const error = ref('')

const form = reactive({
  title: props.activity?.title ?? '',
date:
  props.activity?.date ??
  props.initialDate ??
  new Date().toISOString().slice(0, 10),

  startTime:
    props.activity?.startTime ??
    '09:00',

  endTime:
    props.activity?.endTime ??
    '10:00',

  category:
    props.activity?.category ??
    'other' as ActivityCategory,

  location:
    props.activity?.location ?? '',

  description:
    props.activity?.description ?? '',
})


function close() {
  emit('close')
}

function submit() {
  error.value = ''

  if (
    form.endTime <=
    form.startTime
  ) {
    error.value =
      'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม'
    return
  }

  const activity: Activity = {
    id:
      props.activity?.id ??
      crypto.randomUUID(),

    title:
      form.title.trim(),

    date:
      form.date,

    startTime:
      form.startTime,

    endTime:
      form.endTime,

    category:
      form.category,

    location:
      form.location.trim(),

    description:
      form.description.trim(),

    status:
      props.activity?.status ??
      'pending',

    createdAt:
      props.activity?.createdAt ??
      new Date().toISOString(),

    startedAt:
      props.activity?.startedAt,

    completedAt:
      props.activity?.completedAt,

    duration:
      props.activity?.duration,
  }

  emit('save', activity)
}
</script>

<style scoped>
.label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: rgb(161 161 170);
  
}

.input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(248, 223, 237);
  background: rgb(252, 249, 249);
  padding: 0.75rem 1rem;
  color: rgb(0, 0, 0);
  outline: none;
}

.input:focus {
  border-color: rgb(139 92 246);
}
</style>