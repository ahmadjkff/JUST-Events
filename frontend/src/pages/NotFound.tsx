import { Button } from "../components/ui/Button";
import { useAuth } from "../context/auth/AuthContext";

function NotFound() {
  const { user } = useAuth();

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center px-4 text-center">
      {/* Number 404 */}
      <h1 className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-[8rem] font-extrabold text-transparent">
        404
      </h1>

      {/* the title */}
      <h2 className="text-foreground mb-2 text-3xl font-bold">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md">
        Oops! The page you're looking for doesn't exist or was moved.
      </p>

      {user?.role === "admin" ? (
        <Button
          variant="default"
          size="lg"
          className="rounded-full px-8 text-lg shadow-md transition-all hover:shadow-lg"
          onClick={() => (window.location.href = "/admin/dashboard")}
        >
          ⬅ Back to Dashboard
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          className="rounded-full px-8 text-lg shadow-md transition-all hover:shadow-lg"
          onClick={() => (window.location.href = "/")}
        >
          ⬅ Back to Home
        </Button>
      )}
    </div>
  );
}

export default NotFound;
