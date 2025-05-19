"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  Users,
  Tag,
  Check,
  X,
  Bell,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCreationForm from "@/components/EventCreationForm";
import type { User } from "@/lib/types";
import Participant from "@/models/Participant";
import Event from "@/models/Schedule";

interface EventViewProps {
  currentUser: User;
  following: User[];
}

// Sample events data with invitation status
const EVENTS = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    date: "2025-05-15",
    time: "10:00 AM",
    duration: "1 hour",
    category: "work",
    location: "Room 301",
    participants: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 3,
        name: "Emily Wong",
        avatar: "/placeholder.svg?height=24&width=24",
      },
    ],
    createdBy: { id: "user-1", name: "John Doe" },
    invitationStatus: "accepted", // new field
  },
  {
    id: 2,
    title: "Study Group",
    description: "Prepare for the upcoming database exam",
    date: "2025-05-16",
    time: "12:30 PM",
    duration: "2 hours",
    category: "study",
    location: "Library",
    participants: [
      {
        id: 2,
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 5,
        name: "Anna Kim",
        avatar: "/placeholder.svg?height=24&width=24",
      },
    ],
    createdBy: { id: "user-2", name: "Alice Smith" },
    invitationStatus: "pending", // new field
  },
  {
    id: 3,
    title: "Project Deadline",
    description: "Final submission for the semester project",
    date: "2025-05-20",
    time: "5:00 PM",
    duration: "N/A",
    category: "work",
    location: "Online",
    participants: [],
    createdBy: { id: "user-1", name: "John Doe" },
    invitationStatus: "accepted", // new field
  },
  {
    id: 4,
    title: "Group Presentation",
    description: "Present our findings to the class",
    date: "2025-05-22",
    time: "7:00 AM",
    duration: "30 minutes",
    category: "study",
    location: "Room 105",
    participants: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 4,
        name: "David Lee",
        avatar: "/placeholder.svg?height=24&width=24",
      },
    ],
    createdBy: { id: "user-3", name: "Bob Johnson" },
    invitationStatus: "pending", // new field
  },
  {
    id: 5,
    title: "Database Workshop",
    description: "Hands-on workshop on advanced SQL techniques",
    date: "2025-05-25",
    time: "2:00 PM",
    duration: "3 hours",
    category: "study",
    location: "Computer Lab",
    participants: [
      {
        id: 2,
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 5,
        name: "Anna Kim",
        avatar: "/placeholder.svg?height=24&width=24",
      },
    ],
    createdBy: { id: "user-4", name: "Carol Williams" },
    invitationStatus: "declined", // new field
  },
  {
    id: 6,
    title: "End of Semester Party",
    description: "Celebrate the end of the semester with classmates",
    date: "2025-06-01",
    time: "7:00 PM",
    duration: "4 hours",
    category: "social",
    location: "Student Center",
    participants: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 3,
        name: "Emily Wong",
        avatar: "/placeholder.svg?height=24&width=24",
      },
      {
        id: 4,
        name: "David Lee",
        avatar: "/placeholder.svg?height=24&width=24",
      },
    ],
    createdBy: { id: "user-5", name: "David Lee" },
    invitationStatus: "pending", // new field
  },
];

