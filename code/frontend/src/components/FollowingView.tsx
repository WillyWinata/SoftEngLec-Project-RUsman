"use client";

import { useState } from "react";
import { Search, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/lib/types";

interface FollowingViewProps {
  following: User[];
}

// Sample data for discoverable students
const DISCOVERABLE_STUDENTS: User[] = [
  {
    id: "user-6",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    department: "Computer Science",
    year: "2023",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false,
  },
  {
    id: "user-7",
    name: "Michael Brown",
    email: "michael.b@example.com",
    department: "Information Systems",
    year: "2022",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false,
  },
  {
    id: "user-8",
    name: "Sophia Garcia",
    email: "sophia.g@example.com",
    department: "Data Science",
    year: "2024",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false,
  },
  {
    id: "user-9",
    name: "James Martinez",
    email: "james.m@example.com",
    department: "Software Engineering",
    year: "2023",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false,
  },
  {
    id: "user-10",
    name: "Olivia Taylor",
    email: "olivia.t@example.com",
    department: "Computer Science",
    year: "2022",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFollow: false,
  },
];

// Departments for filtering
const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Information Systems",
  "Data Science",
  "Software Engineering",
  "Business",
];

export default function FollowingView({ following }: FollowingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [discoverableStudents, setDiscoverableStudents] = useState(
    DISCOVERABLE_STUDENTS
  );
  const [followingList, setFollowingList] = useState(following);

  // Handle follow/unfollow action
  const handleFollowToggle = (studentId: string, isDiscoverable = false) => {
    if (isDiscoverable) {
      // Find the student in the discoverable list
      const student = discoverableStudents.find((s) => s.id === studentId);
      if (student) {
        // Add to following list
        setFollowingList([
          ...followingList,
          { ...student, mutualFollow: false },
        ]);
        // Remove from discoverable list
        setDiscoverableStudents(
          discoverableStudents.filter((s) => s.id !== studentId)
        );
      }
    } else {
      // Toggle follow status in the following list
      setFollowingList(
        followingList.map((student) =>
          student.id === studentId
            ? { ...student, mutualFollow: !student.mutualFollow }
            : student
        )
      );
    }
  };

  // Filter students based on search query and department
  const filterStudents = (students: User[]) => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        department === "All Departments" || student.department === department;
      return matchesSearch && matchesDepartment;
    });
  };

  const filteredFollowing = filterStudents(followingList);
  const filteredDiscoverable = filterStudents(discoverableStudents);

  return (
    <Card className="border-gray-800 bg-gray-950 text-gray-100 shadow-xl">
      <CardHeader className="bg-gray-900 border-b border-gray-800">
        <CardTitle className="text-pink-400">Student Connections</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="following" className="w-full">
          <TabsList className="mb-6 bg-gray-900">
            <TabsTrigger
              value="following"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Following ({followingList.length})
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Discover Students
            </TabsTrigger>
          </TabsList>

          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem
                    key={dept}
                    value={dept}
                    className="text-white hover:bg-gray-700"
                  >
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="following" className="mt-0">
            <div className="space-y-4">
              {filteredFollowing.length > 0 ? (
                filteredFollowing.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                        <div className="text-xs text-gray-500">
                          {student.department} • {student.year}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        View Schedule
                      </Button>
                      <Button
                        size="sm"
                        className={
                          student.mutualFollow
                            ? "bg-pink-800 hover:bg-pink-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }
                        onClick={() => handleFollowToggle(student.id)}
                      >
                        {student.mutualFollow ? "Following" : "Follow Back"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || department !== "All Departments"
                    ? "No students match your search criteria"
                    : "You're not following any students yet"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <div className="space-y-4">
              {filteredDiscoverable.length > 0 ? (
                filteredDiscoverable.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                        <div className="text-xs text-gray-500">
                          {student.department} • {student.year}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-pink-700 hover:bg-pink-600 text-white"
                        onClick={() => handleFollowToggle(student.id, true)}
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || department !== "All Departments"
                    ? "No students match your search criteria"
                    : "No more students to discover"}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
