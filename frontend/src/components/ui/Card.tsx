import {
  CalendarToday,
  LocationOn,
  People,
  AccessTime,
} from "@mui/icons-material";

interface EventCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  registrationDeadline: string;
  onViewDetails: () => void;
  isRegistrationOpen: boolean;
  imageUrl?: string;
}

function Card({
  title = "Annual Science Fair 2024",
  description = "Showcasing the best science projects from students across the university.",
  category = "academic",
  date = "4/15/2024",
  time = "09:00 AM",
  location = "University Science Building",
  participants = "120/150 participants",
  registrationDeadline = "4/11/2024",
  onViewDetails,
  isRegistrationOpen = false,
  imageUrl,
}: EventCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden max-w-sm w-full transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>No Image</span>
          </div>
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

        {/* Category Badge */}
        <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-lg shadow-md px-3 py-2">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>

        {/* Info Section */}
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex gap-2 items-center">
            <CalendarToday className="w-4 h-4 mr-2 text-blue-500" />
            <span>
              {date} at {time}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <LocationOn className="w-4 h-4 mr-2 text-green-500" />
            <span>{location}</span>
          </div>

          <div className="flex gap-2 items-center">
            <People className="w-4 h-4 mr-2 text-purple-500" />
            <span>{participants}</span>
          </div>

          <div className="flex gap-2 items-center">
            <AccessTime className="w-4 h-4 mr-2 text-red-500" />
            <span>Closes: {registrationDeadline}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-3 p-5">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
              isRegistrationOpen
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!isRegistrationOpen}
          >
            {isRegistrationOpen ? "Register" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
