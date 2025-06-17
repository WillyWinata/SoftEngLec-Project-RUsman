"use client";

import { useEffect, useState } from "react";
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
import type { User, UserFollowDetails } from "@/lib/types";

interface FollowingViewProps {
  following: User[];
  setActiveTab: (tab: string) => void;
}

export default function FollowingView({
  following,
  setActiveTab,
}: FollowingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [discoverableStudents, setDiscoverableStudents] = useState<User[]>([]);
  const [mutualStudents, setMutualStudents] = useState<User[]>([]);
  const [pendingStudents, setPendingStudents] = useState<User[]>([]);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const [major, setMajor] = useState("All Majors");
  const [majors, setMajors] = useState<string[]>([]);

  const getAllUserRelations = async (us: User[]) => {
    const response = await fetch(
      "http://localhost:8888/get-user-follow/" + userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result: UserFollowDetails = await response.json();

    const following: User[] = result.following;
    const follower: User[] = result.follower;
    const followingPending: User[] = result.followingPending;

    const followerIds = new Set(follower.map((u) => u.id));
    const pendingIds = new Set(followingPending.map((u) => u.id));

    const mutual = following.filter((u) => followerIds.has(u.id));
    setMutualStudents(mutual);

    setPendingStudents(followingPending);

    const mutualIds = new Set(mutual.map((u) => u.id));
    const discoverable = us.filter(
      (u) => !mutualIds.has(u.id) && !pendingIds.has(u.id)
    );
    setDiscoverableStudents(discoverable);
  };

  const getAllAvailableUsers = async () => {
    const response = await fetch("http://localhost:8888/get-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    setUsers(result);

    const uniqueMajors = new Set<string>(
      result.map((user: User) => user.major)
    );

    setMajors(["All Majors", ...Array.from(uniqueMajors)]);
    getAllUserRelations(result);
  };

  useEffect(() => {
    getAllAvailableUsers();
  }, []);

  // Handle follow/unfollow action
  const handleFollowToggle = async (studentId: string) => {
    await fetch("http://localhost:8888/request-follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        requesteeId: studentId,
      }),
    });
  };

  // Filter students based on search query and department
  const filterStudents = (students: User[]) => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        major === "All Majors" || student.major === major;
      return matchesSearch && matchesDepartment;
    });
  };

  const filteredMutual = filterStudents(mutualStudents);
  const filteredDiscoverable = filterStudents(discoverableStudents);
  const filteredPending = filterStudents(pendingStudents);

  return (
    <Card className="border-gray-800 bg-gray-950 text-gray-100 shadow-xl overflow-clip">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-pink-400 text-2xl font-bold tracking-wide">
          Student Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="following" className="w-full">
          <TabsList className="mb-6 bg-gray-900 space-x-1">
            <TabsTrigger
              value="mutual"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Mutual ({mutualStudents.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-pink-900 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Pending ({pendingStudents.length})
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
            <Select value={major} onValueChange={setMajor}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {majors.map((dept) => (
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

          <TabsContent value="mutual" className="mt-0">
            <div className="space-y-4">
              {filteredMutual.length > 0 ? (
                filteredMutual.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                        <div className="text-xs text-gray-500">
                          {student.major}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-gray-700 hover:bg-gray-600 text-white"
                        onClick={() => {
                          setActiveTab("calendar");
                        }}
                      >
                        View Schedule
                      </Button>
                      {/* <Button
                        size="sm"
                        className={
                          student.mutualFollow
                            ? "bg-pink-800 hover:bg-pink-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }
                        onClick={() => handleFollowToggle(student.id)}
                      >
                        {student.mutualFollow ? "Following" : "Follow Back"}
                      </Button> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || major !== "All Majors"
                    ? "No students match your search criteria"
                    : "You're not following any students yet"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <div className="space-y-4">
              {filteredPending.length > 0 ? (
                filteredPending.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                        <div className="text-xs text-gray-500">
                          {student.major}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-gray-700 hover:bg-gray-600 text-white"
                        onClick={() => {
                          setActiveTab("calendar");
                        }}
                      >
                        View Schedule
                      </Button>
                      {/* <Button
                        size="sm"
                        className={
                          student.mutualFollow
                            ? "bg-pink-800 hover:bg-pink-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }
                        onClick={() => handleFollowToggle(student.id)}
                      >
                        {student.mutualFollow ? "Following" : "Follow Back"}
                      </Button> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || major !== "All Majors"
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
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-10 h-10 rounded-full bg-gray-700"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                        <div className="text-xs text-gray-500">
                          {student.major} • {student.studentId}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-pink-700 hover:bg-pink-600 text-white"
                        onClick={() => handleFollowToggle(student.id)}
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || major !== "All Departments"
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
