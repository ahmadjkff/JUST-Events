import Sidebar from "../components/Sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { useTitle } from "../hooks/useTitle";

function Profile() {
  useTitle("Profile - JUST Events");
  
  const user = {
    name: "Anas Khaled",
    image: "https://ui-avatars.com/api/?name=Anas+Khaled",
    eventsAttended: 7,
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center">
        <Card className="w-[400px] shadow-xl">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              {/* صورة المستخدم */}
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* اسم المستخدم */}
              <CardTitle className="text-2xl font-bold">
                {user.name}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex justify-center">
            <p className="text-lg text-muted-foreground">
              ✅ Attended Events:{" "}
              <span className="font-semibold text-foreground">
                {user.eventsAttended}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
