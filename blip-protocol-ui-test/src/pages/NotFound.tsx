import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>

        <p className="mb-6 text-xl text-muted-foreground">
          Oops! Page not found
        </p>

        <div className="flex items-center justify-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60 transition"
          >
            Go Back
          </button>

          {/* Home Link */}
          <a
            href="/"
            className="text-primary underline hover:text-primary/90"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
