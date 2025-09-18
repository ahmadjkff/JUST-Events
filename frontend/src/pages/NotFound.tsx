import { Button } from "../components/ui/Button"


function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background text-center px-4">
      {/* Number 404 */}
      <h1 className="text-[8rem] font-extrabold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
        404
      </h1>

      {/* the title */}
      <h2 className="text-3xl font-bold text-foreground mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-muted-foreground max-w-md mb-6">
        Oops! The page you're looking for doesn't exist or was moved.
      </p>

      {/* Back button */}
      <Button
        variant="default"
        size="lg"
        className="rounded-full px-8 text-lg shadow-md hover:shadow-lg transition-all"
        onClick={() => (window.location.href = "/")}
      >
        ⬅ Back to Home
      </Button>
    </div>
  )
}

export default NotFound
