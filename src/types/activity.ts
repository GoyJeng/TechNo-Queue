export type ActivityStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type ActivityCategory =
  | 'av'
  | 'programming'
  | 'meeting'
  | 'document'
  | 'other'

export interface Activity {
  id: string

  title: string

  date: string

  startTime: string

  endTime: string

  category: ActivityCategory

  location?: string

  description?: string

  status: ActivityStatus

  createdAt: string

  startedAt?: string

  completedAt?: string

  duration?: number

  initialDate?: string
}