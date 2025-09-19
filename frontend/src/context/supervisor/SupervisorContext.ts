import { createContext, useContext } from "react";
import type { EventCategory, EventDepartment } from "../../types/eventTypes";

interface SupervisorContextType {
  event: any; // To-Do Replace 'any' with your actual event type
  isLoading: boolean;
  createEvent: (
    title: string,
    description: string,
    location: string,
    department: EventDepartment,
    category: EventCategory,
    date: Date
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
  deleteEvent: (eventId: string) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
}

export const SupervisorContext = createContext<SupervisorContextType>({
  event: null,
  isLoading: false,
  createEvent: async () => ({ success: false }),
  deleteEvent: async () => ({ success: false }),
});

export const useSupervisor = () => useContext(SupervisorContext);
