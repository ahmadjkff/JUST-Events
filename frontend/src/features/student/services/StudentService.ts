export const fetchStudentRegistrations = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/event/student-registrations`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch registrations");
      return { success: false, data: [] };
    }

    const json = await res.json();
    return { success: true, data: json.data }; // matches your existing format
  } catch (err) {
    console.error("Error fetching student registrations:", err);
    return { success: false, data: [] };
  }
};
