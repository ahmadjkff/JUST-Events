import { Calendar, Clock, Search, X } from "lucide-react";
import { useTitle } from "../../../hooks/useTitle";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { useEvent } from "../../../context/event/EventContext";
import { useEffect, useState } from "react";
import { changeEventStatus } from "../services/APIRequests";
import { EventStatus } from "../../../types/eventTypes";
import toast from "react-hot-toast";
import Loading from "../../../components/ui/Loading";
import EventsTable from "../components/EventsTable";
import { useTranslation } from "react-i18next";
import { onEventStatusChanged, removeStatusChangeListener } from "../../../services/socketService";

function ControlEvents() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { eventsByStatus, fetchEvents } = useEvent();

  useTitle(`${t("controlEvents.title")} - JUST Events`);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (eventId: string, status: EventStatus) => {
    setLoading(true);
    const { success, message } = await changeEventStatus(eventId, status);
    if (!success) {
      toast.error(message || t("controlEvents.updateError"));
      setLoading(false);
      return console.error(message);
    }

    await Promise.all([
      fetchEvents("approved"),
      fetchEvents("pending"),
      fetchEvents("rejected"),
    ]);
    setLoading(false);
    toast.success(t("controlEvents.updatedTo", { status }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchEvents("approved"),
        fetchEvents("pending"),
        fetchEvents("rejected"),
      ]);
    };
    fetchAll();
  }, []);

  // Listen for real-time event status changes
  useEffect(() => {
    const handleStatusChange = (data: any) => {
      const { event, status } = data;
      Promise.all([
        fetchEvents("approved"),
        fetchEvents("pending"),
        fetchEvents("rejected"),
      ]);
      toast.success(`Event "${event.title}" status changed to ${status}`);
    };

    onEventStatusChanged(handleStatusChange);

    return () => removeStatusChangeListener(handleStatusChange);
  }, []);

  if (loading) return <Loading />;

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* ===== Header ===== */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-foreground text-2xl font-bold">
            {t("controlEvents.title")}
          </h1>
          <p className="text-muted-foreground">{t("controlEvents.subtitle")}</p>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* === Search and Filters === */}
          <div
            className={`mb-6 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="relative flex-1">
              <Search
                className={`text-muted-foreground absolute top-1/2 ${
                  isRTL ? "right-3" : "left-3"
                } h-4 w-4 -translate-y-1/2 transform`}
              />
              <Input
                placeholder={t("controlEvents.searchPlaceholder")}
                className={`${isRTL ? "pr-10" : "pl-10"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">{t("controlEvents.category")}</option>
              <option value="tech">{t("categories.Technology")}</option>
              <option value="health">{t("categories.Health")}</option>
              <option value="education">{t("categories.Education")}</option>
              <option value="community">{t("categories.Community")}</option>
              <option value="arts">{t("categories.Arts")}</option>
              <option value="other">{t("categories.Other")}</option>
            </select>

            <select
              value={department || ""}
              onChange={(e) => setDepartment(e.target.value || null)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">{t("controlEvents.department")}</option>
              <option value="it">{t("departments.it")}</option>
              <option value="engineering">
                {t("departments.engineering")}
              </option>
              <option value="medical">{t("departments.medical")}</option>
              <option value="science">{t("departments.science")}</option>
            </select>
          </div>

          {/* === Events Tabs === */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList
              className={`flex w-full max-w-md grid-cols-3 md:grid ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <TabsTrigger value="approved">
                {t("controlEvents.approved")} ({eventsByStatus.approved.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("controlEvents.pending")} ({eventsByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {t("controlEvents.rejected")} ({eventsByStatus.rejected.length})
              </TabsTrigger>
            </TabsList>

            {/* === Tables for each tab === */}
            <EventsTable
              value="approved"
              status="Approved"
              icon={Calendar}
              searchTerm={searchTerm}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
            <EventsTable
              value="pending"
              status="Pending"
              icon={Clock}
              searchTerm={searchTerm}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
            <EventsTable
              value="rejected"
              status="Rejected"
              icon={X}
              searchTerm={searchTerm}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default ControlEvents;
