import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Textarea } from "../components/ui/textarea"
import { Star } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"

function EventDetails() {

  const event = {
    title: "Advanced Programming Workshop",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Conference Hall",
    description:
      "Learn advanced programming concepts and best practices in this intensive workshop.",
    image:
      "https://plus.unsplash.com/premium_photo-1661882403999-46081e67c401?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2dyYW1pbmd8ZW58MHx8MHx8fDA%3D",
    category: "Technology",
    department: "Computer Science Department",
    volunteers: 12,
    status: "PENDING",
    isVolunteer: false,
    feedbacks: [
      {
        id: 1,
        user: "Omar Ali",
        image: "https://ui-avatars.com/api/?name=Omar+Ali",
        rating: 4,
        comment: "Great event! Learned a lot.",
      },
      {
        id: 2,
        user: "Sara Ahmed",
        image: "https://ui-avatars.com/api/?name=Sara+Ahmed",
        rating: 5,
        comment: "Amazing workshop with excellent speakers.",
      },
    ],
  }

  return (
    <div className="flex h-screen bg-background">

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* صورة الحدث */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />

          {/* تفاصيل الحدث */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold">
                  {event.title}
                </CardTitle>
                <Badge variant="secondary">{event.category}</Badge>
              </div>
              <p className="text-muted-foreground">{event.department}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                📅 <span className="font-medium">Date:</span> {event.date} at{" "}
                {event.time}
              </p>
              <p>
                📍 <span className="font-medium">Location:</span>{" "}
                {event.location}
              </p>
              <p className="text-foreground">{event.description}</p>
              <p>
                👥 <span className="font-medium">Volunteers:</span>{" "}
                {event.volunteers}
              </p>
              <p>
                📌 <span className="font-medium">Status:</span>{" "}
                <Badge
                  className={`${
                    event.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : event.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : event.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {event.status}
                </Badge>
              </p>
              {!event.isVolunteer && (
                <Button className="mt-4">🤝 Volunteer for this Event</Button>
              )}
            </CardContent>
          </Card>

          {/* Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Feedbacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.feedbacks.length > 0 ? (
                event.feedbacks.map((fb) => (
                  <div key={fb.id} className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={fb.image} alt={fb.user} />
                      <AvatarFallback>{fb.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{fb.user}</p>
                      <div className="flex text-yellow-500 mb-1">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{fb.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No feedbacks yet.</p>
              )}

              {/* إضافة Feedback */}
              <div className="space-y-3 border-t pt-4">
                <p className="font-semibold">Add your feedback</p>
                <div className="flex gap-2 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 cursor-pointer" />
                  ))}
                </div>
                <Textarea placeholder="Write your comment..." />
                <Button className="mt-2">Submit Feedback</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
