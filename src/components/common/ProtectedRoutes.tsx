import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useUsers";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAuth();

  if (!auth.user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
