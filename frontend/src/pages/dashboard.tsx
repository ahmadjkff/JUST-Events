import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";



function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    // بيانات تجريبية
    const users = [
        { id: 1, name: "Anas", role: "Student" },
        { id: 2, name: "Sara", role: "Supervisor" },
        { id: 3, name: "Omar", role: "Student" },
        { id: 4, name: "Ali", role: "Student" },
    ];

    const events = [
        { id: 101, title: "Tech Talk", status: "Pending" },
        { id: 102, title: "AI Workshop", status: "Approved" },
    ];

    const supervisors = [
        { id: 201, name: "Sara", department: "Engineering" },
        { id: 202, name: "Omar", department: "Medicine" },
    ];

    const volunteers = [
        { id: 301, name: "Hiba", event: "Tech Talk" },
        { id: 302, name: "Lina", event: "AI Workshop" },
    ];

    // Pagination
    const itemsPerPage = 3;
    const paginate = (data: any[]) =>
        data.filter((item) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        ).slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="p-8">
            <h1 className="text-4xl font-extrabold mb-8">Admin Dashboard</h1>

            <Tabs defaultValue="stats" className="space-y-6">
                {/* القوائم الرئيسية */}
                <TabsList className="w-full grid grid-cols-4 lg:grid-cols-6 gap-2">
                    <TabsTrigger value="stats">📊 Statistics</TabsTrigger>
                    <TabsTrigger value="users">👥 Users</TabsTrigger>
                    <TabsTrigger value="events">🎉 Events</TabsTrigger>
                    <TabsTrigger value="supervisors">🧑‍💼 Supervisors</TabsTrigger>
                    <TabsTrigger value="requests">📩 Requests</TabsTrigger>
                    <TabsTrigger value="volunteers">🙋 Volunteers</TabsTrigger>
                </TabsList>

                {/* الإحصائيات */}
                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Website Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li>Total Users: 123</li>
                                <li>Total Events: 10</li>
                                <li>Total Supervisors: 5</li>
                                <li>Pending Requests: 8</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* المستخدمين */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>All Users</CardTitle>
                            <Input
                                placeholder="🔍 Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-60"
                            />
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">ID</th>
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Role</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(users).map((user) => (
                                        <tr key={user.id}>
                                            <td className="border p-2">{user.id}</td>
                                            <td className="border p-2">{user.name}</td>
                                            <td className="border p-2">{user.role}</td>
                                            <td className="border p-2 space-x-2">
                                                <Button size="sm">Edit</Button>
                                                <Button size="sm" variant="destructive">
                                                    Delete
                                                </Button>
                                                <Button size="sm" variant="secondary">
                                                    Promote
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Prev
                                </Button>
                                <Button onClick={() => setPage(page + 1)}>Next</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* الفعاليات */}
                <TabsContent value="events">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>All Events</CardTitle>
                            <Input
                                placeholder="🔍 Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-60"
                            />
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Event ID</th>
                                        <th className="p-2 border">Title</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(events).map((event) => (
                                        <tr key={event.id}>
                                            <td className="border p-2">{event.id}</td>
                                            <td className="border p-2">{event.title}</td>
                                            <td className="border p-2">{event.status}</td>
                                            <td className="border p-2 space-x-2">
                                                <Button size="sm" variant="secondary">
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive">
                                                    Delete
                                                </Button>
                                                <Button size="sm">Approve</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Prev
                                </Button>
                                <Button onClick={() => setPage(page + 1)}>Next</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* المشرفين */}
                <TabsContent value="supervisors">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Supervisors</CardTitle>
                            <Input
                                placeholder="🔍 Search supervisors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-60"
                            />
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">ID</th>
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Department</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(supervisors).map((sup) => (
                                        <tr key={sup.id}>
                                            <td className="border p-2">{sup.id}</td>
                                            <td className="border p-2">{sup.name}</td>
                                            <td className="border p-2">{sup.department}</td>
                                            <td className="border p-2 space-x-2">
                                                <Button size="sm">Edit</Button>
                                                <Button size="sm" variant="destructive">
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Prev
                                </Button>
                                <Button onClick={() => setPage(page + 1)}>Next</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* الطلبات */}
                <TabsContent value="requests">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Promotion Request</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Student <strong>"Lina"</strong> wants to become a Supervisor.
                                <div className="mt-2 space-x-2">
                                    <Button size="sm">Approve</Button>
                                    <Button size="sm" variant="destructive">
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Event Request</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Event <strong>"AI Workshop"</strong> waiting for approval.
                                <div className="mt-2 space-x-2">
                                    <Button size="sm">Approve</Button>
                                    <Button size="sm" variant="destructive">
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Volunteer Request</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Student <strong>"Omar"</strong> wants to volunteer in <strong>"Tech Talk"</strong>.
                                <div className="mt-2 space-x-2">
                                    <Button size="sm">Approve</Button>
                                    <Button size="sm" variant="destructive">
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                {/* المتطوعين */}
                <TabsContent value="volunteers">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Volunteers</CardTitle>
                            <Input
                                placeholder="🔍 Search volunteers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-60"
                            />
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">ID</th>
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Event</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginate(volunteers).map((vol) => (
                                        <tr key={vol.id}>
                                            <td className="border p-2">{vol.id}</td>
                                            <td className="border p-2">{vol.name}</td>
                                            <td className="border p-2">{vol.event}</td>
                                            <td className="border p-2 space-x-2">
                                                <Button size="sm" variant="secondary">
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive">
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Prev
                                </Button>
                                <Button onClick={() => setPage(page + 1)}>Next</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Dashboard;