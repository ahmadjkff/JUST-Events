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
    <div className="flex flex-1 items-center justify-center">
      <Card className="border-muted w-[420px] border shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            ⚙️ Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-5">
          {/* زر دارك / لايت */}
          <Button
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground flex h-12 w-60 items-center gap-2 rounded-full text-lg transition-all"
          >
            <span>Toggle Dark / Light Mode</span>
          </Button>

          {/* زر تبديل اللغة */}
          <Button
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground flex h-12 w-60 items-center gap-2 rounded-full text-lg transition-all"
          >
            <span>Switch Language (AR / EN)</span>
          </Button>

          {/* زر تسجيل الخروج */}
          <Button
            variant="destructive"
            className="flex h-12 w-60 items-center gap-2 rounded-full text-lg shadow-md transition-all hover:shadow-lg"
          >
            🚪 <span>Logout</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Setting;
