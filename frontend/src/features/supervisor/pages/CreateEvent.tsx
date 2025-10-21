import React, { useState } from "react";
import { FileText, Type, Search, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventCategory, EventDepartment } from "../../../types/eventTypes";
import { createEvent } from "../services/supervisorRequests";
import { Button } from "../../../components/ui/Button";
import toast from "react-hot-toast";

interface IStage {
  _id: string;
  location: string;
  name: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status: "free" | "reserved";
}

const EventForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [descError, setDescError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    stageId: "",
    title: "",
    description: "",
    location: "",
    category: "" as EventCategory | "",
    department: "" as EventDepartment | "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [img, setImg] = useState<File | null>(null);
  const [stages, setStages] = useState<IStage[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  // ✅ Fetch available stages
  const openStageDialog = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stage");
      const data = await res.json();
      setStages(data.data.events);
      setShowDialog(true);
    } catch (err) {
      console.error("Failed to fetch stages", err);
    }
  };

  // ✅ Handle field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ AI Description Generator
  const handleGenerateDescription = async () => {
    if (!form.title.trim()) {
      setDescError("Please enter a title before generating description");
      toast.error("Please enter a title before generating description");
      return;
    }

    setLoadingDescription(true);
    setDescError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/ai/generate-description",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title }),
        },
      );

      const data = await response.json();

      if (response.ok && data.description) {
        setForm((prev) => ({ ...prev, description: data.description }));
      } else {
        setDescError(data.error || "Failed to generate description");
        toast.error(data.error || "Failed to generate description");
      }
    } catch (error) {
      console.error(error);
      setDescError("Something went wrong while generating description");
    } finally {
      setLoadingDescription(false);
    }
  };

  // ✅ Create Event handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.category || !form.department) {
      setError("Please select a category and department");
      setLoading(false);
      return;
    }

    if (!img) {
      setError("Please upload an event image");
      setLoading(false);
      return;
    }

    if (!form.location) {
      setError("Please select a stage");
      setLoading(false);
      return;
    }

    try {
      const result = await createEvent(
        form.stageId,
        form.title,
        form.description,
        form.location,
        form.department,
        form.category,
        img,
      );

      if (!result.success) {
        setError(result.message || "Failed to create event");
        setLoading(false);
        return;
      }
      toast.success("Event created successfully");
      setError(null);
      setLoading(false);
      navigate("/browse-events");
    } catch (err) {
      console.error("Error in handleCreateEvent:", err);
      setError("Unexpected error occurred");
      setLoading(false);
    }
  };

  const hanldelSeletetStage = async (id: string, location: string) => {
    console.log("Selected Stage ID:", id);
    console.log("Selected Stage Location:", location);
    setForm({ ...form, stageId: id, location });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Create Event Form
            </h1>
            <p className="text-muted-foreground">Manage Events</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent"
            >
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
          onSubmit={handleCreateEvent}
          className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow-xl"
        >
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Create New Event
          </h2>

          {/* Title */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Title
            </label>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
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

          {/* Description + AI Button */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Description
            </label>
            <div className="flex items-start gap-2 rounded-lg border px-3 py-2">
              <FileText className="mt-1 text-gray-400" size={18} />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter or generate event description"
                className="w-full resize-none outline-none"
                rows={3}
                required
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={loadingDescription}
              className={`mt-2 w-full rounded-lg py-2 font-medium text-white transition ${
                loadingDescription
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loadingDescription
                ? "Generating..."
                : "Generate Auto Description"}
            </button>

            {descError && (
              <p className="mt-2 text-center text-sm text-red-500">
                {descError}
              </p>
            )}
          </div>

          {/* Stage */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Stage
            </label>
            <button
              type="button"
              className="w-full rounded-lg border bg-white px-3 py-2 text-left"
              onClick={openStageDialog}
            >
              {form.location || "Select Stage"}
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              required
            >
              <option value="" disabled>
                Select department
              </option>
              {Object.values(EventDepartment).map((dep) => (
                <option key={dep} value={dep}>
                  {dep.charAt(0).toUpperCase() + dep.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Event Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files?.[0] || null)}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white shadow-md transition hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
        </form>
      </main>

      {/* Stage Selection Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-11/12 max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Select a Stage</h2>
            <table className="w-full border text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-1">Location</th>
                  <th className="px-2 py-1">Date</th>
                  <th className="px-2 py-1">Start Time</th>
                  <th className="px-2 py-1">End Time</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={stage._id} className="border-b">
                    <td className="px-2 py-1">{stage.name}</td>
                    <td className="px-2 py-1">
                      {stage.date
                        ? new Date(stage.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-2 py-1">{stage.startTime || "-"}</td>
                    <td className="px-2 py-1">{stage.endTime || "-"}</td>
                    <td className="px-2 py-1">{stage.status}</td>
                    <td className="px-2 py-1">
                      <button
                        disabled={stage.status === "reserved"}
                        className={`rounded px-2 py-1 ${
                          stage.status === "reserved"
                            ? "cursor-not-allowed bg-gray-300"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => {
                          hanldelSeletetStage(stage._id, stage.name);
                          setShowDialog(false);
                        }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;
