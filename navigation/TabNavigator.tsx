import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/DashboardScreen";
import CalendarScreen from "../screens/CalendarScreen";
import TasksScreen from "../screens/TasksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PlantsStack from "./PlantsStack";
import GrowsStack from "./GrowStack";

import type { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
            />

            <Tab.Screen 
                name="Pflanzen"
                component={PlantsStack}
                options={{ headerShown: false }}
            />

            <Tab.Screen
                name="Grows"
                component={GrowsStack}
                options={{ headerShown: false }}
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