"use client"

import type { User, Schedule } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface GroupWorkRecommendationsProps {
  userSchedule: Schedule[]
  friendSchedules: { userId: string; user: User; events: Schedule[] }[]
  selectedFriends: User[]
  onTimeSlotClick?: (day: string, startTime: string, endTime: string) => void
}

export default function GroupWorkRecommendations({
  userSchedule,
  friendSchedules,
  selectedFriends,
  onTimeSlotClick,
}: GroupWorkRecommendationsProps) {
  // Generate time slots in the format XX:20 to (XX+2):00
  const generateTimeSlots = () => {
    const slots = []
    // Start from 7:20 and end at 19:20 (which ends at 21:00)
    for (let hour = 7; hour <= 19; hour++) {
      slots.push({
        start: `${hour.toString().padStart(2, "0")}:20`,
        end: `${(hour + 2).toString().padStart(2, "0")}:00`,
      })
    }
    return slots
  }

  // Check if a time slot is available for all selected users
  const isTimeSlotAvailable = (day: string, startTime: string, endTime: string) => {
    // Convert times to hours for easier comparison
    const startHour = Number.parseInt(startTime.split(":")[0])
    const startMinute = Number.parseInt(startTime.split(":")[1])
    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1])

    // Start time in minutes since midnight
    const startTimeInMinutes = startHour * 60 + startMinute
    // End time in minutes since midnight
    const endTimeInMinutes = endHour * 60 + endMinute

    // Check user's schedule
    for (const event of userSchedule) {
      if (event.day !== day) continue

      const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
      const eventStartMinute = Number.parseInt(event.startTime.split(":")[1] || "0")
      const eventEndHour = Number.parseInt(event.endTime.split(":")[0])
      const eventEndMinute = Number.parseInt(event.endTime.split(":")[1] || "0")

      const eventStartInMinutes = eventStartHour * 60 + eventStartMinute
      const eventEndInMinutes = eventEndHour === 0 ? 24 * 60 : eventEndHour * 60 + eventEndMinute

      // Check if there's an overlap
      if (
        (startTimeInMinutes < eventEndInMinutes && endTimeInMinutes > eventStartInMinutes) ||
        (eventStartInMinutes < endTimeInMinutes && eventEndInMinutes > startTimeInMinutes)
      ) {
        return false
      }
    }

    // Check each friend's schedule
    for (const { events } of friendSchedules) {
      for (const event of events) {
        if (event.day !== day) continue

        const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
        const eventStartMinute = Number.parseInt(event.startTime.split(":")[1] || "0")
        const eventEndHour = Number.parseInt(event.endTime.split(":")[0])
        const eventEndMinute = Number.parseInt(event.endTime.split(":")[1] || "0")

        const eventStartInMinutes = eventStartHour * 60 + eventStartMinute
        const eventEndInMinutes = eventEndHour === 0 ? 24 * 60 : eventEndHour * 60 + eventEndMinute

        // Check if there's an overlap
        if (
          (startTimeInMinutes < eventEndInMinutes && endTimeInMinutes > eventStartInMinutes) ||
          (eventStartInMinutes < endTimeInMinutes && eventEndInMinutes > startTimeInMinutes)
        ) {
          return false
        }
      }
    }

    return true
  }

  // Find available time slots for group work
  const findAvailableTimeSlots = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const timeSlots = generateTimeSlots()
    const availableSlots: Record<string, { start: string; end: string }[]> = {}

    days.forEach((day) => {
      availableSlots[day] = []

      timeSlots.forEach((slot) => {
        if (isTimeSlotAvailable(day, slot.start, slot.end)) {
          availableSlots[day].push(slot)
        }
      })
    })

    return availableSlots
  }

  const availableTimeSlots = findAvailableTimeSlots()
  const friendNames = selectedFriends.map((f) => f.name).join(", ")

  // Handle time slot click
  const handleTimeSlotClick = (day: string, slot: { start: string; end: string }) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(day, slot.start, slot.end)
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-pink-400">Group Work Recommendations with {friendNames}</h3>

      <div className="grid grid-cols-7 gap-2">
        {Object.entries(availableTimeSlots).map(([day, slots]) => (
          <div key={day} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">{day}</h4>
            {slots.length > 0 ? (
              <div className="space-y-1">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="text-xs p-1 bg-pink-900/30 text-pink-300 rounded hover:bg-pink-800/40 transition-colors cursor-pointer"
                    onClick={() => handleTimeSlotClick(day, slot)}
                    title={`Create event on ${day} from ${slot.start} to ${slot.end}`}
                  >
                    {slot.start} - {slot.end}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No available slots</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex items-center">
          <Badge className="bg-pink-900/30 text-pink-300 mr-2">Tip</Badge>
          <span className="text-xs text-gray-400">
            Click on a time slot to create an event. Recommendations show 2-hour blocks starting at XX:20 between 7:20
            and 21:00
          </span>
        </div>
      </div>
    </div>
  )
}
