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
  UserStar,
} from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useNotification } from "../context/notification/NotificationContext";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  icon: any;
  label: string;
  href: string;
  allowed: string[];
  badge?: number;
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

  const { unreadCount } = useNotification();

  const navigationItems: NavItem[] = [
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
      icon: ChartColumnBig,
      label: t("sidebar.statistics"),
      href: "/admin/statistics",
      allowed: ["admin"],
    },
    {
      icon: CalendarCheck,
      label: t("adminDashboard.controlEventsTitle"),
      href: "/admin/control-events",
      allowed: ["admin"],
    },
    {
      icon: User,
      label: t("adminDashboard.manageRolesTitle"),
      href: "/admin/manage-roles",
      allowed: ["admin"],
    },
    {
      icon: UserStar,
      label: t("adminDashboard.volunteerManagementTitle"),
      href: "/admin/volunteer-control",
      allowed: ["admin"],
    },
    {
      icon: CalendarClock,
      label: t("sidebar.myEvents"),
      href: "/student/my-events",
      allowed: ["student", "supervisor"],
    },
     {
      icon: CalendarCheck,
      label: t("sidebar.myCompletedEvents"),
      href: "/student/my-completed-events",
      allowed: ["student", "supervisor"],
    },
    {
      icon: Bell,
      label: t("sidebar.notifications"),
      href: "/notifications",
      allowed: ["student", "supervisor", "admin"],
      badge: unreadCount,
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
                    "relative flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  {/* Icon */}
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isRTL ? "order-2" : "order-1",
                    )}
                  />

                  {/* Badge */}
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-bold text-white",
                        isRTL ? "left-3" : "right-3",
                        isCollapsed ? "top-2" : "top-1/2 -translate-y-1/2",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Label */}
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "flex-1 truncate",
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

        {/* Footer */}
        <div className="border-sidebar-border border-t p-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-3",
              isRTL ? "flex-row-reverse" : "",
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && (
              <span>
                {isAuthenticated ? t("sidebar.signOut") : t("sidebar.signIn")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
