import type { User, Schedule } from "@/lib/types";

interface CommonFreeTimeProps {
  userSchedule: Schedule[];
  friendSchedules: Schedule[];
  selectedFriends: User[];
}

export default function CommonFreeTime({
  userSchedule,
  friendSchedules,
  selectedFriends,
}: CommonFreeTimeProps) {
  // Function to find common free time
  const findCommonFreeTime = () => {
    // const days = [
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    //   "Sunday",
    // ];
    // const commonFreeTime: Record<string, string[]> = {};

    // // Initialize with all time slots free for each day
    // days.forEach((day) => {
    //   if (day === "Saturday" || day === "Sunday") {
    //     commonFreeTime[day] = ["All Day"];
    //   } else {
    //     commonFreeTime[day] = [
    //       "08:00 - 10:00",
    //       "10:00 - 12:00",
    //       "12:00 - 14:00",
    //       "14:00 - 16:00",
    //       "16:00 - 18:00",
    //       "18:00 - 20:00",
    //     ];
    //   }
    // });

    // // Remove busy slots from user schedule
    // userSchedule.forEach((event) => {
    //   const startHour = Number.parseInt(event.startTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" }).split(":")[0]);
    //   const endHour = Number.parseInt(event.endTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" }).split(":")[0]);
    //   const day = event.startTime.toLocaleString("en-US", { weekday: "long" });
    //   // Remove time slots that overlap with this event
    //   commonFreeTime[day] = commonFreeTime[day].filter((slot) => {
    //     const [slotStart, slotEnd] = slot.split(" - ");
    //     const slotStartHour = Number.parseInt(slotStart.split(":")[0]);
    //     const slotEndHour = Number.parseInt(slotEnd.split(":")[0]);

    //     // Keep slot if it doesn't overlap with event
    //     return slotEndHour <= startHour || slotStartHour >= endHour;
    //   });
    // });

    // // Remove busy slots from friend schedules
    // friendSchedules.forEach((event) => {
    //     const startHour = Number.parseInt(event.startTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" }).split(":")[0]);
    //     const endHour = Number.parseInt(event.endTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" }).split(":")[0]);
    //     const day = event.startTime.toLocaleString("en-US", { weekday: "long" });

    //     // Remove time slots that overlap with this event
    //     commonFreeTime[day] = commonFreeTime[day].filter((slot) => {
    //       if (slot === "All Day") return false;

    //       const [slotStart, slotEnd] = slot.split(" - ");
    //       const slotStartHour = Number.parseInt(slotStart.split(":")[0]);
    //       const slotEndHour = Number.parseInt(slotEnd.split(":")[0]);

    //       // Keep slot if it doesn't overlap with event
    //       return slotEndHour <= startHour || slotStartHour >= endHour;
    //     });
    //   });

    return {
      "Monday": ["All Day"],
      "Tuesday": ["All Day"],
      "Wednesday": ["All Day"],
      "Thursday": ["All Day"],
      "Friday": ["All Day"],
      "Saturday": ["All Day"],
      "Sunday": ["All Day"],
    };
  };

  const commonFreeTime = findCommonFreeTime();
  const friendNames = selectedFriends.map((f) => f.name).join(", ");

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-pink-400">
        Common Free Time with {friendNames}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {Object.entries(commonFreeTime).map(([day, slots]) => (
          <div key={day} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">{day}</h4>
            {slots.length > 0 ? (
              <div className="space-y-1">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="text-xs p-1 bg-green-900/30 text-green-300 rounded"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No free time</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
