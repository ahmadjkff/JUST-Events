import { Calendar, Users, BellRing, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function DashboardCards() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // ✅ دعم الاتجاه RTL / LTR
  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  return (
    <div className="space-y-6">
      {/* ===== Quick Stats ===== */}
      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isRTL ? "text-right" : ""
        }`}
      >
        {/* Upcoming Events */}
        <Link to="/browse-events">
          <Card>
            <CardContent className="p-4">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                }`}
              >
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboardCards.upcomingEvents")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Registered Events */}
        <Link to="/student/my-events">
          <Card>
            <CardContent className="p-4">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                }`}
              >
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboardCards.registeredEvents")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* My Certificates */}
        <Link to="/student/my-certificates">
          <Card>
            <CardContent className="p-4">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                }`}
              >
                <Award className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboardCards.myCertificates")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Notifications */}
        <Link to="/notifications">
          <Card>
            <CardContent className="p-4">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
                }`}
              >
                <BellRing className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboardCards.notifications")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ===== Profile Summary ===== */}
      <Card className={isRTL ? "text-right" : ""}>
        <CardHeader>
          <CardTitle>{t("dashboardCards.myProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {t("dashboardCards.profileDescription")}
          </p>
          <Link to="/profile">
            <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700">
              {t("dashboardCards.viewProfile")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
