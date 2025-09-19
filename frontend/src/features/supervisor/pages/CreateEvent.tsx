import React, { useState } from "react";
import { Calendar, MapPin, FileText, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventCategory, EventDepartment } from "../../../types/eventTypes";
import { createEvent } from "../services/supervisorRequests";

const EventForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "" as EventCategory | "",
    department: "" as EventDepartment | "",
    date: "",
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate category & department
    if (!form.category || !form.department) {
      setError("Please select a category and department");
      setLoading(false);
      return;
    }

    try {
      const result = await createEvent(
        form.title,
        form.description,
        form.location,
        form.department,
        form.category,
        new Date(form.date)
      );

      console.log("Create event result:", result);

      if (!result.success) {
        setError(result.message || "Failed to create event");
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(false);
      navigate("/browse-events");
    } catch (err) {
      console.log("Error in handleCreateEvent:", err);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleCreateEvent}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create New Event
        </h2>

        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Title</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
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
          <label className="block text-gray-700 mb-1 font-medium">
            Description
          </label>
          <div className="flex items-start gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <FileText className="text-gray-400 mt-1" size={18} />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter event description"
              className="w-full outline-none resize-none"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Location
          </label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
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
          <label className="block text-gray-700 mb-1 font-medium">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block text-gray-700 mb-1 font-medium">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
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

        {/* Date */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Date</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EventForm;
