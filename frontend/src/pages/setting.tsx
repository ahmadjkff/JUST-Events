import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useTitle } from "../hooks/useTitle";

function Setting() {
  useTitle("Settings - JUST Events");

  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="w-[420px] shadow-xl border border-muted">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center tracking-tight">
            ⚙️ Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-5">
          {/* زر دارك / لايت */}
          <Button
            variant="outline"
            className="w-60 h-12 rounded-full text-lg flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <span>Toggle Dark / Light Mode</span>
          </Button>

          {/* زر تبديل اللغة */}
          <Button
            variant="outline"
            className="w-60 h-12 rounded-full text-lg flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <span>Switch Language (AR / EN)</span>
          </Button>

          {/* زر تسجيل الخروج */}
          <Button
            variant="destructive"
            className="w-60 h-12 rounded-full text-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            🚪 <span>Logout</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Setting;
