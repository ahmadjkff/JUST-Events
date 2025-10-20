import { Calendar, ChartBarStacked, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTitle } from "../../../hooks/useTitle";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/Button";
import EventCard from "../../../components/EventCard";
import { Card, CardContent } from "../../../components/ui/Card";
import type { IEvent } from "../../../types/eventTypes";

function BrowseEvents() {
  const { i18n, t } = useTranslation();
  const [myEvents, setMyEvents] = useState<IEvent[]>([]);

  useTitle(`${t("browseEvents.title")} - JUST Events`);

  // ✅ هذا السطر هو ما يجعلها تعمل مثل Notifications
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/student/my-events`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await response.json();
        setMyEvents(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

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
          {/* Search and Filter Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder={t("browseEvents.searchPlaceholder")}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t("browseEvents.filter")}
            </Button>
            <Button variant="outline">
              <ChartBarStacked className="mr-2 h-4 w-4" />
              {t("browseEvents.category")}
            </Button>
          </div>

          {/* Events List */}
          <div defaultValue="available" className="space-y-6">
            <div className="space-y-4">
              {myEvents?.length > 0 ? (
                <div className="grid gap-4">
                  {myEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {t("browseEvents.noEvents", {
                        type: t("browseEvents.availableEvents").toLowerCase(),
                      })}
                    </h3>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BrowseEvents;
