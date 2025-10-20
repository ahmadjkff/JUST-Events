import { EventCategory } from "./types/eventTypes";

export const statusColors: Record<string, string> = {
  approved: "text-green-500",
  pending: "text-gray-500",
  rejected: "text-red-500",
};

export const getCategoryColor = (category: string) => {
  const colors = {
    [EventCategory.Tech]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    [EventCategory.Health]:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    [EventCategory.Education]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    [EventCategory.Community]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    [EventCategory.Arts]:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    [EventCategory.Other]:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
