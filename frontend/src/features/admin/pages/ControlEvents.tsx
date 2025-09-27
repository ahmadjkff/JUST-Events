import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { useTitle } from "../../../hooks/useTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { useEvent } from "../../../context/event/EventContext";
import React, { useEffect, useState } from "react";
import { changeEventStatus } from "../services/APIRequests";
import Menu from "../../../components/ui/Menu";
import { EventCategory, type IEvent } from "../../../types/eventTypes";

function ControlEvents() {
  useTitle("Control Events - JUST Events");
  const { eventsByStatus, fetchEvents } = useEvent();
  const [category, setCategory] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      [EventCategory.Tech]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      [EventCategory.Health]:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      [EventCategory.Education]:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      [EventCategory.Community]:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      [EventCategory.Arts]:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      [EventCategory.Other]:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const statusColors: Record<string, string> = {
    approved: "text-green-500",
    pending: "text-gray-500",
    rejected: "text-red-500",
  };

  const EventCard = ({ event }: { event: IEvent; showActions?: boolean }) => (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6">
          <Button
            variant={"outline"}
            className={`border-green-100 bg-green-100 text-green-800 ${event.status === "approved" ? "hidden" : ""}`}
            onClick={() => updateStatus(event._id, "approved")}
          >
            Approve
          </Button>
          <Button
            variant={"outline"}
            className={`border-gray-100 bg-gray-100 text-gray-800 ${event.status === "pending" ? "hidden" : ""}`}
            onClick={() => updateStatus(event._id, "pending")}
          >
            Set To Pending
          </Button>
          <Button
            variant={"outline"}
            className={`border-red-100 bg-red-100 text-red-800 ${event.status === "rejected" ? "hidden" : ""}`}
            onClick={() => updateStatus(event._id, "rejected")}
          >
            Reject
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {event.createdAt
              ? new Date(event.createdAt).toLocaleTimeString()
              : "N/A"}
          </div>
          <a href="https://www.google.com/maps/place/%D9%85%D8%AF%D8%B1%D8%AC+%D8%A7%D8%A8%D9%86+%D8%B3%D9%8A%D9%86%D8%A7%E2%80%AD/@32.4965546,35.9911206,44m/data=!3m1!1e3!4m14!1m7!3m6!1s0x151b89381a3b428f:0xfd149214da321b7d!2z2KzYp9mF2LnYqSDYp9mE2LnZhNmI2YUg2YjYp9mE2KrZg9mG2YjZhNmI2KzZitinINin2YTYp9ix2K_ZhtmK2Kk!8m2!3d32.4949069!4d35.9860433!16zL20vMGNwbjE5!3m5!1s0x151b890061dec065:0xe9e762c6a1de6eb2!8m2!3d32.4966205!4d35.9909166!16s%2Fg%2F11vz11wx15?entry=ttu&g_ep=EgoyMDI1MDkyMi4wIKXMDSoASAFQAw%3D%3D">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </a>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {event.volunteers?.length} attendees
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Reusable function to render table content for each tab
  const tableContent = (value: string, status: string, icon: any) => {
    return (
      <TabsContent value={value} className="space-y-4">
        <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
          <h1 className={`text-2xl font-bold ${statusColors[value]}`}>
            {status}
          </h1>
          <div className="flex items-center gap-2">
            {category && (
              <Badge className="bg-gray-100 text-gray-800">
                Category:
                <strong className="text-orange-700">{category}</strong>
              </Badge>
            )}
            {department && (
              <Badge className="bg-gray-100 text-gray-800">
                Department:
                <strong className="text-orange-700">{department}</strong>
              </Badge>
            )}
            {(category || department) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory(null);
                  setDepartment(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        {eventsByStatus[value as keyof typeof eventsByStatus].length > 0 ? (
          <div className="grid gap-4">
            {filteredEvents(value).length ? (
              filteredEvents(value).map((event: any) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <p className="text-muted-foreground">
                No events found for the selected filters.
              </p>
            )}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              {React.createElement(icon, {
                className: "h-12 w-12 mx-auto text-muted-foreground mb-4",
              })}
              <h3 className="mb-2 text-lg font-semibold">No {value} events</h3>
              <p className="text-muted-foreground mb-4">
                {value} events will appear here.
              </p>
              <Button>Browse Available Events</Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    );
  };

  const updateStatus = async (
    eventId: string,
    status: "approved" | "pending" | "rejected",
  ) => {
    const { success, message } = await changeEventStatus(eventId, status);
    if (!success) return console.error(message);

    await Promise.all([
      fetchEvents("approved"),
      fetchEvents("pending"),
      fetchEvents("rejected"),
    ]);
  };

  // fetch events on component mount
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

  // Filter events based on category and department
  const filteredEvents = (status: string) => {
    let events = eventsByStatus[status as keyof typeof eventsByStatus] || [];
    if (category) {
      events = events.filter(
        (e: any) => (e.category ?? "").toLowerCase() === category.toLowerCase(),
      );
    }

    if (department) {
      events = events.filter(
        (e: any) => e.department.toLowerCase() === department.toLowerCase(),
      );
    }

    return events;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Approve / Reject Events
          </h1>
          <p className="text-muted-foreground">Manage Events</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="relative bg-transparent"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input placeholder="Search your events..." className="pl-10" />
            </div>

            <Menu
              title="Category"
              items={[
                "Tech",
                "Health",
                "Education",
                "Community",
                "Arts",
                "Other",
              ]}
              selected={category || "Category"}
              setSelected={setCategory}
            />
            <Menu
              title="Department"
              items={["IT", "Engineering", "Medical", "Science"]}
              selected={department || "Department"}
              setSelected={setDepartment}
            />
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="flex w-full max-w-md grid-cols-3 md:grid">
              <TabsTrigger value="approved">
                Approved Events ({eventsByStatus.approved.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Events ({eventsByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected Events ({eventsByStatus.rejected.length})
              </TabsTrigger>
            </TabsList>

            {tableContent("approved", "Approved", Calendar)}
            {tableContent("pending", "Pending", Clock)}
            {tableContent("rejected", "Rejected", X)}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default ControlEvents;
