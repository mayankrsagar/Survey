import { Navigate } from "react-router-dom";

export default function PublicOnlyRoute({ children }) {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored).user : null;

  if (user?.role === "admin") {
    // toast.info("You're already logged in as admin");
    return <Navigate to="/ahome" replace />;
  }

  if (user?.role === "user") {
    // toast.info("You're already logged in");
    return <Navigate to="/createsurvey" replace />;
  }

  // If not logged in, allow access to public route
  return children;
}
