import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";

function MyCertificates() {
  useTitle("My Certificates - JUST Events");
    return (
    <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-foreground text-2xl font-bold">
                My Certificates
            </h1>
            <p className="text-muted-foreground">
                Here are the certificates you have earned from attending events.
            </p>
            </div>
        </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div>
                    <h2 className="mb-2 text-xl font-semibold">
                    Your Certificates
                    </h2>
                    <p className="text-muted-foreground">
                    Download and view your event participation certificates here.
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>
            {/* Certificates List */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example Certificate Card */}
            <Card className="border border-gray-300 dark:border-gray-700">
                <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Event Name</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Date: January 15, 2024
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Download Certificate
                </button>
                </CardContent>
            </Card>
            {/* Add more certificate cards as needed */}
            </div>
        </div>
        </main>
    </div>
    );
}
export default MyCertificates;
