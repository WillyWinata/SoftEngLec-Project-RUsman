"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { registerUser } from "@/app/actions/user-actions"

const academicMajors = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Psychology",
  "Biology",
  "Mathematics",
  "English Literature",
  "History",
  "Physics",
  "Chemistry",
  "Economics",
  "Political Science",
  "Art & Design",
  "Music",
  "Philosophy",
]

export function UserRegistration() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await registerUser(formData)
      if (result.success) {
        setMessage({ type: "success", text: "User registered successfully!" })
        // Reset form
        const form = document.getElementById("registration-form") as HTMLFormElement
        form?.reset()
        setSelectedFile(null)
      } else {
        setMessage({ type: "error", text: result.error || "Registration failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-pink-950/20 border-pink-500/30">
      <CardContent className="p-6">
        <form id="registration-form" action={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-pink-100">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="bg-black/50 border-pink-500/50 text-white placeholder:text-pink-300/50 focus:border-pink-400"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-pink-100">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-black/50 border-pink-500/50 text-white placeholder:text-pink-300/50 focus:border-pink-400"
              placeholder="Enter email address"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-pink-100">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="bg-black/50 border-pink-500/50 text-white placeholder:text-pink-300/50 focus:border-pink-400 pr-10"
                placeholder="Enter password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-pink-300 hover:text-pink-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-pink-100">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="bg-black/50 border-pink-500/50 text-white placeholder:text-pink-300/50 focus:border-pink-400 pr-10"
                placeholder="Confirm password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-pink-300 hover:text-pink-100"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Academic Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-pink-100">
              Academic Major
            </Label>
            <Select name="major" required>
              <SelectTrigger className="bg-black/50 border-pink-500/50 text-white focus:border-pink-400">
                <SelectValue placeholder="Select academic major" />
              </SelectTrigger>
              <SelectContent className="bg-black border-pink-500/50">
                {academicMajors.map((major) => (
                  <SelectItem key={major} value={major} className="text-white hover:bg-pink-900/50">
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student ID */}
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-pink-100">
              Student ID Number
            </Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              required
              className="bg-black/50 border-pink-500/50 text-white placeholder:text-pink-300/50 focus:border-pink-400"
              placeholder="Enter student ID"
            />
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <Label htmlFor="profilePicture" className="text-pink-100">
              Profile Picture
            </Label>
            <div className="relative">
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-black/50 border-pink-500/50 text-white file:bg-pink-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-pink-700"
              />
              {selectedFile && <p className="text-sm text-pink-300 mt-1">Selected: {selectedFile.name}</p>}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-900/50 text-green-200 border border-green-500/50"
                  : "bg-red-900/50 text-red-200 border border-red-500/50"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            {isSubmitting ? "Registering..." : "Register User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
