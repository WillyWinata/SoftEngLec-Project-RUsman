"use client";

import type { User } from "@/lib/types";
import { Calendar, Users, CalendarClock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  currentUser: User;
  following: User[];
  selectedFriends: string[];
  toggleFriend: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({
  currentUser,
  following,
  selectedFriends,
  toggleFriend,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  // Filter to only show mutual follows
  const mutualFollows = following.filter((user) => user.mutualFollow);

  return (
    <div className=" fixed top-0 left-0 w-64 bg-gray-900 text-white min-h-screen p-4 border-r border-gray-800">
      <div className="mb-8 p-2">
        <h1 className="text-4xl tracking-widest font-bold text-pink-400">
          RUsman
        </h1>
      </div>

      <nav className="space-y-1 mb-6">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
            activeTab === "calendar"
              ? "bg-pink-900/50 text-pink-100"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
            activeTab === "events"
              ? "bg-pink-900/50 text-pink-100"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <CalendarClock className="h-5 w-5" />
          <span>Events</span>
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
            activeTab === "following"
              ? "bg-pink-900/50 text-pink-100"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Following</span>
        </button>
      </nav>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          View Other Schedules
        </h2>
        <div className="space-y-3">
          {mutualFollows.length > 0 ? (
            mutualFollows.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`friend-${friend.id}`}
                  checked={selectedFriends.includes(friend.id)}
                  onCheckedChange={() => toggleFriend(friend.id)}
                  className="border-gray-600 data-[state=checked]:bg-pink-600"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={friend.profilePicture}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Label
                    htmlFor={`friend-${friend.id}`}
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {friend.name}
                    <div className="text-xs text-gray-500">{friend.major}</div>
                  </Label>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No mutual follows yet</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
            <img
              src={currentUser.profilePicture}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-sm text-gray-400">{currentUser.studentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
