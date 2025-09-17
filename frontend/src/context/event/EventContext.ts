import { createContext, useContext } from "react";

interface EventContextType {
  events: any[]; // To-Do Replace 'any' with your actual event type
  eventsByStatus: {
    approved: any[];
    pending: any[];
    rejected: any[];
  };
  isLoading: boolean;
  fetchEvents: (status?: string) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  eventsByStatus: { approved: [], pending: [], rejected: [] },
  isLoading: false,
  fetchEvents: async () => Promise.resolve({ success: false }),
});

export const useEvent = () => useContext(EventContext);
