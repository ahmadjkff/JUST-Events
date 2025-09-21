import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useTitle } from "../hooks/useTitle";

function Profile() {
  useTitle("Profile - JUST Events");

  const user = {
    name: "Anas Khaled",
    image: "https://ui-avatars.com/api/?name=Anas+Khaled",
    eventsAttended: 7,
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-[400px] shadow-xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            {/* صورة المستخدم */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* اسم المستخدم */}
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center">
          <p className="text-muted-foreground text-lg">
            ✅ Attended Events:{" "}
            <span className="text-foreground font-semibold">
              {user.eventsAttended}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
