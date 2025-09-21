import { createContext, useContext } from "react";

interface SupervisorContextType {
  applications: any[];
  fetchApplications: () => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
  applicationsByStatus: {approved: any[]; rejected: any[]; pending: any[]};
  isLoading: boolean;
}

export const SupervisorContext = createContext<SupervisorContextType>({
  applications: [],
  fetchApplications: async () => Promise.resolve({ success: false }),
  applicationsByStatus: {approved: [], rejected: [], pending: []},
  isLoading: false,
});

export const useSupervisor = () => useContext(SupervisorContext);
