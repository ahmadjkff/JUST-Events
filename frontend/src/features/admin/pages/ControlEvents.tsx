import { Bell, Calendar, Clock, Search, User, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useTitle } from "../../../hooks/useTitle";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { useEvent } from "../../../context/event/EventContext";
import { useEffect, useState } from "react";
import { changeEventStatus } from "../services/APIRequests";
import Menu from "../../../components/ui/Menu";
import { EventStatus } from "../../../types/eventTypes";
import toast from "react-hot-toast";
import Loading from "../../../components/ui/Loading";
import EventsTable from "../components/EventsTable";

function ControlEvents() {
  useTitle("Control Events - JUST Events");
  const { eventsByStatus, fetchEvents } = useEvent();
  const [category, setCategory] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (eventId: string, status: EventStatus) => {
    setLoading(true);
    const { success, message } = await changeEventStatus(eventId, status);
    if (!success) {
      toast.error(message || "Failed to update event");
      setLoading(false);
      return console.error(message);
    }

    await Promise.all([
      fetchEvents("approved"),
      fetchEvents("pending"),
      fetchEvents("rejected"),
    ]);
    setLoading(false);
    toast.success("Event set to " + status);
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

  if (loading) return <Loading />;

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

            <EventsTable
              value="approved"
              status="Approved"
              icon={Calendar}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
            <EventsTable
              value="pending"
              status="Pending"
              icon={Clock}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
            <EventsTable
              value="rejected"
              status="Rejected"
              icon={X}
              updateStatus={updateStatus}
              category={category}
              department={department}
              setCategory={setCategory}
              setDepartment={setDepartment}
              eventsByStatus={eventsByStatus}
            />
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default ControlEvents;
