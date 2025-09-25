import {
  Calendar,
  Users,
  BellRing,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";


export default function DashboardCards() {

  // const achievements = [
  //   {
  //     title: "Active Participant",
  //     description: "Participated in 10 events",
  //     icon: Trophy,
  //   },
  //   {
  //     title: "Distinguished Learner",
  //     description: "Completed 5 courses",
  //     icon: BookOpen,
  //   },
  //   {
  //     title: "Community Member",
  //     description: "Joined 6 months ago",
  //     icon: Users,
  //   },
  // ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/browse-events">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/my-events">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">
                    Registered Events
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/my-certificates">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">My Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/notifications">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BellRing className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Achievements */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <achievement.icon className="h-8 w-8 text-yellow-500" />
                <div>
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}


      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Manage your profile details and account settings.
          </p>
          <Link to="/profile">
            <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700">
              View Profile
            </Button>
          </Link>

        </CardContent>
      </Card>

      {/* Upcoming Events */}
      {/* <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Button size="sm">Register</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
