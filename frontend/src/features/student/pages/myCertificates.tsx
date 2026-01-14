import { useTranslation } from "react-i18next";
import { useTitle } from "../../../hooks/useTitle";
import { Card, CardContent } from "../../../components/ui/Card";
import { useEffect, useState } from "react";
import Loading from "../../../components/ui/Loading";

function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useTitle(`${t("myCertificates.title")} - ${t("app.name")}`);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/student/certificates`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await res.json();

        setCertificates(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (eventId: string, title: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/student/certificate/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to download certificate");
      }

      // Convert response to blob
      const blob = await res.blob();
      console.log(blob);

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `JUST-${title} certificate.pdf`; // Or you can use `${eventTitle}.pdf`
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {t("myCertificates.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("myCertificates.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Heading Card */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">
                    {t("myCertificates.heading")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("myCertificates.description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificates List */}
          {loading ? (
            <Loading />
          ) : certificates.length > 0 ? (
            <div className="flex flex-wrap gap-4 align-middle justify-center">
              {certificates.map((certificate: any) => (
                <Card
                  key={certificate._id}
                  className="w-full border border-gray-300 sm:w-1/2 md:w-1/3 lg:w-1/4 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      {certificate.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {t("myCertificates.date")}:{" "}
                      {new Date(certificate.date).toISOString().split("T")[0]}
                    </p>
                    <button
                      className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      onClick={() =>
                        handleDownload(certificate._id, certificate.title)
                      }
                    >
                      {t("myCertificates.download")}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              {t("myCertificates.noCertificates")}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyCertificates;
