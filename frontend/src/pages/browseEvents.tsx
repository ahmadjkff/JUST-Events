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
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/AlertDialog";
import { deleteEvent } from "../features/supervisor/services/supervisorRequests";

function BrowseEvents() {
  useTitle("Browse Events - JUST Events");
  const { eventsByStatus, fetchEvents } = useEvent();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    fetchEvents("approved");
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    const result = await deleteEvent(eventId);
    if (result.success) {
      fetchEvents("approved");
    }
  };
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
    <Card className="transition-shadow hover:shadow-md">
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
            {event.createdBy === user?._id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-red-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-600">
                      Delete Event
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Are you sure you want to Delete <b>{event.title} Event</b>
                      ? <br />
                      This action{" "}
                      <span className="font-semibold text-red-500">
                        cannot be undone
                      </span>{" "}
                      and attendees will lose access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300">
                      Close
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEvent(event._id)}
                      className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {event.createdBy === user?._id && (
              <Button
                size="sm"
                className="bg-blue-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg"
                onClick={() => navigate(`/supervisor/edit-event/${event._id}`)}
              >
                Edit
              </Button>
            )}
          </div>
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
            <h1 className="text-foreground text-2xl font-bold">
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
            {user?.role === "supervisor" && (
              <Button
                size="lg"
                onClick={() => navigate("/supervisor/create-event")}
              >
                Create Event
              </Button>
            )}
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search available events..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <ChartBarStacked className="mr-2 h-4 w-4" />
              Category
            </Button>
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="available">
                Available Events ({eventsByStatus.approved.length})
              </TabsTrigger>
              <TabsTrigger value="featured">
                Featured Events ({eventsByStatus.approved.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              {eventsByStatus.approved.length > 0 ? (
                <div className="grid gap-4">
                  {eventsByStatus.approved.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
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
              {eventsByStatus.approved.length > 0 ? (
                <div className="grid gap-4">
                  {eventsByStatus.approved.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
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
