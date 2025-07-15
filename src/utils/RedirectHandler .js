import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get path after domain
    const slug = location.pathname.split("/")[1]; // e.g., "AARTI_AT88HE"
    console.log("Slug is:", slug);

    if (slug) {
      // Optional: save slug in localStorage/sessionStorage if needed
      sessionStorage.setItem("referredByName", slug);

      // Redirect to root
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default RedirectHandler;
