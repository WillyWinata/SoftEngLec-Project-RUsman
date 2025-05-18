export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  avatar: string;
  mutualFollow?: boolean;
}

export interface Schedule {
  id: string;
  title: string;
  course: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}
