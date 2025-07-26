import React from "react";
import ReactDOM from "react-dom/client";
import Routing from "./routes/Routing";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./Redux/store";
import { Toaster } from "./components/ui/toaster.jsx";
import "./index.css";

// Mount the app to the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Delay rendering until persisted state has been retrieved */}
    <PersistGate loading={null} persistor={persistor}>
      {/* Main routing and page rendering */}
      <Routing />
      {/* Global toast notification handler */}
      <Toaster />
    </PersistGate>
  </React.StrictMode>
);
