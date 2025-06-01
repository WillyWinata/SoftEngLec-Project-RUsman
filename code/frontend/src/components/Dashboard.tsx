"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ScheduleView from "@/components/ScheduleView";
import FollowingView from "@/components/FollowingView";
import EventView from "@/components/EventView";
import type { User, Schedule } from "@/lib/types";
import { useNavigate } from "react-router-dom";

// Sample data
// const CURRENT_USER: User = {
//   id: "user-1",
//   name: "John Doe",
//   email: "john.doe@example.com",
//   department: "Computer Science",
//   year: "2023",
//   avatar: "/placeholder.svg?height=40&width=40",
// };

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
];

export default function Dashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(["user-2"]); // Default to showing Alice's schedule
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">(
    "week"
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  // Add a new state for active tab
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Toggle friend selection
  const toggleFriend = (userId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    console.log("Dashboard mounted");
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoading(false);
      setCurrentUser(JSON.parse(user));
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const getSchedules = async () => {
      const response = await fetch("http://localhost:8888/get-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      });
      const data = await response.json();
      setSchedules(data);
    };

    getSchedules();
  }, [currentUser]);

  // const getSchedulesToDisplay = () => {
  //   const schedules: { userId: string; user: User; events: Schedule[] }[] = [
  //     {
  //       userId: CURRENT_USER.id,
  //       user: CURRENT_USER,
  //       events: SCHEDULES[CURRENT_USER.id] || [],
  //     },
  //   ];

  //   // Add selected friends' schedules (only if mutual follow)
  //   selectedFriends.forEach((friendId) => {
  //     const friend = FOLLOWING.find((f) => f.id === friendId);
  //     if (friend && friend.mutualFollow) {
  //       schedules.push({
  //         userId: friend.id,
  //         user: friend,
  //         events: SCHEDULES[friend.id] || [],
  //       });
  //     }
  //   });

  //   return schedules;
  // };

  // Add this function to handle tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <div className="flex min-h-screen bg-gray-950">Loading...</div>;
  }

  // Update the return statement to pass the new props to Sidebar
  return (
    <>
      <div className="w-64">
        <Sidebar
          currentUser={currentUser as User}
          following={FOLLOWING}
          selectedFriends={selectedFriends}
          toggleFriend={toggleFriend}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <div className="mb-4 bg-gray-900 rounded-md inline-flex">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "calendar"
                  ? "bg-pink-900 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "events"
                  ? "bg-pink-900 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "following"
                  ? "bg-pink-900 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>

        {activeTab === "calendar" ? (
          <ScheduleView
            schedules={schedules}
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedFriends={
              selectedFriends
                .map((id) => FOLLOWING.find((f) => f.id === id))
                .filter(Boolean) as User[]
            }
            currentUser={currentUser as User}
            following={FOLLOWING}
          />
        ) : activeTab === "events" ? (
          <div className="flex-1 p-4">
            <EventView
              currentUser={currentUser as User}
              following={FOLLOWING}
            />
          </div>
        ) : (
          <div className="flex-1 p-4">
            <FollowingView following={FOLLOWING} />
          </div>
        )}
      </div>
    </>
  );
}
