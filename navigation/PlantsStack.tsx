import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlantsScreen from "../screens/PlantsScreen";
import type { PlantsStackParamList } from "./types";

const Stack = createNativeStackNavigator<PlantsStackParamList>();

export default function PlantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="PlantsList"
                component={PlantsScreen}
                options={{ title: "Meine Pflanzen" }}
            />
        </Stack.Navigator>
    );
}