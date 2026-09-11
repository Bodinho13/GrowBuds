import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TaskStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { ScrollView, Text, View } from "react-native";

type Props = NativeStackScreenProps<TaskStackParamList, "TaskDetail">;

export default function TaskDetailScreen({route, navigation}: Props) {
    const {taskId, relatedName} = route.params;
    const {taskService} = useServices();

    return(
        <ScrollView>
            <View>
                <Text>Aufgabe</Text>
            </View>
        </ScrollView>
    );
}