import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  Settings,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Badge } from "./ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      allowedUsers: ["student", "supervisor"],
    },
    {
      icon: Calendar,
      label: "Events",
      href: "/browse-events",
      badge: "3",
    },
    { icon: Users, label: "Community", href: "/student/community" },
    { icon: BookOpen, label: "Courses", href: "/student/courses" },
    { icon: Trophy, label: "Achievements", href: "/student/achievements" },
    {
      icon: Bell,
      label: "Notifications",
      href: "/student/notifications",
      badge: "5",
    },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
  ];

  return (
    <Card
      className={cn(
        "h-screen sticky top-0 transition-all duration-300 border-r bg-sidebar",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                JUST Events
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
        <nav className="flex-1 p-2 space-y-1">
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
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Link to={item.href} className="flex items-center w-full">
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
        <div className="p-2 border-t border-sidebar-border">
          <Button
            onClick={() => handleLogout()}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer",
              isCollapsed ? "px-2" : "px-3"
            )}
          >
            <LogOut
              className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")}
            />
            {!isCollapsed && <span className="flex-1">Sign Out</span>}
          </Button>
        </div>
      </div>
    </Card>
  );
}
