import { createContext, useContext } from "react";
import type { IEvent } from "../../types/eventTypes";

interface EventContextType {
  events: IEvent[];
  eventsByStatus: {
    approved: IEvent[];
    pending: IEvent[];
    rejected: IEvent[];
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
