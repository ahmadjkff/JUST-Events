import { createContext, useContext } from "react";

interface SupervisorContextType {
  events: any[];
  event: any;
  applications: any;
  fetchSupervisorApplications: () => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
  getEventById: (eventId: string) => Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  isLoading: boolean;
}

export const SupervisorContext = createContext<SupervisorContextType>({
  events: [],
  event: null,
  applications: null,
  fetchSupervisorApplications: async () => Promise.resolve({ success: false }),
  getEventById: async () => Promise.resolve({ success: false }),
  isLoading: false,
});

export const useSupervisor = () => useContext(SupervisorContext);
