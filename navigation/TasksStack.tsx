import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TaskStackParamList } from "./types";
import TasksScreen from "../screens/TasksScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import EditTaskScreen from "../screens/EditTaskScreen";

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
            <Stack.Screen
                name="CreateTask"
                component={CreateTaskScreen}
                options={{title: "Aufgabe erstellen"}}
            />
            <Stack.Screen
                name="EditTask"
                component={EditTaskScreen}
                options={{title: "Aufgabe bearbeiten"}}
            />
        </Stack.Navigator>
    );
}