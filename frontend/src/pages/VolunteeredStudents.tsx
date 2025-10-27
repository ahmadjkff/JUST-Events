import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function VolunteeredStudents() {
  const { eventId } = useParams();
  const [volunteeredStudents, setVolunteeredStudents] = useState<any>([]);
  const { fetchVolunteeredStudents } = useEvent();
  const { t } = useTranslation();

  useEffect(() => {
    const res = fetchVolunteeredStudents!(eventId as string);
    res.then((data) => {
      if (data.success) {
        setVolunteeredStudents(data.data);
      } else {
        setVolunteeredStudents([]);
      }
    });
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">
        {t("registeredStudents.title")}
      </h2>

      {volunteeredStudents.length === 0 ? (
        <p>{t("registeredStudents.empty")}</p>
      ) : (
        <ul>
          {volunteeredStudents.map((student: any) => (
            <li key={student._id}>
              {t("registeredStudents.studentLine", {
                firstName: student.student.firstName,
                lastName: student.student.lastName,
                email: student.student.email,
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VolunteeredStudents;
