import { createContext, useContext } from "react";

interface SupervisorContextType {
  event: any; // To-Do Replace 'any' with your actual event type
  isLoading: boolean;
  createEvent: (
    title: string,
    description: string,
    location: string,
    date: Date
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }>;
}

export const SupervisorContext = createContext<SupervisorContextType>({
  event: null,
  isLoading: false,
  createEvent: async () => ({ success: false }),
});

export const useSupervisor = () => useContext(SupervisorContext);
