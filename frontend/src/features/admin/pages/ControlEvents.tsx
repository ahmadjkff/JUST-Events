import { Calendar, Clock, Search, X } from "lucide-react";
import { useTitle } from "../../../hooks/useTitle";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { useEvent } from "../../../context/event/EventContext";
import { useEffect, useState } from "react";
import { changeEventStatus } from "../services/APIRequests";
import Menu from "../../../components/ui/Menu";
import { EventStatus } from "../../../types/eventTypes";
import toast from "react-hot-toast";
import Loading from "../../../components/ui/Loading";
import EventsTable from "../components/EventsTable";
import { useTranslation } from "react-i18next";

function ControlEvents() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { eventsByStatus, fetchEvents } = useEvent();

  useTitle(`${t("controlEvents.title")} - JUST Events`);

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

  if (loading) return <Loading />;

  return (
    <div className={`flex flex-1 flex-col overflow-hidden ${isRTL ? "text-right" : "text-left"}`}>
      {/* ===== Header ===== */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-foreground text-2xl font-bold">
            {t("controlEvents.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("controlEvents.subtitle")}
          </p>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* === Search and Filters === */}
          <div className={`mb-6 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="relative flex-1">
              <Search
                className={`text-muted-foreground absolute top-1/2 ${
                  isRTL ? "right-3" : "left-3"
                } h-4 w-4 -translate-y-1/2 transform`}
              />
              <Input
                placeholder={t("controlEvents.searchPlaceholder")}
                className={`${isRTL ? "pr-10" : "pl-10"}`}
              />
            </div>

            <Menu
              title={t("controlEvents.category")}
              items={[
                t("categories.Technology"),
                t("categories.Health"),
                t("categories.Education"),
                t("categories.Culture"),
                t("categories.Sports"),
                t("categories.Other"),
              ]}
              selected={category || t("controlEvents.category")}
              setSelected={setCategory}
            />

            <Menu
              title={t("controlEvents.department")}
              items={[
                t("departments.it"),
                t("departments.engineering"),
                t("departments.medical"),
                t("departments.science"),
              ]}
              selected={department || t("controlEvents.department")}
              setSelected={setDepartment}
            />
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
