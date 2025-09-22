import {
  Bell,
  Calendar,
  Clock,
  IdCard,
  Search,
  University,
  User,
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
import { controlVolunteerApplication } from "../services/APIRequests";
import Menu from "../../../components/ui/Menu";
import { type IEvent, type IVolunteer } from "../../../types/eventTypes";
import { Link } from "react-router-dom";

function VolunteerControl() {
  useTitle("Control Volunteers - JUST Events");
  const { volunteersByStatus, eventsByStatus, fetchVolunteers, fetchEvents } =
    useEvent();
  const [department, setDepartment] = useState<string | null>(null);

  const VolunteerCard = ({
    volunteer,
  }: {
    volunteer: IVolunteer;
    showActions?: boolean;
  }) => (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">
              "{volunteer.student.firstName} {volunteer.student.lastName}" wants
              to become a volunteer on{" "}
              <Link
                to={"/admin/control-events"}
                className="text-blue-600 hover:underline"
              >
                "{volunteer.event.title}"
              </Link>{" "}
              event
            </CardTitle>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6">
          <Button
            variant={"outline"}
            className={`border-green-100 bg-green-100 text-green-800 ${volunteer.status === "approved" ? "hidden" : ""}`}
            onClick={() => handleStatus(volunteer, "assign")}
          >
            Approve
          </Button>
          <Button
            variant={"outline"}
            className={`border-red-100 bg-red-100 text-red-800 ${volunteer.status === "rejected" ? "hidden" : ""}`}
            onClick={() => handleStatus(volunteer, "remove")}
          >
            Reject
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4">
          {volunteer.student.firstName}
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {volunteer.createdAt.toString().split("T")[0]}
          </div>
          <div className="flex items-center gap-1">
            <IdCard className="h-4 w-4" />
            {volunteer.student.universityId}
          </div>
          <div className="flex items-center gap-1">
            <University className="h-4 w-4" />
            {volunteer.student.faculty}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleStatus = async (
    volunteer: IVolunteer,
    action: "assign" | "remove",
  ) => {
    await controlVolunteerApplication(
      volunteer.event._id,
      volunteer.student._id,
      action,
    );
    await fetchVolunteers!();
  };

  // fetch volunteer on component mount
  useEffect(() => {
    const fetchAll = async () => {
      await fetchVolunteers!();
      await fetchEvents();
      await fetchEvents("approved");
    };

    fetchAll();
  }, []);

  // Filter volunteer based on category and department
  const filteredVolunteers = (status: string) => {
    let volunteers =
      volunteersByStatus[status as keyof typeof volunteersByStatus] || [];

    if (department) {
      volunteers = volunteers.filter(
        (e: IVolunteer) =>
          e.student.faculty.toLowerCase() === department.toLowerCase(),
      );
    }

    return volunteers;
  };

  const calcApprovedVolunteers = () => {
    let count = 0;
    eventsByStatus.approved.forEach((event: IEvent) => {
      count += event.volunteers.length;
    });
    return count;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Approve / Reject Volunteers
          </h1>
          <p className="text-muted-foreground">
            Manage Volunteers Applications
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
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input placeholder="Search volunteers..." className="pl-10" />
            </div>

            <Menu
              title="Department"
              items={["IT", "Engineering", "Medical", "Science"]}
              selected={department || "Department"}
              setSelected={setDepartment}
            />
          </div>

          {/* Volunteers Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="flex w-full max-w-lg grid-cols-3 md:grid">
              <TabsTrigger value="assigned">
                Assigned Volunteers ({calcApprovedVolunteers()})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Volunteers ({volunteersByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="removed">
                Removed Volunteers ({volunteersByStatus.removed.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Volunteers */}
            <TabsContent value="pending" className="space-y-4">
              {filteredVolunteers("pending").map((volunteer: IVolunteer) => (
                <VolunteerCard key={volunteer._id} volunteer={volunteer} />
              ))}
            </TabsContent>

            {/* Assigned Volunteers */}
            <TabsContent value="assigned" className="space-y-4">
              {eventsByStatus.approved.length > 0 &&
                eventsByStatus.approved.map(
                  (event: IEvent) =>
                    event.volunteers.length > 0 && (
                      <Card
                        className="transition-shadow hover:shadow-md"
                        key={event._id}
                      >
                        {event.volunteers.map((v: any) => (
                          <CardHeader key={v._id}>
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-lg">
                                  student {v.firstName} {v.lastName} volunteered
                                  for {event.title}
                                </CardTitle>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 px-6">
                              <Button
                                variant={"outline"}
                                className="border-red-100 bg-red-100 text-red-800"
                                onClick={() => handleStatus(v, "remove")}
                              >
                                Remove
                              </Button>
                            </div>
                          </CardHeader>
                        ))}

                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {event.category}
                          </p>
                          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.volunteers.length}
                            </div>
                            <div className="flex items-center gap-1">
                              <IdCard className="h-4 w-4" />
                              {event.createdAt}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                )}
            </TabsContent>

            {/* Removed Volunteers */}
            <TabsContent value="removed" className="space-y-4">
              {filteredVolunteers("removed").map((volunteer: IVolunteer) => (
                <VolunteerCard key={volunteer._id} volunteer={volunteer} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default VolunteerControl;
