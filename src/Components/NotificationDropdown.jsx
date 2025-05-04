const NotificationDropdown = ({ notifications }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-xl ring-1 ring-gray-200 overflow-hidden z-50 backdrop-blur-lg">
    <div className="p-4 border-b font-semibold text-gray-700">
      Notifications
    </div>
    <div className="max-h-60 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">No new notifications</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-all duration-150`}
          >
            <div
              className={`mt-1 w-3 h-3 rounded-full ${
                n.type === "confirmed" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <div className="text-sm text-gray-800 leading-snug">
              <span className="font-semibold capitalize">
                {n.type === "confirmed" ? "Confirmed" : "Declined"}:
              </span>{" "}
              {n.name}: {n.location}, {n.date}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default NotificationDropdown;
