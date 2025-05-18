"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import ScheduleView from "@/components/schedule-view"
import FollowingView from "@/components/following-view"
import EventView from "@/components/event-view"
import type { User, Schedule } from "@/lib/types"

// Sample data
const CURRENT_USER: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  department: "Computer Science",
  year: "2023",
  avatar: "/placeholder.svg?height=40&width=40",
}

const FOLLOWING: User[] = [
  {
    id: "user-2",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    department: "Computer Science",
    year: "2022",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: true,
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    department: "Software Engineering",
    year: "2023",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: true,
  },
  {
    id: "user-4",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    department: "Data Science",
    year: "2022",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: true,
  },
  {
    id: "user-5",
    name: "David Lee",
    email: "david.lee@example.com",
    department: "Business",
    year: "2021",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false, // Not mutual follow
  },
]

// Sample schedule data
const SCHEDULES: Record<string, Schedule[]> = {
  "user-1": [
    {
      id: "event-1",
      title: "Your Schedule: Database",
      course: "Database (RS-01)",
      day: "Monday",
      startTime: "08:00",
      endTime: "09:40",
      color: "#3b82f6", // blue
    },
    {
      id: "event-2",
      title: "Your Schedule: Database",
      course: "Database (RS-01)",
      day: "Tuesday",
      startTime: "08:00",
      endTime: "09:40",
      color: "#3b82f6", // blue
    },
    {
      id: "event-3",
      title: "Your Schedule: Database",
      course: "Database (RS-01)",
      day: "Wednesday",
      startTime: "08:00",
      endTime: "09:40",
      color: "#3b82f6", // blue
    },
    {
      id: "event-4",
      title: "Your Schedule: Database",
      course: "Database (RS-01)",
      day: "Thursday",
      startTime: "08:00",
      endTime: "09:40",
      color: "#3b82f6", // blue
    },
    {
      id: "event-5",
      title: "Your Schedule: Database",
      course: "Database (RS-01)",
      day: "Friday",
      startTime: "08:00",
      endTime: "09:40",
      color: "#3b82f6", // blue
    },
  ],
  "user-2": [
    {
      id: "event-6",
      title: "Alice's Schedule: Computer Networks",
      course: "Computer Networks (LA-02)",
      day: "Monday",
      startTime: "10:00",
      endTime: "11:40",
      color: "#f59e0b", // amber
    },
    {
      id: "event-7",
      title: "Alice's Schedule: Computer Networks",
      course: "Computer Networks (LA-02)",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:40",
      color: "#f59e0b", // amber
    },
    {
      id: "event-8",
      title: "Alice's Schedule: Computer Networks",
      course: "Computer Networks (LA-02)",
      day: "Wednesday",
      startTime: "10:00",
      endTime: "11:40",
      color: "#f59e0b", // amber
    },
    {
      id: "event-9",
      title: "Alice's Schedule: Computer Networks",
      course: "Computer Networks (LA-02)",
      day: "Thursday",
      startTime: "10:00",
      endTime: "11:40",
      color: "#f59e0b", // amber
    },
    {
      id: "event-10",
      title: "Alice's Schedule: Computer Networks",
      course: "Computer Networks (LA-02)",
      day: "Friday",
      startTime: "10:00",
      endTime: "11:40",
      color: "#f59e0b", // amber
    },
  ],
  "user-3": [
    {
      id: "event-11",
      title: "Bob's Schedule: Software Engineering",
      course: "Software Engineering (LA-03)",
      day: "Monday",
      startTime: "13:00",
      endTime: "14:40",
      color: "#10b981", // emerald
    },
    {
      id: "event-12",
      title: "Bob's Schedule: Software Engineering",
      course: "Software Engineering (LA-03)",
      day: "Wednesday",
      startTime: "13:00",
      endTime: "14:40",
      color: "#10b981", // emerald
    },
    {
      id: "event-13",
      title: "Bob's Schedule: Software Engineering",
      course: "Software Engineering (LA-03)",
      day: "Friday",
      startTime: "13:00",
      endTime: "14:40",
      color: "#10b981", // emerald
    },
  ],
  "user-4": [
    {
      id: "event-14",
      title: "Carol's Schedule: Data Mining",
      course: "Data Mining (LA-04)",
      day: "Tuesday",
      startTime: "13:00",
      endTime: "14:40",
      color: "#8b5cf6", // violet
    },
    {
      id: "event-15",
      title: "Carol's Schedule: Data Mining",
      course: "Data Mining (LA-04)",
      day: "Thursday",
      startTime: "13:00",
      endTime: "14:40",
      color: "#8b5cf6", // violet
    },
    {
      id: "event-16",
      title: "Carol's Schedule: Machine Learning",
      course: "Machine Learning (LA-05)",
      day: "Monday",
      startTime: "15:00",
      endTime: "16:40",
      color: "#8b5cf6", // violet
    },
    {
      id: "event-17",
      title: "Carol's Schedule: Machine Learning",
      course: "Machine Learning (LA-05)",
      day: "Wednesday",
      startTime: "15:00",
      endTime: "16:40",
      color: "#8b5cf6", // violet
    },
  ],
}

export default function Dashboard() {
  const [selectedFriends, setSelectedFriends] = useState<string[]>(["user-2"]) // Default to showing Alice's schedule
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  // Add a new state for active tab
  const [activeTab, setActiveTab] = useState("calendar")

  // Toggle friend selection
  const toggleFriend = (userId: string) => {
    setSelectedFriends((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Get all schedules to display (current user + selected friends)
  const getSchedulesToDisplay = () => {
    const schedules: { userId: string; user: User; events: Schedule[] }[] = [
      { userId: CURRENT_USER.id, user: CURRENT_USER, events: SCHEDULES[CURRENT_USER.id] || [] },
    ]

    // Add selected friends' schedules (only if mutual follow)
    selectedFriends.forEach((friendId) => {
      const friend = FOLLOWING.find((f) => f.id === friendId)
      if (friend && friend.mutualFollow) {
        schedules.push({
          userId: friend.id,
          user: friend,
          events: SCHEDULES[friend.id] || [],
        })
      }
    })

    return schedules
  }

  // Add this function to handle tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Update the return statement to pass the new props to Sidebar
  return (
    <>
      <Sidebar
        currentUser={CURRENT_USER}
        following={FOLLOWING}
        selectedFriends={selectedFriends}
        toggleFriend={toggleFriend}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <div className="mb-4 bg-gray-900 rounded-md inline-flex">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "calendar" ? "bg-pink-900 text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "events" ? "bg-pink-900 text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "following" ? "bg-pink-900 text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>

        {activeTab === "calendar" ? (
          <ScheduleView
            schedules={getSchedulesToDisplay()}
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedFriends={selectedFriends.map((id) => FOLLOWING.find((f) => f.id === id)).filter(Boolean) as User[]}
            currentUser={CURRENT_USER}
            following={FOLLOWING}
          />
        ) : activeTab === "events" ? (
          <div className="flex-1 p-4">
            <EventView currentUser={CURRENT_USER} following={FOLLOWING} />
          </div>
        ) : (
          <div className="flex-1 p-4">
            <FollowingView following={FOLLOWING} />
          </div>
        )}
      </div>
    </>
  )
}
