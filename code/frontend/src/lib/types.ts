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
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  participants: User[];
  color: string;
}
