import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Calendar, CalendarCheck, User, Users, UserStar } from "lucide-react";
import { useEvent } from "../../../context/event/EventContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNewEventListener } from "../../../hooks/useNewEventListener";

function Dashboard() {
  const navigate = useNavigate();
  const { eventsByStatus, fetchEvents } = useEvent();
  const [userCount, setUserCount] = useState<number>(0);
  const { i18n, t } = useTranslation();

  // Listen for new events and refresh pending/overview
  useNewEventListener(() => {
    fetchEvents();
    fetchEvents("pending");
  });

  // ✅ ضبط اتجاه الصفحة بناءً على اللغة
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    fetchEvents();
    fetchEvents("approved");
    fetchEvents("pending");
    fetchEvents("rejected");

    // Fetch users once
    const getUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch users");
        setUserCount(data.data.length);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch users";
        console.error("Error fetching users:", message);
        setUserCount(0);
      }
    };

    getUsers();
  }, []);

  const SYSTEM_SUMMARY = [
    {
      title: t("adminDashboard.usersTitle"),
      subtitle: userCount,
      icon: Users,
      description: t("adminDashboard.usersDescription"),
      color: "blue",
    },
    {
      title: t("adminDashboard.activeEventsTitle"),
      subtitle: eventsByStatus.approved.length,
      icon: CalendarCheck,
      description: t("adminDashboard.activeEventsDescription"),
      color: "green",
    },
    {
      title: t("adminDashboard.supervisorsTitle"),
      subtitle: "25",
      icon: User,
      description: t("adminDashboard.supervisorsDescription"),
      color: "orange",
    },
    {
      title: t("adminDashboard.volunteersTitle"),
      subtitle: "300",
      icon: UserStar,
      description: t("adminDashboard.volunteersDescription"),
      color: "purple",
    },
    {
      title: t("adminDashboard.pendingRequestsTitle"),
      subtitle: eventsByStatus.pending.length,
      icon: Calendar,
      description: t("adminDashboard.pendingRequestsDescription"),
      color: "red",
    },
  ];

  const DASHBOARD_ITEMS = [
    {
      title: t("adminDashboard.controlEventsTitle"),
      icon: CalendarCheck,
      description: t("adminDashboard.controlEventsDescription"),
      link: "/admin/control-events",
      color: "green",
    },
    {
      title: t("adminDashboard.manageRolesTitle"),
      icon: User,
      description: t("adminDashboard.manageRolesDescription"),
      link: "/admin/manage-roles",
      color: "blue",
    },
    {
      title: t("adminDashboard.volunteerManagementTitle"),
      icon: UserStar,
      description: t("adminDashboard.volunteerManagementDescription"),
      link: "/admin/volunteer-control",
      color: "orange",
    },
    {
      title: t("adminDashboard.statisticsTitle"),
      icon: Calendar,
      description: t("adminDashboard.statisticsDescription"),
      link: "/admin/statistics",
      color: "purple",
    },
  ];

  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`p-8 transition-all ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-4xl font-extrabold">{t("adminDashboard.title")}</h1>
        <p className="text-muted-foreground">{t("adminDashboard.subtitle")}</p>
      </header>

      <div className="space-y-6">
        {/* System Management */}
        <h2 className="text-center text-2xl font-bold">
          {t("adminDashboard.systemManagement")}
        </h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          {DASHBOARD_ITEMS.map((item) => (
            <Card
              onClick={() => navigate(item.link)}
              key={item.title}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse space-x-reverse" : "space-x-2"
                  }`}
                >
                  <item.icon className={`h-8 w-8 text-${item.color}-500`} />
                  <div>
                    <p className="text-xl font-bold">{item.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Summary */}
        <h2 className="text-center text-2xl font-bold">
          {t("adminDashboard.systemSummary")}
        </h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          {SYSTEM_SUMMARY.map((item) => (
            <Card
              key={item.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse space-x-reverse" : "space-x-2"
                  }`}
                >
                  <item.icon className={`h-8 w-8 text-${item.color}-500`} />
                  <div>
                    <p className="text-2xl font-bold">{item.subtitle}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.title}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
