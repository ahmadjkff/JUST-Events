import type { User } from "./userTypes";

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  createdBy: string; // User ID
  status: EventStatus;
  volunteers: User[]; // Array of User IDs
  registeredStudents: string[]; // Array of User IDs
  feedback: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  category: EventCategory;
  department: EventDepartment;
}

export enum EventStatus {
  Approved = "approved",
  Pending = "pending",
  Rejected = "rejected",
  Completed = "completed",
}

export enum EventCategory {
  Tech = "tech",
  Health = "health",
  Education = "education",
  Community = "community",
  Arts = "arts",
  Other = "other",
}

export enum EventDepartment {
  IT = "it",
  Engineering = "engineering",
  Medical = "medical",
  Science = "science",
}

export interface IVolunteer {
  student: string; // User ID
  status: VolunteerStatus;
}

export interface IVolunteerApplication {
  _id: string;
  student: User; // Populated User object
  event: IEvent; // Populated Event object
  status: VolunteerStatus;
  isVolunteer: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export enum VolunteerStatus {
  Approved = "approved",
  Pending = "pending",
  Rejected = "rejected",
}

export interface IFeedback {
  student: User;
  rating: number;
  comment: string;
}
