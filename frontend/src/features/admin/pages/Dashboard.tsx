import { Card } from "../../../components/ui/Card";
import { useFetch } from "../../../hooks/useFetch";

function Dashboard() {
  const { data, loading, error, doFetch } = useFetch();

  const handleSubmit = async () => {
    try {
      const action = "supervisor";
      const userId = "68b7055d69f2be7d8ad9ec5f";

      doFetch(`/admin/edit-role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: { newRole: action },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      console.log("message: ", message);

      return { success: false, message };
    }
  };

  const mockData = {
    event1: {
      title: "Annual Science Fair 2024",
      description:
        "Showcasing the best science projects from students across the university.",
      category: "academic",
      date: "4/15/2024",
      time: "09:00 AM",
      location: "University Science Building",
      participants: "120/150 participants",
      registrationDeadline: "4/11/2024",
      onViewDetails: () => console.log("View details clicked"),
      isRegistrationOpen: false,
      imageUrl: "../../../public/placeholder.svg",
    },
    event2: {
      title: "Annual Science Fair 2024",
      description:
        "Showcasing the best science projects from students across the university.",
      category: "academic",
      date: "4/15/2024",
      time: "09:00 AM",
      location: "University Science Building",
      participants: "120/150 participants",
      registrationDeadline: "4/11/2024",
      onViewDetails: () => console.log("View details clicked"),
      isRegistrationOpen: false,
      imageUrl: "../../../public/placeholder.svg",
    },
    event3: {
      title: "Annual Science Fair 2024",
      description:
        "Showcasing the best science projects from students across the university.",
      category: "academic",
      date: "4/15/2024",
      time: "09:00 AM",
      location: "University Science Building",
      participants: "120/150 participants",
      registrationDeadline: "4/11/2024",
      onViewDetails: () => console.log("View details clicked"),
      isRegistrationOpen: true,
      imageUrl: "../../../public/placeholder.svg",
    },
    event4: {
      title: "Annual Science Fair 2024",
      description:
        "Showcasing the best science projects from students across the university.",
      category: "academic",
      date: "4/15/2024",
      time: "09:00 AM",
      location: "University Science Building",
      participants: "120/150 participants",
      registrationDeadline: "4/11/2024",
      onViewDetails: () => console.log("View details clicked"),
      isRegistrationOpen: false,
      imageUrl: "../../../public/placeholder.svg",
    },
    event5: {
      title: "Annual Science Fair 2024",
      description:
        "Showcasing the best science projects from students across the university.",
      category: "academic",
      date: "4/15/2024",
      time: "09:00 AM",
      location: "University Science Building",
      participants: "120/150 participants",
      registrationDeadline: "4/11/2024",
      onViewDetails: () => console.log("View details clicked"),
      isRegistrationOpen: true,
      imageUrl: "../../../public/placeholder.svg",
    },
  };

  return (
    <div className="flex justify-center items-center gap-4 flex-1 flex-wrap ">
      {Object.values(mockData).map((event: any, index: number) => (
        <Card key={index} {...event} />
      ))}
      {/* <Card
        title="Annual Science Fair 2024"
        description="Showcasing the best science projects from students across the university."
        category="academic"
        date="4/15/2024"
        time="09:00 AM"
        location="University Science Building"
        participants="120/150 participants"
        registrationDeadline="4/11/2024"
        onViewDetails={() => console.log("View details clicked")}
        isRegistrationOpen={false}
        imageUrl="../../../public/placeholder.svg" // optional
      /> */}
    </div>
  );
}

export default Dashboard;
