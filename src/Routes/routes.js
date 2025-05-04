import AddContractors from "../Pages/AddContractors";
import AddEmployees from "../Pages/AddEmployees";
import AddEvents from "../Pages/AddEvents";
import AddLocation from "../Pages/AddLocation";
import AddTask from "../Pages/AddNewTask";
import Contact from "../Pages/Contact";
import Contractors from "../Pages/Contractors";
import Dashboard from "../Pages/Dashboard";
import EmployeeHoursDayReport from "../Pages/EmployeeHoursDayReport";
import EmployeeHoursWeekReport from "../Pages/EmployeeHoursWeekReport";
import Employees from "../Pages/Employees";
import EmployeeScheduleReport from "../Pages/EmployeeScheduleReport";
import Events from "../Pages/Events";
import Locations from "../Pages/Locations";
import LocationScheduleReport from "../Pages/LocationScheduleReport";
import Login from "../Pages/Login";
import MySchedule from "../Pages/MySchedule";
import Reports from "../Pages/Reports";
import Schedules from "../Pages/Schedules";
import Settings from "../Pages/Settings";
import SmsInfo from "../Pages/SmsInfo";

const routes = [
  { path: "/", element: Dashboard },
  { path: "/dashboard", element: Dashboard },
  { path: "/reports", element: Reports },
  { path: "/reports/employee-schedules", element: EmployeeScheduleReport },
  { path: "/reports/location-schedules", element: LocationScheduleReport },
  // { path: "/reports/employee-hours-day", element: EmployeeHoursDayReport },
  { path: "/reports/employee-hours-week", element: EmployeeHoursWeekReport },
  { path: "/employees", element: Employees },
  { path: "/employees/add", element: AddEmployees },
  { path: "/employees/add/:id", element: AddEmployees },
  { path: "/events", element: Events },
  { path: "/events/add", element: AddEvents },
  { path: "/events/add/:id", element: AddEvents },
  { path: "/schedules", element: Schedules },
  { path: "/schedules/new-task", element: AddTask },
  { path: "/schedules/new-task/:id", element: AddTask },
  { path: "/sms-info", element: SmsInfo },
  { path: "/locations", element: Locations },
  { path: "/locations/add", element: AddLocation },
  { path: "/locations/add/:id", element: AddLocation },
  { path: "/contractors", element: Contractors },
  { path: "/contractors/details", element: AddContractors },
  { path: "/contractors/details/:id", element: AddContractors },
  { path: "/mySchedule", element: MySchedule },
  { path: "/contact", element: Contact },
  { path: "/settings", element: Settings },
];

export default routes;
