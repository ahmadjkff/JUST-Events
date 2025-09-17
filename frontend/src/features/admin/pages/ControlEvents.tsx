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
import { useEffect } from "react";
import { changeEventStatus } from "../services/APIRequests";

function ControlEvents() {
  useTitle("Control Events - JUST Events");
  const { eventsByStatus, fetchEvents } = useEvent();

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

  const EventCard = ({ event }: { event: any; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
        </div>
        <div className="px-6 flex justify-end gap-2">
          <Button
            variant={"outline"}
            className={`bg-green-100 text-green-800 border-green-100 ${event.status === "approved" ? "hidden" : ""}`}
            onClick={() => handleApprove(event)}
          >
            Approve
          </Button>
          <Button
            variant={"outline"}
            className={`bg-gray-100 text-gray-800 border-gray-100 ${event.status === "pending" ? "hidden" : ""}`}
            onClick={() => handlePending(event)}
          >
            Set To Pending
          </Button>
          <Button
            variant={"outline"}
            className={`bg-red-100 text-red-800 border-red-100 ${event.status === "rejected" ? "hidden" : ""}`}
            onClick={() => handleReject(event)}
          >
            Reject
          </Button>
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

  const handleApprove = async (event: any) => {
    const { success, message } = await changeEventStatus(event._id, "approved");
    if (!success) {
      console.error(message);
      return;
    }
    await fetchEvents("approved");
    await fetchEvents("pending");
    await fetchEvents("rejected");
  };

  const handlePending = async (event: any) => {
    const { success, message } = await changeEventStatus(event._id, "pending");
    if (!success) {
      console.error(message);
      return;
    }
    await fetchEvents("approved");
    await fetchEvents("pending");
    await fetchEvents("rejected");
  };

  const handleReject = async (event: any) => {
    const { success, message } = await changeEventStatus(event._id, "rejected");
    if (!success) {
      console.error(message);
      return;
    }
    await fetchEvents("approved");
    await fetchEvents("pending");
    await fetchEvents("rejected");
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchEvents("approved");
      await fetchEvents("pending");
      await fetchEvents("rejected");
    };

    fetchAll();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your events..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
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

            <TabsContent value="approved" className="space-y-4">
              {eventsByStatus.approved.length > 0 ? (
                <div className="grid gap-4">
                  {eventsByStatus.approved.length &&
                    eventsByStatus.approved.map((event: any) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No approved events
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      The events you approve will appear here.
                    </p>
                    <Button>Browse Available Events</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {eventsByStatus.pending.length > 0 ? (
                <div className="grid gap-4">
                  {eventsByStatus.pending.map((event: any) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No pending events
                    </h3>
                    <p className="text-muted-foreground">
                      Pending events will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {eventsByStatus.rejected.length > 0 ? (
                <div className="grid gap-4">
                  {eventsByStatus.rejected.map((event: any) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <X className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No rejected events
                    </h3>
                    <p className="text-muted-foreground">
                      The events you rejected will appear here.
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

export default ControlEvents;
