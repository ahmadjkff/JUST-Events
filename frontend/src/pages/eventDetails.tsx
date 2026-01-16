import { useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { EventStatus, type IEvent } from "../types/eventTypes";
import toast from "react-hot-toast";
import { useEvent } from "../context/event/EventContext";
import { useAuth } from "../context/auth/AuthContext";

function EventDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addFeedback, deleteFeedback } = useEvent();
  const { user } = useAuth();
  const [event, setEvent] = useState<IEvent>();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch event by ID
  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/${eventId}`,
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
      const data = await response.json();
      setEvent(data.data.event);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent(id);
  }, [id]);

  if (loading) return <Loading />;

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!addFeedback) return;
    setIsSubmitting(true);
    const data = await addFeedback(id || "", rating, comment);
    setIsSubmitting(false);

    if (data.success) {
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          feedback: data.data,
        };
      });
      toast.success(data.message || "Feedback submitted successfully");
      setComment("");
      setRating(0);
    } else {
      toast.error(data.message || "Error occurred");
    }
  };

  const handleDeleteFeedback = async (eventId: string, feedbackId: string) => {
    if (!deleteFeedback) return;
    const data = await deleteFeedback(eventId, feedbackId);

    if (data.success) {
      toast.success(data.message || "Feedback deleted successfully");
      setEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          feedback: data.data,
        };
      });
    } else {
      toast.error(data.message || "Error occurred");
    }
  };

  return (
    <div className="bg-background flex h-screen">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Event Image */}
          <img
            src={`${import.meta.env.VITE_BASE_URL}${event?.img}`}
            alt={event?.title}
            className="h-64 w-full rounded-xl object-cover shadow-md"
          />

          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {event?.title}
                </CardTitle>
                <Badge variant="secondary">
                  {event?.category.toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {event?.department.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">
                📅 <span className="font-medium">{t("event.date")}:</span>
                {` ${event?.date?.split("T")[0]} ${t("event.at")} ${
                  event?.startTime ?? t("event.nA")
                }${event?.endTime ? ` - ${event.endTime}` : ""}`}
              </p>
              <p className="flex items-center gap-2">
                📍 <span className="font-medium">{t("event.location")}:</span>
                {event?.location}
              </p>
              <div
                className="text-foreground prose prose-sm dark:prose-invert max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:dark:bg-gray-800 [&_em]:italic [&_h1]:mt-2 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-2 [&_h2]:mb-1.5 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mt-1 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_h4]:mb-1 [&_h4]:text-sm [&_h4]:font-semibold [&_li]:mb-0.5 [&_ol]:mb-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:mb-2 [&_p]:leading-relaxed [&_strong]:font-semibold [&_u]:underline [&_ul]:mb-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: event?.description! }}
              />
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">{t("event.volunteers")}:</span>
                {event?.volunteers.length}
              </p>
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">{t("event.attendees")}:</span>
                {event?.registeredStudents.length} / {event?.capacity}
              </p>
              <p className="flex items-center gap-2">
                📌 <span className="font-medium">{t("event.status")}:</span>
                <Badge
                  className={`${
                    event?.status === EventStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : event?.status === EventStatus.Approved
                        ? "bg-green-100 text-green-800"
                        : event?.status === EventStatus.Rejected
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(`eventStatus.${event?.status}`)}
                </Badge>
              </p>
              <p>
                Supervised by : {event?.createdBy?.firstName}{" "}
                {event?.createdBy?.lastName}
              </p>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {t("event.feedbacks")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Feedback FIRST */}
              {user?._id && event?.status === EventStatus.Approved && (
                <div className="space-y-3 border-b pb-4">
                  <p className="font-semibold">{t("event.addFeedback")}</p>

                  {/* ⭐ Star Rating */}
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const fullValue = i + 1;
                      const halfValue = i + 0.5;

                      return (
                        <div
                          key={i}
                          className="relative flex cursor-pointer"
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <div
                            className="absolute top-0 left-0 h-full w-1/2"
                            onMouseEnter={() => setHoverRating(halfValue)}
                            onClick={() => setRating(halfValue)}
                          />
                          <div
                            className="absolute top-0 right-0 h-full w-1/2"
                            onMouseEnter={() => setHoverRating(fullValue)}
                            onClick={() => setRating(fullValue)}
                          />

                          <Star
                            className={`h-7 w-7 transition-colors duration-200 ${
                              (hoverRating || rating) >= fullValue
                                ? "fill-yellow-500 text-yellow-500"
                                : (hoverRating || rating) >= halfValue
                                  ? "fill-yellow-300 text-yellow-300"
                                  : "fill-none text-gray-400"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-500">
                    {rating > 0 ? `${t("event.yourRating")}: ${rating}` : ""}
                  </p>

                  <Textarea
                    placeholder={t("event.writeComment")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button
                    className="mt-2"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("event.submitting")
                      : t("event.submitFeedback")}
                  </Button>
                </div>
              )}

              {/* Display Feedbacks */}
              {event?.feedback.map((fb) => (
                <div
                  key={fb._id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  {/* User Image */}
                  <img
                    src={fb.student.img || "/default-avatar.png"}
                    alt={`${fb.student.firstName} ${fb.student.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold">
                        {`${fb.student.firstName} ${fb.student.lastName}`}
                      </p>

                      {(user?._id === event?.createdBy._id ||
                        user?._id ===
                          (typeof fb.student === "string"
                            ? fb.student
                            : fb.student._id)) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteFeedback(event?._id || "", fb._id)
                          }
                        >
                          Delete
                        </Button>
                      )}
                    </div>

                    <div className="mb-1 flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starValue = i + 1;
                        return (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              fb.rating >= starValue
                                ? "fill-yellow-500 text-yellow-500"
                                : fb.rating >= starValue - 0.5
                                  ? "fill-yellow-300 text-yellow-300"
                                  : "fill-none text-gray-400"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <p className="text-gray-700">{fb.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(fb.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
