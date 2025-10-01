import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Type,
  Search,
  Bell,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EventCategory, EventDepartment } from "../../../types/eventTypes";
import { editEvent } from "../services/supervisorRequests";
import { Button } from "../../../components/ui/Button";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";

const EditForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById } = useSupervisor();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "" as EventCategory | "",
    department: "" as EventDepartment | "",
    date: "",
  });

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.category || !form.department) {
      setError("Please select a category and department");
      setLoading(false);
      return;
    }

    try {
      const result = await editEvent(
        eventId || "",
        form.title,
        form.description,
        form.location,
        form.department,
        form.category,
        new Date(form.date)
      );

      if (!result.success) {
        setError(result.message || "Failed to edit event");
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(false);
      navigate("/browse-events");
    } catch (err) {
      console.log("Error in handleEditEvent:", err);
      setError("Unexpected error occurred");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFetchEvent = async (eventId: string) => {
    setLoading(true);
    try {
      const result = await getEventById(eventId);
      if (!result.success) return;
      const fetchedEvent = result.data.event;
      if (fetchedEvent) {
        setForm({
          title: fetchedEvent.title || "",
          description: fetchedEvent.description || "",
          location: fetchedEvent.location || "",
          category: fetchedEvent.category || "",
          department: fetchedEvent.department || "",
          date: fetchedEvent.date ? fetchedEvent.date.split("T")[0] : "",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error fetching event");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventId) return;
    handleFetchEvent(eventId);
  }, []);

  if (loading && !form.title) {
    // Show loading screen while fetching event
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Edit Event Form
            </h1>
            <p className="text-muted-foreground">Manage Events</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleEditEvent}
          className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow-xl"
        >
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Edit Event
          </h2>

          {/* Title */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Title</label>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Type className="text-gray-400" size={18} />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Description</label>
            <div className="flex items-start gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <FileText className="mt-1 text-gray-400" size={18} />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter event description"
                className="w-full resize-none outline-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Location</label>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <MapPin className="text-gray-400" size={18} />
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select category</option>
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select department</option>
              {Object.values(EventDepartment).map((dep) => (
                <option key={dep} value={dep}>
                  {dep.charAt(0).toUpperCase() + dep.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Date</label>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Calendar className="text-gray-400" size={18} />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white shadow-md transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Editing..." : "Edit Event"}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default EditForm;
