import React, { useMemo } from "react";
import { TabsContent } from "../../../components/ui/tabs";
import type { EventStatus, IEvent } from "../../../types/eventTypes";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import EventCard from "./EventCard";
import { Card, CardContent } from "../../../components/ui/Card";

const statusColors: Record<string, string> = {
  approved: "text-green-500",
  pending: "text-gray-500",
  rejected: "text-red-500",
};

function EventsTable({
  value,
  status,
  icon,
  category,
  department,
  setCategory,
  setDepartment,
  eventsByStatus,
  updateStatus,
}: {
  value: string;
  status: string;
  icon: any;

  category: string | null;
  department: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setDepartment: React.Dispatch<React.SetStateAction<string | null>>;
  eventsByStatus: Record<string, IEvent[]>;
  updateStatus: (eventId: string, status: EventStatus) => Promise<void>;
}) {
  const filteredEvents = useMemo(
    () => (status: EventStatus) => {
      let events = eventsByStatus[status as keyof typeof eventsByStatus] || [];
      if (category) {
        events = events.filter(
          (e: IEvent) =>
            (e.category ?? "").toLowerCase() === category.toLowerCase(),
        );
      }

      if (department) {
        events = events.filter(
          (e: IEvent) =>
            e.department.toLowerCase() === department.toLowerCase(),
        );
      }

      return events;
    },
    [eventsByStatus, category, department],
  );

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
          {filteredEvents(value as EventStatus).length ? (
            filteredEvents(value as EventStatus).map((event: IEvent) => (
              <EventCard
                key={event._id}
                event={event}
                updateStatus={updateStatus}
              />
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
}

export default EventsTable;
