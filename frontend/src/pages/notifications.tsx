import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";
function Notifications() {
    useTitle("Notifications - JUST Events");
    return (
    <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-foreground text-2xl font-bold">
                Notifications
            </h1>
            <p className="text-muted-foreground">
                Here are your recent notifications and updates.
            </p>
            </div>
        </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
            <Card className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div>
                    <h2 className="mb-2 text-xl font-semibold">
                    Your Notifications
                    </h2>
                    <p className="text-muted-foreground">
                    Stay updated with the latest news and alerts from your events.
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>
            {/* Notifications List */}
            <div className="space-y-4">
            {/* Example Notification Item */}
            <Card className="border border-gray-300 dark:border-gray-700">
                <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">New Event Available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    A new workshop on "Advanced React Techniques" has been added. Check it out!
                </p>
                <span className="text-xs text-gray-500">2 hours ago</span>
                </CardContent>
            </Card>
            {/* Add more notification items as needed */}
            </div>
        </div>
        </main>
    </div>
    );
}
export default Notifications;