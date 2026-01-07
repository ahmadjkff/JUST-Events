import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";

const ITEMS_PER_PAGE = 20;

function RegistredStudents() {
  const { eventId } = useParams();
  const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
  }, [eventId]);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(
    registeredStudents.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedStudents = registeredStudents.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h2 className="mb-4 text-xl font-medium text-neutral-900 dark:text-neutral-100">
        {t("registeredStudents.title")}
      </h2>

      {registeredStudents.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("registeredStudents.empty")}
        </p>
      ) : (
        <>
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
                {paginatedStudents.map((student: any) => (
                  <tr
                    key={student._id}
                    className="
                      bg-white dark:bg-neutral-900
                      hover:bg-neutral-50 dark:hover:bg-neutral-800
                      transition
                      rounded-lg
                    "
                  >
                    <td className="rounded-l-lg px-4 py-3 text-neutral-900 dark:text-neutral-100">
                      {student.firstName}
                    </td>
                    <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                      {student.lastName}
                    </td>
                    <td className="rounded-r-lg px-4 py-3 text-neutral-500 dark:text-neutral-400">
                      {student.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination buttons */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    variant={
                      currentPage === page ? "default" : "outline"
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RegistredStudents;
