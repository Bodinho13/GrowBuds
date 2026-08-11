import AppNavigator from "./navigation/AppNavigator";
import { ServicesProvider } from "./services/ServicesContext";

export default function App() {
  return (
    <ServicesProvider>
      <AppNavigator />
    </ServicesProvider>
  );
}
