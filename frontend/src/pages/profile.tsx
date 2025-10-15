import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { useAuth } from "../context/auth/AuthContext";
import { useTitle } from "../hooks/useTitle";
import { useTranslation } from "react-i18next";

function Profile() {
  useTitle("Profile - JUST Events");
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
      <Card className="hover:shadow-3xl w-[400px] border-0 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] dark:bg-slate-800/80">
        <CardHeader className="pb-6">
          <div className="flex flex-col items-center gap-6">
            {/* صورة المستخدم */}
            <div className="relative">
              <Avatar className="h-28 w-28 shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50">
                <AvatarImage
                  src={user?.img || "/placeholder.svg"}
                  alt={user?.firstName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* اسم المستخدم */}
            <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-slate-100 dark:to-slate-300">
              {`${user?.firstName} ${user?.lastName}`}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* الدور */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <p className="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              {t("profile.role")}:
              <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-slate-800 dark:bg-blue-900/50 dark:text-slate-100">
                {user?.role}
              </span>
            </p>
          </div>

          {/* البريد الإلكتروني */}
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-800/50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <p className="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {t("profile.email")}:
              <a
                href={`mailto:${user?.email}`}
                className="ml-auto font-semibold text-emerald-700 transition-colors duration-200 hover:text-emerald-800 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {user?.email}
              </a>
            </p>
          </div>

          {/* الكلية */}
          <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:border-purple-800/50 dark:from-purple-950/30 dark:to-pink-950/30">
            <p className="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              {t("profile.faculty")}:
              <span className="ml-auto font-semibold text-slate-800 dark:text-slate-100">
                {user?.faculty}
              </span>
            </p>
          </div>

          {/* الرقم الجامعي */}
          <div className="rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-orange-950/30">
            <p className="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              {t("profile.universityId")}:
              <span className="ml-auto font-mono font-semibold text-slate-800 dark:text-slate-100">
                {user?.universityId}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
