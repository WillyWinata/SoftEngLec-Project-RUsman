export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  major: string;
  role: string;
  password: string;
  profilePicture: string;
  isActive: boolean;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  participants: User[];
  recurringUntil: string;
  color: string;
}

export interface ScheduleInvitation {
  schedule: Schedule;
  user: User;
  status: string;
}