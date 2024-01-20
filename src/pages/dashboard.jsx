import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <div>
      <h2>Protected Dashboard Page</h2>
      <p>This page is protected. Only authenticated users can access it.</p>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
