import {
  Bell,
  Calendar,
  Clock,
  Filter,
  MapPin,
  Plus,
  Search,
  User,
  Users,
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

function MyEvents() {
  useTitle("My Events - JUST Events");

  const registeredEvents = [
    {
      id: 1,
      title: "Advanced Programming Workshop",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Conference Hall",
      category: "Technology",
      status: "upcoming",
      attendees: 45,
      description: "Learn advanced programming concepts and best practices",
    },
    {
      id: 2,
      title: "Entrepreneurship Conference",
      date: "2024-01-18",
      time: "2:00 PM",
      location: "Main Auditorium",
      category: "Business",
      status: "upcoming",
      attendees: 120,
      description:
        "Network with entrepreneurs and learn about startup strategies",
    },
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Web Development Bootcamp",
      date: "2023-12-10",
      time: "9:00 AM",
      location: "Computer Lab",
      category: "Technology",
      status: "completed",
      attendees: 30,
      description: "Intensive web development training session",
    },
    {
      id: 4,
      title: "Career Fair 2023",
      date: "2023-11-25",
      time: "10:00 AM",
      location: "Main Hall",
      category: "Career",
      status: "completed",
      attendees: 200,
      description:
        "Connect with potential employers and explore career opportunities",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Business:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Career:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const EventCard = ({
    event,
    showActions = true,
  }: {
    event: any;
    showActions?: boolean;
  }) => (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
          {showActions && (
            <div className="flex gap-2">
              {event.status === "upcoming" && (
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              )}
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {event.time}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {event.attendees} attendees
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">My Events</h1>
            <p className="text-muted-foreground">
              Manage your registered events and explore new opportunities
            </p>
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Browse Events
            </Button>
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming Events ({registeredEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {registeredEvents.length > 0 ? (
                <div className="grid gap-4">
                  {registeredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      No upcoming events
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any upcoming events yet.
                    </p>
                    <Button>Browse Available Events</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.length > 0 ? (
                <div className="grid gap-4">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      No past events
                    </h3>
                    <p className="text-muted-foreground">
                      Your completed events will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default MyEvents;
