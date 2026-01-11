import { useParams } from "react-router-dom";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";

const PAGE_SIZE = 20; // Show 20 students per page

function VolunteeredStudents() {
  const { eventId } = useParams();
  const [volunteeredStudents, setVolunteeredStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchVolunteeredStudents } = useEvent();
  const { t } = useTranslation();

  useEffect(() => {
    const res = fetchVolunteeredStudents!(eventId as string);
    res.then((data) => {
      if (data.success) {
        setVolunteeredStudents(data.data || []);
      } else {
        setVolunteeredStudents([]);
      }
    });
  }, [eventId]);

  // Pagination logic
  const totalPages = Math.ceil(volunteeredStudents.length / PAGE_SIZE);
  const paginatedStudents = volunteeredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h2 className="mb-4 text-xl font-medium text-neutral-900 dark:text-neutral-100">
        {t("registeredStudents.title")}
      </h2>

      {volunteeredStudents.length === 0 ? (
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
                {paginatedStudents.map((item: any) => (
                  <tr
                    key={item._id}
                    className="rounded-lg bg-white transition hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  >
                    <td className="rounded-l-lg px-4 py-3 text-neutral-900 dark:text-neutral-100">
                      {item.student.firstName}
                    </td>
                    <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                      {item.student.lastName}
                    </td>
                    <td className="rounded-r-lg px-4 py-3 text-neutral-500 dark:text-neutral-400">
                      {item.student.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
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

export default VolunteeredStudents;
