import React, { useState } from "react";
import { Calendar, MapPin, FileText, Type } from "lucide-react";

const EventForm: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
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
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
