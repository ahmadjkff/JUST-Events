import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Calendar, CalendarCheck, User, Users, UserStar } from "lucide-react";
import { useEvent } from "../../../context/event/EventContext";

import { useEffect, useState } from "react";

const DASHBOARD_ITEMS = [
  {
    title: "Control Events",
    icon: CalendarCheck,
    description:
      "Manage and oversee all events happening within the university.",
    link: "/admin/control-events",
    color: "green",
  },
  {
    title: "Manage User Roles",
    icon: User,
    description: "Assign and modify roles for users in the system.",
    link: "/admin/manage-roles",
    color: "blue",
  },
  {
    title: "Volunteers Management",
    icon: UserStar,
    description: "Oversee volunteer activities and assignments.",
    link: "/admin/volunteer-control",
    color: "orange",
  },
  {
    title: "Statistics",
    icon: Calendar,
    description: "View detailed statistics and reports.",
    link: "/admin/statistics",
    color: "purple",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { eventsByStatus, fetchEvents } = useEvent();
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    fetchEvents();
    fetchEvents("approved");
    fetchEvents("pending");
    fetchEvents("rejected");

    // fetch users once
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
      title: "Number Of Users",
      subtitle: userCount,
      icon: Users,
      description:
        "Total registered users including students, supervisors, and admins.",
      color: "blue",
    },
    {
      title: "Active Events",
      subtitle: eventsByStatus.approved.length,
      icon: CalendarCheck,
      description: "Events currently active or upcoming in the university.",
      color: "green",
    },
    {
      title: "Supervisors",
      subtitle: "25",
      icon: User,
      description: "Total number of supervisors managing various events.",
      color: "orange",
    },
    {
      title: "Volunteers",
      subtitle: "300",
      icon: UserStar,
      description: "Students actively volunteering in different events.",
      color: "purple",
    },
    {
      title: "Pending Requests",
      subtitle: eventsByStatus.pending.length,
      icon: Calendar,
      description: "Requests awaiting approval from the admin.",
      color: "red",
    },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage university events and user roles efficiently
        </p>
      </header>
      <div className="space-y-6">
        <h2 className="text-center text-2xl font-bold">System Summary</h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          {SYSTEM_SUMMARY.map((item) => (
            <Card
              key={item.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
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
        <h2 className="text-center text-2xl font-bold">System Management</h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          {DASHBOARD_ITEMS.map((item) => (
            <Card
              onClick={() => navigate(item.link)}
              key={item.title}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}

export default Dashboard;
