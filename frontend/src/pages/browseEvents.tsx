import { Calendar, ChartBarStacked, Clock, Filter, Search } from "lucide-react";
import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useEvent } from "../context/event/EventContext";
import { useEffect } from "react";
import EventCard from "../components/EventCard";
import { useTranslation } from "react-i18next";

function BrowseEvents() {
  const { i18n, t } = useTranslation();
  const { eventsByStatus, fetchEvents } = useEvent();
  const isRTL = i18n.language === "ar";

  useTitle(`${t("browseEvents.title")} - JUST Events`);

  // ✅ هذا السطر هو ما يجعلها تعمل مثل Notifications
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    fetchEvents("approved");
  }, []);

  const TABS = [
    { value: "available", label: t("browseEvents.availableEvents"), icon: Calendar },
    { value: "featured", label: t("browseEvents.featuredEvents"), icon: Clock },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {t("browseEvents.title")}
            </h1>
            <p className="text-muted-foreground">{t("browseEvents.subtitle")}</p>
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

          {/* Tabs */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              {TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value}>
                  {label} ({eventsByStatus.approved.length})
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsContent key={value} value={value} className="space-y-4">
                {eventsByStatus.approved.length > 0 ? (
                  <div className="grid gap-4">
                    {eventsByStatus.approved.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card className="py-12 text-center">
                    <CardContent>
                      <Icon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <h3 className="mb-2 text-lg font-semibold">
                        {t("browseEvents.noEvents", {
                          type: label.toLowerCase(),
                        })}
                      </h3>
                      <p className="text-muted-foreground">
                        {value === "available"
                          ? t("browseEvents.noAvailableText")
                          : t("browseEvents.noFeaturedText")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default BrowseEvents;
