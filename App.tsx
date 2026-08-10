import { useEffect } from "react";

import AppNavigator from "./navigation/AppNavigator";
import { initializeDatabase } from "./services/storage/database";

export default function App() {
  useEffect(() => {
    initializeDatabase().catch(error => {
      console.error("SQLite initialization failed:", error);
    });
  }, []);

  return <AppNavigator />;
}
