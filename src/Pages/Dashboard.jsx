import React from "react";

const Dashboard = () => {
  // Sample Data
  const locations = [
    { address: "123 Main St, New York, NY", employees: 10 },
    { address: "456 Elm St, Los Angeles, CA", employees: 8 },
    { address: "789 Oak St, Chicago, IL", employees: 12 },
    { address: "123 Main St, New York, NY", employees: 10 },
    { address: "456 Elm St, Los Angeles, CA", employees: 8 },
    { address: "789 Oak St, Chicago, IL", employees: 12 },
    { address: "123 Main St, New York, NY", employees: 10 },
    { address: "456 Elm St, Los Angeles, CA", employees: 8 },
    { address: "789 Oak St, Chicago, IL", employees: 12 },
    { address: "123 Main St, New York, NY", employees: 10 },
    { address: "456 Elm St, Los Angeles, CA", employees: 8 },
    { address: "789 Oak St, Chicago, IL", employees: 12 },
  ];

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return {
      bg: `rgba(${r}, ${g}, ${b}, 0.1)`,
      text: `rgba(${r}, ${g}, ${b}, 1)`,
    };
  };
  return (
    <div className="flex gap-4 ">
      {/* Main Dashboard Content */}
      <div className="flex-grow">
        {/* <h1 className="text-2xl font-bold text-gray-800 mb-2 pl-0">
          Dashboard
        </h1>
        <span className="font-semibold text-gray-500 text-[12px] leading-[14.63px] tracking-[0px]">
          Home/Dashboard
        </span> */}
        <div className="h-140 p-6 rounded-lg shadow-sm bg-white">
          {/* Table Header */}
          <div className="flex justify-between text-gray-500 font-semibold text-sm pb-3 border-b border-gray-200">
            <span>Location Address</span>
            <span>No. of Employees Assigned</span>
          </div>

          {/* Table Rows */}
          <div className="mt-3 max-h-120 overflow-y-auto custom-scrollbar space-y-2">
            {locations.map((location, index) => {
              const { bg, text } = getRandomColor();

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    index % 2 === 0 ? "bg-[#F8FAFB]" : "bg-white"
                  }`}
                >
                  <span className="text-gray-800 text-sm">
                    {location.address}
                  </span>
                  <span
                    style={{
                      backgroundColor: bg,
                      color: text,
                    }}
                    className="text-gray-800 font-semibold rounded-full px-3 py-1 text-sm"
                  >
                    {location.employees}
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
            {[
              { title: "Tasks in Progress", count: 146, color: "red" },
              { title: "Employees", count: 146, color: "blue" },
              { title: "Total Locations", count: 146, color: "green" },
              { title: "Contractors", count: 146, color: "purple" },
              {
                title: "Employeers over 40 hours this week",
                count: 146,
                color: "pink",
              },
            ].map((item) => (
              <div
                key={item}
                className="relative h-25 rounded-lg shadow-sm pl-4 pt-4 bg-[#f1f6fb] overflow-hidden"
              >
                {/* Circle at the top-right corner */}
                <div
                  className={`absolute top-1 right-1 w-17 h-17 bg-${item.color}-300 transform translate-x-1/2 -translate-y-1/2 rounded-full`}
                ></div>
                <span className="font-medium text-[14px] leading-[17.07px] tracking-[0px] text-gray-400">
                  {" "}
                  {item.title}
                </span>
                <h1 className="font-bold mt-1 text-[23px]"> {item.count}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
