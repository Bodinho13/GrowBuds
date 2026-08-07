import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlantsScreen from "../screens/PlantsScreen";
import type { PlantsStackParamList } from "./types";
import PlantDetailScreen from "../screens/PlantDetailScreen";

const Stack = createNativeStackNavigator<PlantsStackParamList>();

export default function PlantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="PlantsList"
                component={PlantsScreen}
                options={{ title: "Meine Pflanzen" }}
            />
            <Stack.Screen
                name="PlantDetail"
                component={PlantDetailScreen}
                options={{ title: "Meine Pflanze" }}
            />
        </Stack.Navigator>
    );
}