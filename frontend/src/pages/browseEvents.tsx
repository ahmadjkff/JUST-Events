import {
  Badge,
  Bell,
  Calendar,
  ChartBarStacked,
  Clock,
  Filter,
  MapPin,
  Search,
  User,
  Users,
} from "lucide-react";
import { useTitle } from "../hooks/useTitle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
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
import { useAuth } from "../context/auth/AuthContext";

function BrowseEvents() {
  useTitle("Browse Events - JUST Events");
  const { events, fetchEvents } = useEvent();
  const { user } = useAuth();
  //   {
  //     id: 1,
  //     title: "AI & Machine Learning Summit",
  //     date: "2024-02-10",
  //     time: "9:00 AM",
  //     location: "Innovation Center",
  //     category: "Technology",
  //     attendees: 150,
  //     description:
  //       "Discover the latest trends in AI and Machine Learning with industry experts.",
  //   },
  //   {
  //     id: 2,
  //     title: "Marketing Strategies Workshop",
  //     date: "2024-02-15",
  //     time: "1:00 PM",
  //     location: "Business Hub",
  //     category: "Business",
  //     attendees: 80,
  //     description:
  //       "Enhance your marketing skills with hands-on sessions and expert guidance.",
  //   },
  // ];

  // const featuredEvents = [
  //   {
  //     id: 3,
  //     title: "Leadership & Teamwork Seminar",
  //     date: "2024-03-01",
  //     time: "11:00 AM",
  //     location: "Main Auditorium",
  //     category: "Career",
  //     attendees: 200,
  //     description:
  //       "Learn effective leadership and teamwork strategies from successful leaders.",
  //   },
  // ];

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const EventCard = ({ event }: { event: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm">Register</Button>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Browse Events
            </h1>
            <p className="text-muted-foreground">
              Explore and register for upcoming events
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
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            {user?.role === "supervisor" && (
              <Button size="lg">Create Event</Button>
            )}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search available events..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <ChartBarStacked className="h-4 w-4 mr-2" />
              Category
            </Button>
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="available">
                Available Events ({events.length})
              </TabsTrigger>
              <TabsTrigger value="featured">
                Featured Events ({events.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              {events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No available events
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Currently, there are no events to display. Please check
                      back later.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              {events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No featured events
                    </h3>
                    <p className="text-muted-foreground">
                      Featured events will appear here.
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

export default BrowseEvents;
