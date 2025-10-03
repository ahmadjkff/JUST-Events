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
import { useEffect, useState } from "react";
import { controlVolunteerApplication } from "../services/APIRequests";
import Menu from "../../../components/ui/Menu";
import {
  VolunteerStatus,
  type IVolunteerApplication,
} from "../../../types/eventTypes";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "../../../components/ui/badge";
import EventsTable from "../components/EventsTable";

//To-Do: add unfound filter rsults (no results found for the selected filter)

function VolunteerControl() {
  useTitle("Control Volunteers - JUST Events");
  const { volunteersByStatus, fetchVolunteers, fetchEvents } = useEvent();
  const [department, setDepartment] = useState<string | null>(null);

  interface VolunteerCardProps {
    volunteer: IVolunteerApplication;
  }

  const VolunteerCard = ({ volunteer }: VolunteerCardProps) => {
    const { student, status, event, createdAt } = volunteer;

    const isApproved = status === VolunteerStatus.Approved;
    const isRejected = status === VolunteerStatus.Rejected;

    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              "{student.firstName} {student.lastName}"
              {isApproved ? " is " : " wants to become "}a volunteer on
              <Link
                to="/admin/control-events"
                className="text-blue-600 hover:underline"
              >
                {` ${event.title} `}
              </Link>
              event
            </CardTitle>
          </div>

          <div className="flex justify-end gap-2 px-6">
            {!isApproved && (
              <Button
                variant="outline"
                className="border-green-100 bg-green-100 text-green-800"
                onClick={() => handleStatus(volunteer, "assign")}
              >
                Approve
              </Button>
            )}
            {!isRejected && (
              <Button
                variant="outline"
                className="border-red-100 bg-red-100 text-red-800"
                onClick={() => handleStatus(volunteer, "remove")}
              >
                Reject
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4">{student.firstName}</p>

          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <VolunteerInfo icon={<Calendar className="h-4 w-4" />}>
              {createdAt.toString().split("T")[0]}
            </VolunteerInfo>
            <VolunteerInfo icon={<IdCard className="h-4 w-4" />}>
              {student.universityId}
            </VolunteerInfo>
            <VolunteerInfo icon={<University className="h-4 w-4" />}>
              {student.faculty}
            </VolunteerInfo>
          </div>
        </CardContent>
      </Card>
    );
  };

  const VolunteerInfo = ({
    icon,
    children,
  }: {
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center gap-1">
      {icon}
      {children}
    </div>
  );

  const handleStatus = async (
    volunteer: IVolunteerApplication,
    action: "assign" | "remove",
  ) => {
    await controlVolunteerApplication(
      volunteer.event._id,
      volunteer.student._id,
      action,
    );
    await fetchVolunteers!();

    toast.success(
      `Volunteer ${action === "assign" ? "approved" : "rejected"} successfully`,
    );
  };

  // fetch volunteer on component mount
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchVolunteers!(),
        fetchEvents(),
        fetchEvents("approved"),
      ]);
    };

    fetchAll();
  }, []);

  // Filter volunteer based on category and department
  const filteredVolunteers = (status: string) => {
    let volunteers =
      volunteersByStatus[status as keyof typeof volunteersByStatus] || [];

    if (department) {
      volunteers = volunteers.filter(
        (e: any) =>
          e.student.faculty.toLowerCase() === department.toLowerCase(),
      );
    }

    return volunteers;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      Header
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
                Assigned Volunteers ({volunteersByStatus.approved.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Volunteers ({volunteersByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="removed">
                Removed Volunteers ({volunteersByStatus.rejected.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Volunteers */}
            {/* <TabsContent value="pending" className="space-y-4">
              <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
                <h1 className={`text-2xl font-bold text-gray-500`}>Pending</h1>
                <div className="flex items-center gap-2">
                  {department && (
                    <Badge className="bg-gray-100 text-gray-800">
                      Department:
                      <strong className="text-orange-700">{department}</strong>
                    </Badge>
                  )}
                  {department && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDepartment(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              {volunteersByStatus.pending.length > 0 ? (
                filteredVolunteers("pending").map((volunteer: any) => (
                  <VolunteerCard
                    key={`${volunteer.student._id}${volunteer.event._id}`}
                    volunteer={volunteer}
                  />
                ))
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />

                    <h3 className="mb-2 text-lg font-semibold">
                      No pending applications
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Pending applications will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Assigned Volunteers */}
            <TabsContent value="assigned" className="space-y-4">
              <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
                <h1 className={`text-2xl font-bold text-green-500`}>
                  Approved
                </h1>
                <div className="flex items-center gap-2">
                  {department && (
                    <Badge className="bg-gray-100 text-gray-800">
                      Department:
                      <strong className="text-orange-700">{department}</strong>
                    </Badge>
                  )}
                  {department && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDepartment(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              {volunteersByStatus.approved.length > 0 ? (
                filteredVolunteers("approved").map((volunteer: any) => (
                  <VolunteerCard
                    key={`${volunteer.student._id}${volunteer.event._id}`}
                    volunteer={volunteer}
                  />
                ))
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />

                    <h3 className="mb-2 text-lg font-semibold">
                      No approved applications
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Pending approved will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Removed Volunteers */}
            {/* <TabsContent value="removed" className="space-y-4">
              <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
                <h1 className={`text-2xl font-bold text-red-500`}>Rejected</h1>
                <div className="flex items-center gap-2">
                  {department && (
                    <Badge className="bg-gray-100 text-gray-800">
                      Department:
                      <strong className="text-orange-700">{department}</strong>
                    </Badge>
                  )}
                  {department && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDepartment(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              {volunteersByStatus.rejected.length > 0 ? (
                filteredVolunteers("rejected").map((volunteer: any) => (
                  <VolunteerCard
                    key={`${volunteer.student._id}${volunteer.event._id}`}
                    volunteer={volunteer}
                  />
                ))
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <X className="text-muted-foreground mx-auto mb-4 h-12 w-12" />

                    <h3 className="mb-2 text-lg font-semibold">
                      No rejected applications
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      rejected applications will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
             */}
            <EventsTable
              value="pending"
              status="Pending"
              department={department}
              setDepartment={setDepartment}
              icon={Clock}
              updateStatus={handleStatus}
              eventsByStatus={volunteersByStatus}
            />
            <EventsTable
              value="assigned"
              status="Approved"
              department={department}
              setDepartment={setDepartment}
              icon={Calendar}
              updateStatus={handleStatus}
              eventsByStatus={volunteersByStatus}
            />
            <EventsTable
              value="removed"
              status="Rejected"
              department={department}
              setDepartment={setDepartment}
              icon={X}
              updateStatus={handleStatus}
              eventsByStatus={volunteersByStatus}
            />
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default VolunteerControl;
