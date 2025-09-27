import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Loading from "../../../components/ui/Loading";

const AdminStatistics = () => {
  const [data, setData] = useState<{
    events: {
      totalEvents: number;
      upcomingEvents: number;
      completedEvents: number;
      eventCounts: { _id: string; count: number }[];
    };
    users: {
      totalUsers: number;
      roleCounts: { _id: string; count: number }[];
    };
    feedback: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  // Fetch statistics data from the backend
  useState(() => {
    fetch("http://localhost:3001/event/admin/statistics")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch admin statistics:", err))
      .finally(() => setLoading(false));
  });

  const USER_COLORS: Record<string, string> = {
    admin: "blue",
    student: "green",
    supervisor: "orange",
  };
  const EVENT_COLORS: Record<string, string> = {
    approved: "green",
    pending: "gray",
    completed: "blue",
    rejected: "red",
  };

  const statistics = [
    {
      title: "Events",
      dataKey: "events",
      colors: EVENT_COLORS,
      statisticsData: data?.events.eventCounts || [],
    },
    {
      title: "Users",
      dataKey: "users",
      colors: USER_COLORS,
      statisticsData: data?.users.roleCounts || [],
    },
  ];

  const StatistcsComponent = ({
    title,
    statisticsData,
    colors,
  }: {
    title: string;
    statisticsData: { _id: string; count: number }[];
    colors: Record<string, string>;
  }) => (
    <div className="flex flex-col items-center">
      <h1>{title} Statistics</h1>
      <PieChart width={400} height={300}>
        <Pie
          data={statisticsData}
          dataKey="count"
          nameKey="_id"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {statisticsData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[entry._id] || "gray"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            System Statistics
          </h1>
          <p className="text-muted-foreground">Show system statistics</p>
        </div>
      </header>

      <div className="flex flex-wrap justify-between gap-8 p-6">
        {statistics.map((stat) => (
          <StatistcsComponent
            key={stat.title}
            title={stat.title}
            colors={stat.colors}
            statisticsData={stat.statisticsData}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminStatistics;
