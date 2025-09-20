import { useEffect } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";

const SupervisorApplications = () => {
  const { fetchApplications } = useSupervisor();
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Supervisor Applications</h1>
    </div>
  );
};
export default SupervisorApplications;
