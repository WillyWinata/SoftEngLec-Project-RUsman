export default interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  location: string;
  participants: { id: number; name: string; avatar: string }[];
  createdBy: { id: string; name: string };
  invitationStatus: string;
}
