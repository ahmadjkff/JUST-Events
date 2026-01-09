import { Calendar, Search } from "lucide-react";
import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { useEvent } from "../context/event/EventContext";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { useTranslation } from "react-i18next";

function BrowseEvents() {
  const { i18n, t } = useTranslation();
  const { eventsByStatus, fetchEvents } = useEvent();

  useTitle(`${t("browseEvents.title")} - JUST Events`);

  /* ---------------- Pagination & Filtering ---------------- */
  const EVENTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const approvedEvents = eventsByStatus.approved || [];

  // Filter events
  const filteredEvents = approvedEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDepartment =
      !selectedDepartment ||
      event.department.toLowerCase() === selectedDepartment.toLowerCase();

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + EVENTS_PER_PAGE,
  );
  /* --------------------------------------------------------- */

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    fetchEvents("approved");
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDepartment]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {t("browseEvents.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("browseEvents.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Search & Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={t("browseEvents.searchPlaceholder")}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">{t("browseEvents.category")}</option>
              <option value="tech">{t("categories.Technology")}</option>
              <option value="health">{t("categories.Health")}</option>
              <option value="education">{t("categories.Education")}</option>
              <option value="community">{t("categories.Community")}</option>
              <option value="arts">{t("categories.Arts")}</option>
              <option value="other">{t("categories.Other")}</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">{t("browseEvents.department")}</option>
              <option value="it">{t("departments.it")}</option>
              <option value="engineering">
                {t("departments.engineering")}
              </option>
              <option value="medical">{t("departments.medical")}</option>
              <option value="science">{t("departments.science")}</option>
            </select>
          </div>

          {/* Events List */}
          {approvedEvents.length > 0 ? (
            <>
              <div className="grid gap-4">
                {currentEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    {t("common.previous")}
                  </Button>

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

                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="py-12 text-center">
              <CardContent>
                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">
                  {t("browseEvents.noEvents", {
                    type: t("browseEvents.availableEvents").toLowerCase(),
                  })}
                </h3>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default BrowseEvents;
