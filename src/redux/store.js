import { configureStore } from "@reduxjs/toolkit";
import locationsReducer from "./slices/locationsSlice";
import contractorsReducer from "./slices/contractorsSlice";
import employeesReducer from "./slices/employeeSlice";
import dropDownReducer from "./slices/dropDownSlice";
import eventReducer from "./slices/eventSlice";
import scheduleReducer from "./slices/scheduleSlice";
import authSliceReducer from "./slices/authSlice";
import userSliceReducer from "./slices/userSlice";
import reportsSliceReducer from "./slices/reportsSlice";

const store = configureStore({
  reducer: {
    locations: locationsReducer,
    contractors: contractorsReducer,
    employees: employeesReducer,
    dropDownList: dropDownReducer,
    events: eventReducer,
    schedules: scheduleReducer,
    auth: authSliceReducer,
    user: userSliceReducer,
    report: reportsSliceReducer,
  },
});

export default store;
