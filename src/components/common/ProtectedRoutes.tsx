import { Navigate } from "react-router";
import { useUsers } from "../../hooks/useUsers";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useUsers();

  if (!auth.user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
