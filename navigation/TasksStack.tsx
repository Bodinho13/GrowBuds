import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TaskStackParamList } from "./types";
import TasksScreen from "../screens/TasksScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";

const Stack = createNativeStackNavigator<TaskStackParamList>();

export default function TasksStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TasksList"
                component={TasksScreen}
                options={{title: "Aufgaben"}}
            />
            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{title: "Aufgabe"}}
            />
        </Stack.Navigator>
    );
}