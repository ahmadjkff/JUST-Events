import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; 

function RegistredStudents() {
  const { eventId } = useParams();
  const [registeredStudents, setRegisteredStudents] = useState<any>([]);
  const { fetchRegistredStudents } = useEvent();
  const { t } = useTranslation(); 

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
      <h2 className="text-xl font-bold mb-4">{t("registeredStudents.title")}</h2>

      {registeredStudents.length === 0 ? (
        <p>{t("registeredStudents.empty")}</p>
      ) : (
        <ul>
          {registeredStudents.map((student: any) => (
            <li key={student._id}>
              {t("registeredStudents.studentLine", {
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RegistredStudents;
