import Dashboard from "../Pages/Dashboard";
import Employees from "../Pages/Employees";
import Events from "../Pages/Events";
import Reports from "../Pages/Reports";

const routes = [
  { path: "/", element: Dashboard },
  { path: "/reports", element: Reports },
  { path: "/employees", element: Employees },
  { path: "/events", element: Events },
];

export default routes;
