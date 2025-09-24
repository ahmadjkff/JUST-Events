import { useEffect, useState } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Tabs } from "@radix-ui/react-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { updateApplicationStatus } from "../services/supervisorRequests";
import { Loader2 } from "lucide-react"; // spinner icon

function SupervisorApplications() {
  const { applicationsByStatus, fetchApplications } = useSupervisor();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdate = async (
    eventId: string,
    studentId: string,
    action: "approved" | "rejected" | "pending",
  ) => {
    setLoadingId(studentId); // show spinner on this student's button
    await updateApplicationStatus(eventId, studentId, action);
    await fetchApplications();
    setLoadingId(null); // reset after done
  };
  const handleApproveAll = async () => {
    try {
      setLoadingId("all");
      const approvePromises = applicationsByStatus.pending.map((app) =>
        updateApplicationStatus(app.event._id, app.student._id, "approved"),
      );
      await Promise.all(approvePromises);
      await fetchApplications();
      setLoadingId(null);
    } catch (error) {
      console.error("Error approving all applications:", error);
    }
  };
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Student Applications
      </h1>

      <Tabs defaultValue="pending" className="w-full">
        {/* Tabs Header */}
        <TabsList className="mb-6 flex gap-4 border-b border-gray-200">
          <TabsTrigger
            value="pending"
            className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Pending ({applicationsByStatus.pending.length})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
          >
            Approved ({applicationsByStatus.approved.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Rejected ({applicationsByStatus.rejected.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending */}
        <TabsContent value="pending" className="space-y-4">
          {applicationsByStatus.pending.length === 0 && (
            <p className="text-gray-500">No pending applications</p>
          )}
          {applicationsByStatus.pending.length > 0 && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={loadingId === "all"}
              onClick={() => handleApproveAll()}
            >
              {loadingId === "all" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Approve ALL"
              )}
            </Button>
          )}
          {applicationsByStatus.pending.map((app) => (
            <Card
              key={app._id}
              className="rounded-xl border border-gray-200 shadow-sm"
            >
              <CardHeader className="font-semibold text-gray-700">
                {app.student.firstName} {app.student.lastName} applied for{" "}
                <span className="font-bold text-gray-900">
                  {app.event.title}
                </span>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {app.student.firstName} {app.student.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {app.student.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "approved")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "rejected")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Approved */}
        <TabsContent value="approved" className="space-y-4">
          {applicationsByStatus.approved.length === 0 && (
            <p className="text-gray-500">No approved applications</p>
          )}
          {applicationsByStatus.approved.map((app) => (
            <Card
              key={app._id}
              className="rounded-xl border border-green-200 bg-green-50 shadow"
            >
              <CardHeader className="flex items-center gap-2 font-semibold text-green-700">
                ✅ {app.student.firstName} {app.student.lastName}
                <span className="text-gray-500">({app.student.email})</span>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Approved for {app.event.title}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "pending")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Set Pending"
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "rejected")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4">
          {applicationsByStatus.rejected.length === 0 && (
            <p className="text-gray-500">No rejected applications</p>
          )}
          {applicationsByStatus.rejected.map((app) => (
            <Card
              key={app._id}
              className="rounded-xl border border-red-200 bg-red-50 shadow"
            >
              <CardHeader className="flex items-center gap-2 font-semibold text-red-700">
                ❌ {app.student.firstName} {app.student.lastName}
                <span className="text-gray-500">({app.student.email})</span>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Rejected for {app.event.title}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "pending")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Set Pending"
                    )}
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loadingId === app.student._id}
                    onClick={() =>
                      handleUpdate(app.event._id, app.student._id, "approved")
                    }
                  >
                    {loadingId === app.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SupervisorApplications;
