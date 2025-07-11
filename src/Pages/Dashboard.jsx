import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationsDashboard } from "../redux/slices/locationsSlice";
import { fetchDashboardData } from "../redux/slices/eventSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboardLocationsData, locationLoading, locationError } =
    useSelector((state) => state.locations);

  const {
    totalSchedules,
    totalEmployees,
    totalLocations,
    totalContractors,
    overworkedEmployees,
  } = useSelector((state) => state.events);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return {
      bg: `rgba(${r}, ${g}, ${b}, 0.1)`,
      text: `rgba(${r}, ${g}, ${b}, 1)`,
    };
  };

  useEffect(() => {
    dispatch(fetchLocationsDashboard());
    dispatch(fetchDashboardData());
  }, []);

  const DashboardStats = [
    { title: "Tasks in Progress", count: totalSchedules, color: "red" },
    { title: "Employees", count: totalEmployees, color: "blue" },
    { title: "Total Locations", count: totalLocations, color: "green" },
    { title: "Contractors", count: totalContractors, color: "purple" },
    {
      title: "Employees over 40 hours this week",
      count: overworkedEmployees.length,
      color: "pink",
    },
  ];

  return (
    <div className="flex gap-4 ">
      {/* Main Dashboard Content */}
      <div className="flex-grow">
        <div className="h-140 p-6 rounded-lg shadow-sm bg-white">
          {/* Table Header */}
          <div className="flex justify-between text-gray-500 font-semibold text-sm pb-3 border-b border-gray-200">
            <span>Location Address</span>
            <span>No. of Employees Assigned</span>
          </div>

          {/* Table Rows */}
          <div className="mt-3 max-h-120 overflow-y-auto custom-scrollbar space-y-2">
            {dashboardLocationsData?.map((location, index) => {
              const { bg, text } = getRandomColor();

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    index % 2 === 0 ? "bg-[#F8FAFB]" : "bg-white"
                  }`}
                >
                  <span className="text-gray-800 text-sm">
                    {`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.postal_code}`}
                  </span>
                  <span
                    style={{
                      backgroundColor: bg,
                      color: text,
                    }}
                    className="text-gray-800 font-semibold rounded-full px-3 py-1 text-sm"
                  >
                    {location.total_employees}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel (Only in Dashboard) */}
      <div className="flex-none w-1/3 max-w-md min-w-[220px] bg-white border-l border-gray-200 p-4">
        <div className="h-full bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
            {DashboardStats.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative h-21 rounded-lg shadow-sm pl-4 pt-4 bg-[#f5f6f7] overflow-hidden"
                >
                  {/* Circle at the top-right corner */}
                  <div
                    style={{ backgroundColor: item.color, opacity: 0.3 }}
                    className={`absolute top-1 right-1 w-17 h-17 bg-${item.color}-300 transform translate-x-1/2 -translate-y-1/2 rounded-full`}
                  ></div>
                  <span className="font-medium text-[14px] leading-[17.07px] tracking-[0px] text-gray-400">
                    {" "}
                    {item.title}
                  </span>
                  <h1 className="font-bold mt-1 text-[23px]">
                    {" "}
                    {Number(item.count)}
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
