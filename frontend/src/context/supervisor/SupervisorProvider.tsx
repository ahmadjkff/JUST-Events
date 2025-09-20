import { useState, type FC, type PropsWithChildren } from "react";
import { SupervisorContext } from "./SupervisorContext";

const SuperviorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/supervisor/appliactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }
      console.log("fetched applications:", data.data.data);
      setApplications(data.data.data);

      return { success: true, data: data.data, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      console.error("Error deleting event:", error);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };
  console.log("applications state:", applications);
  return (
    <SupervisorContext.Provider
      value={{ isLoading, applications, fetchApplications }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export default SuperviorProvider;
