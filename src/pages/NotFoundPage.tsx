import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-2">
        <SearchX className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="max-w-md text-muted-foreground">
          Oops! It seems you've followed a broken link or entered a URL that
          doesn't exist.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Go Back to Homepage</Link>
      </Button>
    </div>
  );
}
