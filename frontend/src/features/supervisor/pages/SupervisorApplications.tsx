import { useEffect } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";

const SupervisorApplications = () => {
  const { fetchApplications } = useSupervisor();
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Supervisor Applications</h1>
    </div>
  );
};
export default SupervisorApplications;
