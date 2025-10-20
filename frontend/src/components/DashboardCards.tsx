"use client";

import { Calendar, Users, BellRing, Award } from "lucide-react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";

const ICONS = { Calendar, Users, BellRing, Award } as const;

type IconName = keyof typeof ICONS;

const DASHBOARD_CARDS = [
  {
    id: 1,
    titleKey: "dashboardCards.upcomingEvents",
    count: 12,
    icon: "Calendar" as IconName,
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    hoverGradient: "hover:from-blue-500/20 hover:to-blue-600/10",
    iconBg: "bg-blue-500/10",
    link: "/browse-events",
  },
  {
    id: 2,
    titleKey: "dashboardCards.registeredEvents",
    count: 8,
    icon: "Users" as IconName,
    color: "text-green-600",
    bgGradient: "from-green-500/10 to-green-600/5",
    hoverGradient: "hover:from-green-500/20 hover:to-green-600/10",
    iconBg: "bg-green-500/10",
    link: "/student/my-events",
  },
  {
    id: 3,
    titleKey: "dashboardCards.myCertificates",
    count: 3,
    icon: "Award" as IconName,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500/10 to-indigo-600/5",
    hoverGradient: "hover:from-indigo-500/20 hover:to-indigo-600/10",
    iconBg: "bg-indigo-500/10",
    link: "/student/my-certificates",
  },
  {
    id: 4,
    titleKey: "dashboardCards.notifications",
    count: 5,
    icon: "BellRing" as IconName,
    color: "text-orange-600",
    bgGradient: "from-orange-500/10 to-orange-600/5",
    hoverGradient: "hover:from-orange-500/20 hover:to-orange-600/10",
    iconBg: "bg-orange-500/10",
    link: "/notifications",
  },
];

export default function DashboardCards() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="space-y-6">
      {/* ===== Quick Stats ===== */}
      <div
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${isRTL ? "text-right" : ""}`}
      >
        {DASHBOARD_CARDS.map(
          ({
            id,
            titleKey,
            count,
            icon,
            color,
            bgGradient,
            hoverGradient,
            iconBg,
            link,
          }) => {
            const Icon = ICONS[icon];
            return (
              <Link to={link} key={id} className="group">
                <Card
                  className={`relative overflow-hidden border-0 bg-gradient-to-br ${bgGradient} backdrop-blur-sm transition-all duration-300 ${hoverGradient} hover:scale-[1.02] hover:shadow-lg`}
                >
                  <CardContent className="p-6">
                    <div
                      className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`h-7 w-7 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-3xl font-bold tracking-tight ${color}`}
                        >
                          {count}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                          {t(titleKey)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${bgGradient} opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-70`}
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          },
        )}
      </div>

      {/* ===== Profile Summary ===== */}
      <Card
        className={`relative overflow-hidden border-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 backdrop-blur-sm ${isRTL ? "text-right" : ""}`}
      >
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {t("dashboardCards.myProfile")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("dashboardCards.profileDescription")}
          </p>
          <Link to="/profile">
            <Button className="mt-6 w-full bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-500/30">
              {t("dashboardCards.viewProfile")}
            </Button>
          </Link>
        </CardContent>
        <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />
      </Card>
    </div>
  );
}
