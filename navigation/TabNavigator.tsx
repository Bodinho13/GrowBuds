import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/DashboardScreen";
import PlantsScreen from "../screens/PlantsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import TasksScreen from "../screens/TasksScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
            />

            <Tab.Screen 
                name="Pflanzen"
                component={PlantsScreen}
            />

            <Tab.Screen 
                name="Kalender"
                component={CalendarScreen}
            />

            <Tab.Screen 
                name="Aufgaben"
                component={TasksScreen}
            />

            <Tab.Screen 
                name="Einstellungen"
                component={SettingsScreen}
            />
        </Tab.Navigator>
    );
}