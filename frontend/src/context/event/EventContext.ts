import { createContext, useContext } from "react";

interface EventContextType {
  events: any[]; // To-Do Replace 'any' with your actual event type
  isLoading: boolean;
  fetchEvents: (status?: string) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  isLoading: false,
  fetchEvents: async () => Promise.resolve({ success: false }),
});

export const useEvent = () => useContext(EventContext);
