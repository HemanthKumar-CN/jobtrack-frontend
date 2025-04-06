import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { ToastProvider } from "./Components/Toast/ToastContext.jsx";
import { ModalProvider } from "./Components/Modal/ModalProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </Provider>,
  // </StrictMode>,
);
