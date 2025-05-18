import type { User, Schedule } from "@/lib/types"

interface ScheduleLegendProps {
  schedules: { userId: string; user: User; events: Schedule[] }[]
}

export default function ScheduleLegend({ schedules }: ScheduleLegendProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-pink-400">Schedule Legend</h3>
      <div className="space-y-2">
        {schedules.map(({ userId, user, events }) => {
          if (events.length === 0) return null

          // Get a sample event to get the color
          const sampleEvent = events[0]

          return (
            <div key={userId} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: sampleEvent.color }}></div>
              <span className="text-sm text-gray-200">
                {userId === "user-1" ? "Your Schedule" : `${user.name}'s Schedule`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
