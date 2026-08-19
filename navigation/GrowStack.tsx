import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { GrowStackParamList } from "./types";

import GrowsScreen from "../screens/GrowsScreen";
import GrowDetailScreen from "../screens/GrowDetailScreen";
import CreateGrowScreen from "../screens/CreateGrowScreen";
import EditGrowScreen from "../screens/EditGrowScreen";

const Stack = createNativeStackNavigator<GrowStackParamList>();

export default function GrowsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="GrowsList"
                component={GrowsScreen}
                options={{ title: "Grows" }}
            />

            <Stack.Screen
                name="GrowDetail"
                component={GrowDetailScreen}
                options={{ title: "Details" }}
            />

            <Stack.Screen
                name="CreateGrow"
                component={CreateGrowScreen}
                options={{ title: "Neuer Grow" }}
            />

            <Stack.Screen
                name="EditGrow"
                component={EditGrowScreen}
                options={{ title: "Grow bearbeiten" }}
            />
        </Stack.Navigator>
    );
}