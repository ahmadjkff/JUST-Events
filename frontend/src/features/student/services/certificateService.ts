export const downloadCertificate = async (eventId: string) => {
  const res = await fetch(
    `http://localhost:5000/student/certificate/${eventId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to download certificate");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "certificate.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
