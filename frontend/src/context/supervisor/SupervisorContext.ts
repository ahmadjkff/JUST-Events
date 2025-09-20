import { createContext, useContext } from "react";

interface SupervisorContextType {
  applications: any[];
  fetchApplications: () => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
  isLoading: boolean;
}

export const SupervisorContext = createContext<SupervisorContextType>({
  applications: [],
  fetchApplications: async () => Promise.resolve({ success: false }),
  isLoading: false,
});

export const useSupervisor = () => useContext(SupervisorContext);
