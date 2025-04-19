
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Bookmark } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="w-full max-w-md px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-2 bg-white rounded-full shadow-sm mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Social Bookmark Bridge</h1>
          <p className="text-muted-foreground mt-2">
            One place for all your social bookmarks
          </p>
        </div>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default Login;
