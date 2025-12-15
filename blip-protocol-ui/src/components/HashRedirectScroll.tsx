import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const HashRedirectScroll = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, hash } = location;

    // 1️⃣ If on another route with hash → go to "/"
    if (pathname !== "/" && hash) {
      navigate({ pathname: "/", hash }, { replace: true });
      return;
    }

    // 2️⃣ On home with hash → WAIT until section exists
    if (pathname === "/" && hash) {
      const id = hash.replace("#", "");

      let attempts = 0;
      const maxAttempts = 20; // ~300ms total

      const scrollWhenReady = () => {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        if (attempts < maxAttempts) {
          attempts++;
          requestAnimationFrame(scrollWhenReady);
        }
      };

      requestAnimationFrame(scrollWhenReady);
    }
  }, [location.pathname, location.hash, navigate]);

  return null;
};
