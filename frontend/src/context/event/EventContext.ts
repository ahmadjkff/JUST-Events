import { createContext, useContext } from "react";
import type { IEvent, IVolunteer } from "../../types/eventTypes";

interface EventContextType {
  events: IEvent[];
  eventsByStatus: {
    approved: IEvent[];
    pending: IEvent[];
    rejected: IEvent[];
  };
  volunteersByStatus: {
    approved: IVolunteer[];
    pending: IVolunteer[];
    rejected: IVolunteer[];
  };
  isLoading: boolean;
  fetchEvents: (status?: string) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
  fetchVolunteers?: () => Promise<{
    success: boolean;
    message?: string;
    data?: IVolunteer[];
  }>;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  eventsByStatus: { approved: [], pending: [], rejected: [] },
  volunteersByStatus: { approved: [], pending: [], rejected: [] },
  isLoading: false,
  fetchEvents: async () => Promise.resolve({ success: false }),
  fetchVolunteers: async () => Promise.resolve({ success: false }),
});

export const useEvent = () => useContext(EventContext);
