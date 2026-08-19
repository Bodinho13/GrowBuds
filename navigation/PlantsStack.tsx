import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlantsScreen from "../screens/PlantsScreen";
import type { PlantsStackParamList } from "./types";
import PlantDetailScreen from "../screens/PlantDetailScreen";
import CreatePlantScreen from "../screens/CreatePlantScreen";
import EditPlantScreen from "../screens/EditPlantScreen";

const Stack = createNativeStackNavigator<PlantsStackParamList>();

export default function PlantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="PlantsList"
                component={PlantsScreen}
                options={{ title: "Pflanzen" }}
            />
            <Stack.Screen
                name="PlantDetail"
                component={PlantDetailScreen}
                options={{ title: "Details" }}
            />
            <Stack.Screen
                name="CreatePlant"
                component={CreatePlantScreen}
                options={{ title: "Neue Pflanze" }}
            />
            <Stack.Screen
                name="EditPlant"
                component={EditPlantScreen}
                options={{ title: "Pflanze bearbeiten" }}
            />
        </Stack.Navigator>
    );
}