import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const finalizeAuthentication = async () => {
      try {
        if (user) {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        toast.error("Authentication failed. Please try logging in again.");
        navigate("/login", { replace: true });
      }
    };

    finalizeAuthentication();
  }, [user, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        Finalizing your login, please wait...
      </p>
    </div>
  );
}
