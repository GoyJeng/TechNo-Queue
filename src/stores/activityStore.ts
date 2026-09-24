import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { supabase } from '../lib/supabase'

import type {
  Activity,
  ActivityStatus,
} from '../types/activity'

function mapActivity(row: any): Activity {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    category: row.category,
    location: row.location,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    duration: row.duration,
  }
}

export const useActivityStore = defineStore(
  'activity',
  () => {
    const activities = ref<Activity[]>([])

    async function load() {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', {
          ascending: true,
        })
        .order('start_time', {
          ascending: true,
        })

      if (error) {
        console.error(
          'Failed to load activities:',
          error
        )
        return
      }

      activities.value = data.map(mapActivity)
    }

async function addActivity(
  activity: Activity
) {
  console.log('Adding activity:', activity)

  const { data, error } = await supabase
    .from('activities')
    .insert({
      title: activity.title,
      date: activity.date,
      start_time: activity.startTime,
      end_time: activity.endTime,
      category: activity.category,
      location: activity.location,
      description: activity.description,
      status: activity.status,
      created_at: activity.createdAt,
      started_at: activity.startedAt,
      completed_at: activity.completedAt,
      duration: activity.duration,
    })
    .select()
    .single()

  console.log(
    'Supabase insert data:',
    data
  )

  console.log(
    'Supabase insert error:',
    error
  )

  if (error) {
    console.error(
      'Failed to add activity:',
      error
    )

    throw error
  }

  activities.value.push(
    mapActivity(data)
  )

  sortActivities()
}

    async function updateActivity(
      activity: Activity
    ) {
      const { data, error } = await supabase
        .from('activities')
        .update({
          title: activity.title,
          date: activity.date,
          start_time: activity.startTime,
          end_time: activity.endTime,
          category: activity.category,
          location: activity.location,
          description: activity.description,
          status: activity.status,
          started_at: activity.startedAt,
          completed_at: activity.completedAt,
          duration: activity.duration,
        })
        .eq('id', activity.id)
        .select()
        .single()

      if (error) {
        console.error(
          'Failed to update activity:',
          error
        )

        throw error
      }

      const index =
        activities.value.findIndex(
          item => item.id === activity.id
        )

      if (index !== -1) {
        activities.value[index] =
          mapActivity(data)
      }

      sortActivities()
    }

    async function deleteActivity(
      id: string
    ) {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)

      if (error) {
        console.error(
          'Failed to delete activity:',
          error
        )

        throw error
      }

      activities.value =
        activities.value.filter(
          activity => activity.id !== id
        )
    }

    async function updateStatus(
      id: string,
      status: ActivityStatus
    ) {
      const activity =
        activities.value.find(
          item => item.id === id
        )

      if (!activity) return

      const now =
        new Date().toISOString()

      let startedAt =
        activity.startedAt

      let completedAt =
        activity.completedAt

      let duration =
        activity.duration

      if (
        status === 'in-progress'
      ) {
        if (!startedAt) {
          startedAt = now
        }

        completedAt = undefined
        duration = undefined
      }

      if (
        status === 'completed'
      ) {
        if (!startedAt) {
          startedAt = now
        }

        completedAt = now

        duration =
          calculateDuration(
            startedAt,
            completedAt
          )
      }

      if (
        status === 'cancelled'
      ) {
        completedAt = undefined
        duration = undefined
      }

      if (
        status === 'pending'
      ) {
        startedAt = undefined
        completedAt = undefined
        duration = undefined
      }

      const { data, error } =
        await supabase
          .from('activities')
          .update({
            status,
            started_at: startedAt,
            completed_at: completedAt,
            duration,
          })
          .eq('id', id)
          .select()
          .single()

      if (error) {
        console.error(
          'Failed to update status:',
          error
        )

        throw error
      }

      const index =
        activities.value.findIndex(
          item => item.id === id
        )

      if (index !== -1) {
        activities.value[index] =
          mapActivity(data)
      }
    }

    async function startActivity(
      id: string
    ) {
      await updateStatus(
        id,
        'in-progress'
      )
    }

    async function completeActivity(
      id: string
    ) {
      await updateStatus(
        id,
        'completed'
      )
    }

    async function cancelActivity(
      id: string
    ) {
      await updateStatus(
        id,
        'cancelled'
      )
    }

    function calculateDuration(
      start: string,
      end: string
    ) {
      const startTime =
        new Date(start).getTime()

      const endTime =
        new Date(end).getTime()

      return Math.max(
        0,
        Math.floor(
          (endTime - startTime) /
            1000
        )
      )
    }

    function sortActivities() {
      activities.value.sort(
        (a, b) => {
          const dateCompare =
            a.date.localeCompare(
              b.date
            )

          if (dateCompare !== 0) {
            return dateCompare
          }

          return a.startTime.localeCompare(
            b.startTime
          )
        }
      )
    }

    function getActivitiesByDate(
      date: string
    ) {
      return activities.value
        .filter(
          activity =>
            activity.date === date
        )
        .sort(
          (a, b) =>
            a.startTime.localeCompare(
              b.startTime
            )
        )
    }

    const completedCount =
      computed(() =>
        activities.value.filter(
          activity =>
            activity.status ===
            'completed'
        ).length
      )

    const pendingCount =
      computed(() =>
        activities.value.filter(
          activity =>
            activity.status ===
            'pending'
        ).length
      )

    const inProgressCount =
      computed(() =>
        activities.value.filter(
          activity =>
            activity.status ===
            'in-progress'
        ).length
      )

    const totalDuration =
      computed(() =>
        activities.value.reduce(
          (total, activity) =>
            total +
            (activity.duration ?? 0),
          0
        )
      )

    return {
      activities,

      completedCount,
      pendingCount,
      inProgressCount,
      totalDuration,

      load,
      addActivity,
      updateActivity,
      deleteActivity,

      updateStatus,
      startActivity,
      completeActivity,
      cancelActivity,

      getActivitiesByDate,
    }
  }
)