"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import type { User, Schedule } from "@/lib/types";
import ScheduleLegend from "@/components/ScheduleLegend";
import CommonFreeTime from "@/components/CommonFreeTime";
import GroupWorkRecommendations from "@/components/GroupWorkRecommendation";
import EventCreationForm from "@/components/EventCreationForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleViewProps {
  schedules: Schedule[];
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedFriends: User[];
  currentUser: User;
  following: User[];
}

// Full 24-hour time slots (00:00 to 23:00)
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

// Days of the week
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Height of each time slot in pixels (used for scrolling calculations)
const TIME_SLOT_HEIGHT = 14; // for week view
const DAY_SLOT_HEIGHT = 16; // for day view

export default function ScheduleView({
  schedules,
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
  selectedFriends,
  currentUser,
  following,
}: ScheduleViewProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // Refs for scrolling
  const weekScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  // Add a new state for pre-filled event time
  const [eventFormData, setEventFormData] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);

  // Auto-scroll to current time when viewing today, but only on initial load or view change
  useEffect(() => {
    // Reset the scroll flag when the view or date changes
    setInitialScrollDone(false);
  }, [currentView, currentDate]);

  useEffect(() => {
    if (initialScrollDone) return;

    const scrollToCurrentTime = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Only auto-scroll if viewing today
      const isViewingToday = isSameDay(currentDate, now);

      if (isViewingToday) {
        if (currentView === "week" && weekScrollRef.current) {
          // Scroll to current hour minus 2 hours (to show context above)
          const scrollHour = Math.max(0, currentHour - 2);
          weekScrollRef.current.scrollTop = scrollHour * TIME_SLOT_HEIGHT;
        } else if (currentView === "day" && dayScrollRef.current) {
          // Scroll to current hour minus 2 hours (to show context above)
          const scrollHour = Math.max(0, currentHour - 2);
          dayScrollRef.current.scrollTop = scrollHour * DAY_SLOT_HEIGHT;
        }
      } else {
        // If not viewing today, scroll to 8:00 (common start of business day)
        const businessHour = 8;
        if (currentView === "week" && weekScrollRef.current) {
          weekScrollRef.current.scrollTop = businessHour * TIME_SLOT_HEIGHT;
        } else if (currentView === "day" && dayScrollRef.current) {
          dayScrollRef.current.scrollTop = businessHour * DAY_SLOT_HEIGHT;
        }
      }

      // Mark initial scroll as done
      setInitialScrollDone(true);
    };

    // Small delay to ensure the DOM is ready
    const timer = setTimeout(scrollToCurrentTime, 100);
    return () => clearTimeout(timer);
  }, [currentView, currentDate, initialScrollDone]);

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
    // Reset scroll flag to ensure we scroll to current time
    setInitialScrollDone(false);
  };

  const goToPrevious = () => {
    if (currentView === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (currentView === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (currentView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (currentView === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (currentView === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (currentView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  // Get the date range for the current view
  const getDateRange = () => {
    if (currentView === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (currentView === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
      return `${format(start, "MMMM d")}-${format(end, "d, yyyy")}`;
    } else if (currentView === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    return "";
  };

  // Get events for a specific day and time slot (for week view)
  // const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getEventsForTimeSlot = (day: string, timeSlot: string, schedules: Schedule[]) => {
    // Convert timeSlot (HH:MM) to hours and minutes
    const [slotHours, slotMinutes] = timeSlot.split(':').map(Number);
    const slotTotalMinutes = slotHours * 60 + slotMinutes;
    
    return schedules.filter((event) => {
      // Check if event occurs on the specified day
      const eventDay = DAYS_OF_WEEK[new Date(event.startTime).getDay()];
      if (eventDay !== day) return false;
      
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      // Get start and end times in minutes since midnight
      const startTotalMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      let endTotalMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      
      // Handle overnight events (endTime is next day)
      if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60; // Add 24 hours
      }
      
      // Check if time slot falls within the event duration
      return slotTotalMinutes >= startTotalMinutes && slotTotalMinutes < endTotalMinutes;
    });
  };

  // Get events for a specific day (for month view)
  const getEventsForDay = (date: Date, schedules: Schedule[]) => {
    // Get the year, month, and day for comparison
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
  
    return schedules.flatMap((schedule) => {
      const eventStart = new Date(schedule.startTime);
      const eventEnd = new Date(schedule.endTime);
  
      // Check if the event overlaps with the target day
      const startsOnDay = 
        eventStart.getFullYear() === targetYear &&
        eventStart.getMonth() === targetMonth &&
        eventStart.getDate() === targetDay;
  
      const endsOnDay = 
        eventEnd.getFullYear() === targetYear &&
        eventEnd.getMonth() === targetMonth &&
        eventEnd.getDate() === targetDay;
  
      // For multi-day events, check if target day is between start and end
      const spansDay =
        eventStart < date && eventEnd > new Date(date.getTime() + 24 * 60 * 60 * 1000);
  
      if (startsOnDay || endsOnDay || spansDay) {
        return {
          ...schedule,
        };
      }
      return [];
    });
  };

  // Get events for the selected day (for day view)
  const getEventsForSelectedDay = (
    currentDate: Date, 
    schedules: Schedule[] // Using your exact Schedule type
  ) => {
    const dayName = FULL_DAYS[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1];
    
    return schedules.filter(schedule => {
      const eventDay = DAYS_OF_WEEK[new Date(schedule.startTime).getDay() === 0 ? 6 : new Date(schedule.startTime).getDay() - 1];
      return eventDay === dayName;
    });
  };

  // Helper to convert day index to day name
  // const getDayNameFromIndex = (dayIndex: number): string => {
  //   return FULL_DAYS[dayIndex];
  // };

  // Get the date for a specific day column (for week view)
  const getDateForDay = (dayIndex: number) => {
    const date = addDays(
      startOfWeek(currentDate, { weekStartsOn: 1 }),
      dayIndex
    );
    return format(date, "MMM d");
  };

  // Check if a day column is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Handle day click in month view
  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    if (currentView === "month") {
      // If clicking on a day in month view, show the day view
      setCurrentView("day");
    }
  };

  // Add a handler for time slot clicks in the GroupWorkRecommendations component
  const handleGroupWorkTimeSlotClick = (
    day: string,
    startTime: string,
    endTime: string
  ) => {
    // Find the next occurrence of the selected day
    const today = new Date();
    const todayDayName = format(today, "EEEE");
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const todayIndex = daysOfWeek.indexOf(todayDayName);
    const targetIndex = daysOfWeek.indexOf(day);

    let daysToAdd = targetIndex - todayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Move to next week if the day has already passed this week
    }

    const eventDate = addDays(today, daysToAdd);

    // Set the form data
    setEventFormData({
      date: eventDate,
      startTime,
      endTime,
    });

    // Open the event form
    setShowEventForm(true);
  };

  // Render the month view calendar
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    // Add day headers
    const dayHeaders = DAYS_OF_WEEK.map((day) => (
      <div
        key={`header-${day}`}
        className="h-10 flex items-center justify-center font-semibold text-pink-300"
      >
        {day}
      </div>
    ));

    // Create calendar grid
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = getEventsForDay(currentDay, schedules);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-1 border border-gray-800 transition-colors hover:bg-pink-950/30 cursor-pointer relative ${
              isToday(day) ? "bg-pink-950/20" : ""
            } ${!isCurrentMonth ? "opacity-40" : ""}`}
            onClick={() => handleDayClick(currentDay)}
          >
            <div className="flex justify-between">
              <span
                className={`font-medium text-sm ${
                  isToday(day) ? "text-pink-400" : ""
                }`}
              >
                {format(day, "d")}
              </span>
            </div>
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={idx}
                  className="text-xs truncate rounded px-1 py-0.5 text-white"
                  style={{ backgroundColor: event.color + "66" }}
                >
                  {event.title.split(":")[1] || event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-pink-400">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={`row-${day}`} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="overflow-auto">
        <div className="grid grid-cols-7">{dayHeaders}</div>
        {rows}
      </div>
    );
  };

  // Render the week view calendar
  const renderWeekView = () => {
    return (
      <div className="h-[calc(100vh-320px)] overflow-hidden flex flex-col">
        {/* Week container with horizontal scrolling */}
        <div className="overflow-x-auto">
          {/* Fixed width container to ensure proper alignment */}
          <div className="min-w-[800px]">
            {/* Day headers - these stay fixed */}
            <div className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 flex">
              {/* Empty cell for time column */}
              <div className="w-16 h-10 bg-gray-900 border-r border-gray-800 flex-shrink-0"></div>

              {/* Day headers */}
              <div className="flex-1 grid grid-cols-7">
                {DAYS_OF_WEEK.map((day, index) => {
                  const dayDate = addDays(
                    startOfWeek(currentDate, { weekStartsOn: 1 }),
                    index
                  );
                  return (
                    <div
                      key={day}
                      className={`h-10 flex flex-col items-center justify-center ${
                        isToday(dayDate) ? "bg-pink-900/20" : ""
                      }`}
                    >
                      <div className="font-medium text-pink-300">{day}</div>
                      <div className="text-xs text-gray-400">
                        {getDateForDay(index)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable time grid */}
            <div
              ref={weekScrollRef}
              className="overflow-y-auto max-h-[calc(100vh-370px)]"
            >
              <div className="flex">
                {/* Time labels column - fixed position */}
                <div className="w-16 bg-gray-900 border-r border-gray-800 flex-shrink-0 sticky left-0 z-10">
                  {TIME_SLOTS.map((time) => (
                    <div
                      key={time}
                      className="h-14 border-b border-gray-800 relative"
                    >
                      <div className="absolute -top-[9px] left-2 text-xs text-gray-400">
                        {time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time slots grid */}
                <div className="flex-1 grid grid-cols-7">
                  {DAYS_OF_WEEK.map((day, dayIndex) => (
                    <div key={day} className="col-span-1">
                      {TIME_SLOTS.map((time) => {
                        const events = getEventsForTimeSlot(day, time, schedules);
                        const dayDate = addDays(
                          startOfWeek(currentDate, { weekStartsOn: 1 }),
                          dayIndex
                        );
                        const isCurrentTimeSlot =
                          isToday(dayDate) &&
                          new Date().getHours() ===
                            Number.parseInt(time.split(":")[0], 10);

                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`h-14 border-b border-r border-gray-800 relative ${
                              isToday(dayDate) ? "bg-pink-900/5" : ""
                            }`}
                          >
                            {/* Current time indicator */}
                            {isCurrentTimeSlot && (
                              <div
                                className="absolute left-0 right-0 border-t-2 border-pink-500 z-10"
                                style={{
                                  top: `${
                                    (new Date().getMinutes() / 60) * 100
                                  }%`,
                                }}
                              >
                                <div className="absolute -left-1 -top-1.5 w-2 h-2 rounded-full bg-pink-500"></div>
                              </div>
                            )}

                            {events.map((event, idx) => (
                              <div
                                key={`${event.id}-${idx}`}
                                className="absolute inset-0.5 rounded overflow-hidden flex flex-col"
                                style={{ backgroundColor: event.color + "33" }} // Add transparency
                              >
                                <div
                                  className="h-1 w-full"
                                  style={{ backgroundColor: event.color }}
                                ></div>
                                <div className="p-1 text-xs">
                                  <div
                                    className="font-medium"
                                    style={{ color: event.color }}
                                  >
                                    {event.title}
                                  </div>
                                  <div className="text-[10px] text-gray-300">
                                    {event.description}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the day view calendar
  const renderDayView = () => {
    const dayEvents = getEventsForSelectedDay(currentDate, schedules);
    const dayName = format(currentDate, "EEEE"); // Full day name

    return (
      <div className="h-[calc(100vh-320px)] overflow-hidden flex flex-col">
        {/* Day header - this stays fixed */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 grid grid-cols-[auto_1fr]">
          {/* Empty cell for time column */}
          <div className="h-10 bg-gray-900 border-r border-gray-800"></div>

          {/* Day header */}
          <div
            className={`h-10 flex items-center justify-center ${
              isToday(currentDate) ? "bg-pink-900/20" : ""
            }`}
          >
            <div className="font-medium text-pink-300">
              {dayName} ({format(currentDate, "MMMM d")})
            </div>
          </div>
        </div>

        {/* Scrollable time grid */}
        <div ref={dayScrollRef} className="overflow-auto flex-1">
          <div className="grid grid-cols-[auto_1fr] min-w-[600px]">
            {/* Time labels column */}
            <div className="bg-gray-900 border-r border-gray-800 w-16">
              {TIME_SLOTS.map((time, index) => (
                <div
                  key={time}
                  className="h-16 border-b border-gray-800 relative"
                >
                  <div className="absolute -top-[9px] left-2 text-xs text-gray-400">
                    {index === 0 ? (
                      <span>
                        00:00
                        <br />
                        {format(currentDate, "MMM d")}
                      </span>
                    ) : (
                      time
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div>
              {TIME_SLOTS.map((time) => {
                const timeEvents = dayEvents.filter((event) => {
                  const eventStartHour = Number.parseInt(
                    event.startTime.split(":")[0],
                    10
                  );
                  const eventEndHour = Number.parseInt(
                    event.endTime.split(":")[0],
                    10
                  );
                  const slotHour = Number.parseInt(time.split(":")[0], 10);

                  // Handle events that end at midnight (00:00)
                  if (eventEndHour === 0) {
                    return eventStartHour <= slotHour;
                  }

                  return eventStartHour <= slotHour && eventEndHour > slotHour;
                });

                return (
                  <div
                    key={time}
                    className={`h-16 border-b border-gray-800 relative ${
                      isToday(currentDate) &&
                      new Date().getHours() === Number.parseInt(time)
                        ? "bg-pink-900/10"
                        : ""
                    }`}
                  >
                    {/* Current time indicator */}
                    {isToday(currentDate) &&
                      new Date().getHours() === Number.parseInt(time) && (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-pink-500 z-10"
                          style={{
                            top: `${(new Date().getMinutes() / 60) * 100}%`,
                          }}
                        >
                          <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-pink-500"></div>
                        </div>
                      )}

                    {timeEvents.map((event, idx) => (
                      <div
                        key={`${event.id}-${idx}`}
                        className="absolute inset-2 rounded overflow-hidden flex flex-col"
                        style={{ backgroundColor: event.color + "33" }} // Add transparency
                      >
                        <div
                          className="h-1.5 w-full"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <div className="p-2">
                          <div
                            className="font-medium text-sm"
                            style={{ color: event.color }}
                          >
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-300">
                            {event.description}
                          </div>
                          <div className="text-xs mt-1 flex items-center">
                            <span className="text-gray-400">
                              {event.startTime} - {event.endTime}
                            </span>
                            {/* {event.participants && (
                              <Badge className="ml-2 bg-gray-700 text-white text-[10px]">
                                {event.description.split(" ")[0]}
                              </Badge>
                            )} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add quick navigation buttons for scrolling to specific times
  const renderTimeNavigation = () => {
    const jumpToTime = (hour: number) => {
      if (currentView === "week" && weekScrollRef.current) {
        weekScrollRef.current.scrollTop = hour * TIME_SLOT_HEIGHT;
      } else if (currentView === "day" && dayScrollRef.current) {
        dayScrollRef.current.scrollTop = hour * DAY_SLOT_HEIGHT;
      }
    };

    return (
      <div className="flex space-x-1 mb-2">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2"
          onClick={() => jumpToTime(0)}
        >
          00:00
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2"
          onClick={() => jumpToTime(8)}
        >
          08:00
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2"
          onClick={() => jumpToTime(12)}
        >
          12:00
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-xs px-2"
          onClick={() => jumpToTime(18)}
        >
          18:00
        </Button>
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <Card className="border-gray-800 bg-gray-950 text-gray-100 shadow-xl">
        <CardHeader className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-pink-400">
              Schedule Dashboard
            </h1>
            <Button
              className="bg-pink-700 hover:bg-pink-600 text-white"
              size="sm"
              onClick={() => setShowEventForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
              >
                Today
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-800 hover:bg-pink-950 hover:text-pink-300 h-8 w-8"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {currentView === "month" ? (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold min-w-[100px]">
                      {format(currentDate, "MMMM")}
                    </h2>
                    <Select
                      value={currentDate.getFullYear().toString()}
                      onValueChange={(year) => {
                        const newDate = new Date(currentDate);
                        newDate.setFullYear(Number.parseInt(year));
                        setCurrentDate(newDate);
                      }}
                    >
                      <SelectTrigger className="w-[4.5rem] h-8 border-gray-700 bg-gray-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() - 5 + i;
                          return (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="text-white hover:bg-gray-700"
                            >
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold">{getDateRange()}</h2>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-800 hover:bg-pink-950 hover:text-pink-300 h-8 w-8"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-2 self-end sm:self-auto">
              <Button
                variant={currentView === "month" ? "default" : "outline"}
                size="sm"
                className={
                  currentView === "month"
                    ? "bg-pink-700 hover:bg-pink-600 text-white"
                    : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                }
                onClick={() => setCurrentView("month")}
              >
                Month
              </Button>
              <Button
                variant={currentView === "week" ? "default" : "outline"}
                size="sm"
                className={
                  currentView === "week"
                    ? "bg-pink-700 hover:bg-pink-600 text-white"
                    : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                }
                onClick={() => setCurrentView("week")}
              >
                Week
              </Button>
              <Button
                variant={currentView === "day" ? "default" : "outline"}
                size="sm"
                className={
                  currentView === "day"
                    ? "bg-pink-700 hover:bg-pink-600 text-white"
                    : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                }
                onClick={() => setCurrentView("day")}
              >
                Day
              </Button>
            </div>
          </div>

          {(currentView === "day" || currentView === "week") &&
            renderTimeNavigation()}
        </CardHeader>

        <CardContent className="p-0 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {currentView === "month" && renderMonthView()}
            {currentView === "week" && renderWeekView()}
            {currentView === "day" && renderDayView()}
          </div>

          {/* Legend, Common Free Time, and Group Work Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-gray-800">
            <ScheduleLegend schedules={[{userId: currentUser.id, user: currentUser, events: schedules}]} />
            {selectedFriends.length > 0 && (
              <>
                <CommonFreeTime
                  userSchedule={[
                    schedules[0]
                  ]}
                  friendSchedules={schedules.filter(
                    (s) => s.userId !== "user-1"
                  )}
                  selectedFriends={selectedFriends}
                />
                <GroupWorkRecommendations
                  userSchedule={
                    schedules
                  }
                  friendSchedules={schedules.filter(
                    (s) => s.userId !== "user-1"
                  )}
                  selectedFriends={selectedFriends}
                  onTimeSlotClick={handleGroupWorkTimeSlotClick}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Creation Form */}
      <EventCreationForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEventFormData(null); // Reset the form data when closing
        }}
        selectedDate={eventFormData?.date || currentDate}
        startTime={eventFormData?.startTime}
        endTime={eventFormData?.endTime}
        currentUser={currentUser}
        following={following}
      />
    </div>
  );
}
