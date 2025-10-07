import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";

function RegistredStudents() {
  const { eventId } = useParams();
  const [registeredStudents, setRegisteredStudents] = useState<any>([]);
  const { fetchRegistredStudents } = useEvent();

  useEffect(() => {
    const res = fetchRegistredStudents!(eventId as string);
    res.then((data) => {
      if (data.success) {
        setRegisteredStudents(data.data);
      } else {
        setRegisteredStudents([]);
      }
    });
  }, []);

  return (
    <div>
      {registeredStudents.length === 0 ? (
        <p>No students have registered for this event.</p>
      ) : (
        <ul>
          {registeredStudents.map((student: any) => (
            <li key={student._id}>
              {student.firstName} {student.lastName} - {student.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RegistredStudents;
