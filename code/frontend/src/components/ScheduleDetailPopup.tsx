"use client";

import React, { useState } from "react";
import { Trash2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Schedule, User } from "@/lib/types";
import { format } from "date-fns";

interface ScheduleDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  event: (Schedule & { user?: User }) | null;
  currentUser: User;
  onDeleted?: () => void;
}

export default function ScheduleDetailPopup({
  isOpen,
  onClose,
  event,
  currentUser,
  onDeleted,
}: ScheduleDetailPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) return null;

  const formatTime = (startTime: string, endTime: string) => {
    const getTime = (iso: string) => format(new Date(iso), "HH:mm");
    return `${getTime(startTime)} - ${getTime(endTime)}`;
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    let end = new Date(endTime);
    if (end < start) end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours === 0) return `${diffMinutes} minutes`;
    else if (diffMinutes === 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    else
      return `${diffHours} hour${
        diffHours > 1 ? "s" : ""
      } ${diffMinutes} minutes`;
  };

  const getDayLabel = (iso: string) =>
    format(new Date(iso), "EEEE, MMM d yyyy");

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const canDelete = !event.user || event.user.id === currentUser.id;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8888/delete-schedule/${event.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to delete schedule");
      }
      if (onDeleted) onDeleted();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to delete schedule");
    } finally {
      setIsDeleting(false);
    }
  };

  const owner = event.user || currentUser;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-pink-400 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Event Title */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-400">{event.description}</p>
          </div>

          {/* Event Color Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-600"
              style={{ backgroundColor: event.color }}
            ></div>
            <span className="text-sm text-gray-300">Event Color</span>
          </div>

          {/* Day and Time */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">
                {getDayLabel(event.startTime)}
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatTime(event.startTime, event.endTime)}</span>
              <Badge
                variant="outline"
                className="ml-2 text-xs border-gray-600 text-gray-400"
              >
                {calculateDuration(event.startTime, event.endTime)}
              </Badge>
            </div>
          </div>

          {/* Owner Information */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={owner.profilePicture || "/placeholder.svg"}
                alt={owner.name}
              />
              <AvatarFallback className="bg-pink-900 text-pink-100">
                {getInitial(owner.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{owner.name}</p>
              <p className="text-xs text-gray-400">{owner.major}</p>
            </div>
            {owner.id !== currentUser.id && (
              <Badge className="bg-blue-900/50 text-blue-300 text-xs">
                Friend's Schedule
              </Badge>
            )}
            {owner.id === currentUser.id && (
              <Badge className="bg-pink-900/50 text-pink-300 text-xs">
                Your Schedule
              </Badge>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500">
              {canDelete
                ? "You can modify this event"
                : "You can only view this event"}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-gray-700 hover:bg-gray-800 text-gray-300"
                disabled={isDeleting}
              >
                Close
              </Button>
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="bg-red-700 hover:bg-red-600 text-white flex items-center"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
