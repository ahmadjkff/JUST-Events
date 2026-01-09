import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  CalendarClock,
  Gauge,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Award,
  ChartColumnBig,
  CalendarCheck,
} from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const navigationItems = [
    {
      icon: Home,
      label: t("sidebar.home"),
      href: "/",
      allowed: ["student", "supervisor"],
    },
    {
      icon: Gauge,
      label: t("sidebar.dashboard"),
      href: "/admin/dashboard",
      allowed: ["admin"],
    },
    {
      icon: Gauge,
      label: t("sidebar.dashboard"),
      href: "/supervisor/dashboard",
      allowed: ["supervisor"],
    },
    {
      icon: User,
      label: t("sidebar.Control Applications"),
      href: "/supervisor/control-applications",
      allowed: ["supervisor"],
    },
     {
      icon: CalendarCheck,
      label: t("sidebar.Create Event"),
      href: "/supervisor/create-event",
      allowed: ["supervisor"],
    },
    {
      icon: Calendar,
      label: t("sidebar.events"),
      href: "/browse-events",
      allowed: ["all"],
    },
    {
      icon: CalendarClock,
      label: t("sidebar.myEvents"),
      href: "/student/my-events",
      allowed: ["student", "supervisor"],
    },
    {
      icon: Bell,
      label: t("sidebar.notifications"),
      href: "/notifications",
      allowed: ["student", "supervisor", "admin"],
    },
    {
      icon: Award,
      label: t("sidebar.myCertificates"),
      href: "/student/my-certificates",
      allowed: ["student", "supervisor"],
    },
    {
      icon: User,
      label: t("sidebar.profile"),
      href: "/profile",
      allowed: ["student", "supervisor", "admin"],
    },
    {
      icon: ChartColumnBig,
      label: t("sidebar.statistics"),
      href: "/admin/statistics",
      allowed: ["admin"],
    },
  ];

  return (
    <Card
      className={cn(
        "bg-sidebar sticky top-0 h-screen border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-sidebar-border flex items-center justify-between border-b p-4">
          {!isCollapsed && (
            <h2 className="text-sidebar-foreground truncate text-lg font-semibold">
              {t("app.name")}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              isRTL ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : isRTL ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigationItems.map((item) => {
            if (
              !item.allowed.includes(user?.role!) &&
              !item.allowed.includes("all")
            )
              return null;
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href);
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  {/* Icon */}
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                      isRTL ? "order-2" : "order-1",
                    )}
                  />

                  {/* Label */}
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "flex-1 truncate transition-all",
                        isRTL ? "order-1 text-right" : "order-2 text-left",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer (Logout) */}
        <div className="border-sidebar-border border-t p-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center justify-start gap-3",
              isRTL ? "flex-row-reverse" : "",
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className={cn(isRTL ? "text-right" : "text-left")}>
                {isAuthenticated ? t("sidebar.signOut") : t("sidebar.signIn")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
