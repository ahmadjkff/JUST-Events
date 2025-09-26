import { useTitle } from "../hooks/useTitle";
import StudentDashboardCards from "../components/DashboardCards";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";


function Home() {
  useTitle("Home - JUST Events");
  const { user } = useAuth();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
               Welcome back, {user?.firstName || "Guest"} !
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at your university today
            </p>
          </div>

          {/* <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Message */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">
                    Welcome to Jordan University of Science and Technology
                    Events Platform
                  </h2>
                  <p className="text-muted-foreground">
                    Discover new events, connect with your peers, and develop
                    your skills through our interactive platform
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/browse-events">Explore Events</Link>
                </Button> 
              </div>
            </CardContent>
          </Card>
          {/* Dashboard Cards */}
          <StudentDashboardCards />
        </div>
      </main>
    </div>
  );
}

export default Home;
