import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { GrowStackParamList } from "./types";

import GrowsScreen from "../screens/GrowsScreen";
import GrowDetailScreen from "../screens/GrowDetailScreen";
import CreateGrowScreen from "../screens/CreateGrowScreen";

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
                options={{ title: "Grow" }}
            />

            <Stack.Screen
                name="CreateGrow"
                component={CreateGrowScreen}
                options={{ title: "Neuer Grow" }}
            />
        </Stack.Navigator>
    );
}