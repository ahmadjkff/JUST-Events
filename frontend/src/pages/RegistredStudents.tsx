import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function RegistredStudents() {
  const { eventId } = useParams();
  const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);
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
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-4">
        {t("registeredStudents.title")}
      </h2>

      {registeredStudents.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("registeredStudents.empty")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-neutral-600 dark:text-neutral-400">
                  First name
                </th>
                <th className="px-4 py-2 text-left font-medium text-neutral-600 dark:text-neutral-400">
                  Last name
                </th>
                <th className="px-4 py-2 text-left font-medium text-neutral-600 dark:text-neutral-400">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              {registeredStudents.map((student: any) => (
                <tr
                  key={student._id}
                  className="
                    bg-white dark:bg-neutral-900
                    hover:bg-neutral-50 dark:hover:bg-neutral-800
                    transition
                    rounded-lg
                  "
                >
                  <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100 rounded-l-lg">
                    {student.firstName}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                    {student.lastName}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 rounded-r-lg">
                    {student.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RegistredStudents;
