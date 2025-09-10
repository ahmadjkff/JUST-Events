import api from "../../../utils/utils";

export const downloadCertificate = async (eventId: string) => {
  const res = await api.get(`/student/certificate/${eventId}`, {
    responseType: "blob", 
  });


  const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "certificate.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
