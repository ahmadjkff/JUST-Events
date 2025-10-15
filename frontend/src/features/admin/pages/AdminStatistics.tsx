import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Loading from "../../../components/ui/Loading";
import { useTranslation } from "react-i18next";

const AdminStatistics = () => {
  const { t } = useTranslation();
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
  useEffect(() => {
    fetch("http://localhost:3001/event/admin/statistics")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch admin statistics:", err))
      .finally(() => setLoading(false));
  }, []);

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
      title: t("adminStatistics.events"),
      dataKey: "events",
      colors: EVENT_COLORS,
      statisticsData: data?.events.eventCounts || [],
      translationGroup: "eventStatusLabels",
    },
    {
      title: t("adminStatistics.users"),
      dataKey: "users",
      colors: USER_COLORS,
      statisticsData: data?.users.roleCounts || [],
      translationGroup: "roles",
    },
  ];

  const StatistcsComponent = ({
    title,
    statisticsData,
    colors,
    translationGroup,
  }: {
    title: string;
    statisticsData: { _id: string; count: number }[];
    colors: Record<string, string>;
    translationGroup: string;
  }) => {
    // ترجمة القيم (roles أو statuses)
    const translatedData = statisticsData.map((entry) => ({
      ...entry,
      translatedName: t(`${translationGroup}.${entry._id}`, entry._id),
    }));

    return (
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <PieChart width={400} height={300}>
          <Pie
            data={translatedData}
            dataKey="count"
            nameKey="translatedName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {translatedData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={colors[entry._id] || "gray"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            {t("adminStatistics.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("adminStatistics.description")}
          </p>
        </div>
      </header>

      {/* Charts */}
      <div className="flex flex-wrap justify-between gap-8 p-6">
        {statistics.map((stat) => (
          <StatistcsComponent
            key={stat.title}
            title={stat.title}
            colors={stat.colors}
            statisticsData={stat.statisticsData}
            translationGroup={stat.translationGroup}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminStatistics;