export default function EventView({ currentUser, following }: EventViewProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState(EVENTS);
  const [showEventForm, setShowEventForm] = useState(false);

  // Handle invitation response
  const handleInvitationResponse = (
    eventId: number,
    status: "accepted" | "declined"
  ) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, invitationStatus: status } : event
      )
    );
  };

  // Filter events based on the active tab
  const filteredEvents = events.filter((event) => {
    // First apply search filter if any
    if (searchQuery) {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
    }

    if (activeTab === "upcoming") {
      // Show all upcoming events
      return new Date(event.date) >= new Date();
    } else if (activeTab === "created") {
      // Show events created by the current user
      return event.createdBy.id === currentUser.id;
    } else if (activeTab === "invited") {
      // Show events where the current user is invited
      // Apply status filter if selected
      if (statusFilter !== "all") {
        return (
          event.createdBy.id !== currentUser.id &&
          event.invitationStatus === statusFilter
        );
      }
      return event.createdBy.id !== currentUser.id;
    }
    return true;
  });

  // Count pending invitations
  const pendingInvitationsCount = events.filter(
    (event) =>
      event.createdBy.id !== currentUser.id &&
      event.invitationStatus === "pending"
  ).length;

  return (
    <Card className="border-gray-800 bg-gray-950 text-gray-100 shadow-xl">
      <CardHeader className="bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-pink-400">Events</CardTitle>
          <Button
            className="bg-pink-700 hover:bg-pink-600 text-white"
            onClick={() => setShowEventForm(true)}
          >
            <Calendar className="h-4 w-4 mr-1" /> Create Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          defaultValue="upcoming"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 bg-gray-900">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger
              value="created"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Created by Me
            </TabsTrigger>
            <TabsTrigger
              value="invited"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white relative"
            >
              <Mail className="h-4 w-4 mr-2" />
              Invited to
              {pendingInvitationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingInvitationsCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {activeTab === "invited" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-gray-700"
                  >
                    All Invitations
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="text-white hover:bg-gray-700"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="accepted"
                    className="text-white hover:bg-gray-700"
                  >
                    Accepted
                  </SelectItem>
                  <SelectItem
                    value="declined"
                    className="text-white hover:bg-gray-700"
                  >
                    Declined
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="created" className="mt-0">
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  You haven't created any events yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invited" className="mt-0">
            {pendingInvitationsCount > 0 && (
              <div className="mb-6 p-4 bg-pink-900/20 border border-pink-800 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-pink-400 mr-3" />
                <div className="flex-1">
                  <p className="text-pink-300 font-medium">
                    You have {pendingInvitationsCount} pending invitation
                    {pendingInvitationsCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-pink-200/70">
                    Please respond to these invitations to update your schedule
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <InvitationCard
                    key={event.id}
                    event={event}
                    onRespond={handleInvitationResponse}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || statusFilter !== "all"
                    ? "No invitations match your search criteria"
                    : "You haven't been invited to any events"}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Event Creation Form */}
      <EventCreationForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        selectedDate={new Date()}
        currentUser={currentUser}
        following={following}
      />
    </Card>
  );
}

function EventCard(event: { event: Event }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg text-pink-300">
            {event.event.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {event.event.description}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`
            ${
              event.event.category === "work"
                ? "border-pink-500 text-pink-400"
                : ""
            }
            ${
              event.event.category === "study"
                ? "border-purple-500 text-purple-400"
                : ""
            }
            ${
              event.event.category === "social"
                ? "border-blue-500 text-blue-400"
                : ""
            }
            capitalize
          `}
        >
          {event.event.category}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {event.event.date}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          {event.event.time} ({event.event.duration})
        </div>
        <div className="flex items-center text-sm text-gray-300 col-span-2">
          <Tag className="h-4 w-4 mr-2 text-gray-500" />
          {event.event.location}
        </div>
      </div>

      {event.event.participants.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-2">Participants:</p>
          <div className="flex flex-wrap gap-2">
            {event.event.participants.map((participant: Participant) => (
              <div
                key={participant.id}
                className="flex items-center bg-gray-800 rounded-full px-2 py-1"
              >
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage
                    src={participant.avatar || "/placeholder.svg"}
                    alt={participant.name}
                  />
                  <AvatarFallback className="text-[10px] bg-pink-900">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-300">
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800 text-gray-300"
        >
          View Details
        </Button>
        <Button size="sm" className="bg-pink-700 hover:bg-pink-600 text-white">
          Join Event
        </Button>
      </div>
    </div>
  );
}

// Invitation card component with accept/decline actions
function InvitationCard({
  event,
  onRespond,
}: {
  event: Event;
  onRespond: (id: number, status: "accepted" | "declined") => void;
}) {
  return (
    <div
      className={`p-4 bg-gray-900 rounded-lg border ${
        event.invitationStatus === "pending"
          ? "border-pink-800"
          : event.invitationStatus === "accepted"
          ? "border-green-800"
          : "border-gray-800"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-lg text-pink-300">{event.title}</h3>
            {event.invitationStatus === "pending" && (
              <Badge className="ml-2 bg-pink-900 text-pink-100">Pending</Badge>
            )}
            {event.invitationStatus === "accepted" && (
              <Badge className="ml-2 bg-green-900 text-green-100">
                Accepted
              </Badge>
            )}
            {event.invitationStatus === "declined" && (
              <Badge className="ml-2 bg-gray-700 text-gray-300">Declined</Badge>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{event.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Invited by: {event.createdBy.name}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`
            ${event.category === "work" ? "border-pink-500 text-pink-400" : ""}
            ${
              event.category === "study"
                ? "border-purple-500 text-purple-400"
                : ""
            }
            ${
              event.category === "social" ? "border-blue-500 text-blue-400" : ""
            }
            capitalize
          `}
        >
          {event.category}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {event.date}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          {event.time} ({event.duration})
        </div>
        <div className="flex items-center text-sm text-gray-300 col-span-2">
          <Tag className="h-4 w-4 mr-2 text-gray-500" />
          {event.location}
        </div>
      </div>

      {event.participants.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-2">Other Participants:</p>
          <div className="flex flex-wrap gap-2">
            {event.participants.map((participant: Participant) => (
              <div
                key={participant.id}
                className="flex items-center bg-gray-800 rounded-full px-2 py-1"
              >
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage
                    src={participant.avatar || "/placeholder.svg"}
                    alt={participant.name}
                  />
                  <AvatarFallback className="text-[10px] bg-pink-900">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-300">
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div>
          {event.invitationStatus === "pending" && (
            <p className="text-xs text-pink-300 flex items-center">
              <Bell className="h-3 w-3 mr-1" /> Please respond to this
              invitation
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {event.invitationStatus === "pending" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-red-800 hover:bg-red-900/30 text-red-300 flex items-center"
                onClick={() => onRespond(event.id, "declined")}
              >
                <X className="h-4 w-4 mr-1" /> Decline
              </Button>
              <Button
                size="sm"
                className="bg-green-700 hover:bg-green-600 text-white flex items-center"
                onClick={() => onRespond(event.id, "accepted")}
              >
                <Check className="h-4 w-4 mr-1" /> Accept
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800 text-gray-300"
              >
                View Details
              </Button>
              {event.invitationStatus === "accepted" ? (
                <Button
                  size="sm"
                  className="bg-pink-700 hover:bg-pink-600 text-white"
                >
                  Add to Calendar
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-pink-700 hover:bg-pink-600 text-white"
                  onClick={() => onRespond(event.id, "accepted")}
                >
                  Accept Invitation
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
