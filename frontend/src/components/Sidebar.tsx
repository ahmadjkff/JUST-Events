import { useState } from "react";
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
} from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Badge } from "./ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useTranslation } from "react-i18next"; // ✅ import

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ hook for translations

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  type NavigationItem = {
    icon: React.ElementType;
    label: string;
    href: string;
    allowedUsers?: string[];
    badge?: string;
  };

  const navigationItems: NavigationItem[] = [
    {
      icon: Home,
      label: t("home"),
      href: "/",
      allowedUsers: ["student", "supervisor"],
    },
    {
      icon: Gauge,
      label: t("dashboard"),
      href: "/admin/dashboard",
      allowedUsers: ["admin"],
    },
    {
      icon: Gauge,
      label: t("dashboard"),
      href: "/supervisor/dashboard",
      allowedUsers: ["supervisor"],
    },
    {
      icon: Calendar,
      label: t("events"),
      href: "/browse-events",
      allowedUsers: ["student", "supervisor", "admin"],
    },
    {
      icon: CalendarClock,
      label: t("myEvents"),
      href: "/student/my-events",
      allowedUsers: ["student", "supervisor"],
    },
    {
      icon: Bell,
      label: t("notifications"),
      href: "/notifications",
      allowedUsers: ["student", "supervisor", "admin"],
      badge: "5",
    },
    {
      icon: Award,
      label: t("myCertificates"),
      href: "/student/my-certificates",
      allowedUsers: ["student", "supervisor"],
    },
    {
      icon: User,
      label: t("profile"),
      href: "/profile",
      allowedUsers: ["student", "supervisor", "admin"],
    },
    {
      icon: ChartColumnBig,
      label: t("statistics"),
      href: "/admin/statistics",
      allowedUsers: ["admin"],
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
        <div className="border-sidebar-border border-b p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-sidebar-foreground text-lg font-semibold">
                {t("appName")}
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-0 space-y-1 p-2">
          {navigationItems.map((item) => {
            if (item.allowedUsers && !item.allowedUsers.includes(user?.role!)) {
              return null;
            }
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href);
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  isCollapsed ? "px-2" : "px-3",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Link to={item.href} className="flex w-full items-center">
                  <item.icon
                    className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-sidebar-border border-t p-2">
          <Button
            onClick={() => handleLogout()}
            variant="ghost"
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent w-full cursor-pointer justify-start text-left",
              isCollapsed ? "px-2" : "px-3",
            )}
          >
            <LogOut
              className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")}
            />
            {!isCollapsed && <span className="flex-1">{t("signOut")}</span>}
          </Button>
        </div>
      </div>
    </Card>
  );
}
