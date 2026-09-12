import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TaskStackParamList } from "../navigation/types";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTask } from "../hooks/useTask";
import { EmptyState, LoadingView, Section } from "../components/common";
import { Colors, Spacing, Typography } from "../theme";

type Props = NativeStackScreenProps<TaskStackParamList, "TaskDetail">;

export default function TaskDetailScreen({ route, navigation }: Props) {
    const { taskId, relatedName } = route.params;
    const { task, loading } = useTask(taskId);

    if (loading) return <LoadingView />;

    if (!task) return <EmptyState message="Aufgabe nicht gefunden." />;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{task.title}</Text>
            </View>

            <Section title="Allgemein">
                <View>
                    <Text>Fällig:</Text>
                    <Text>{task.dueDate.toLocaleDateString("de-DE")}</Text>
                </View>

                <View>
                    <Text>Dringlichkeit:</Text>
                    <Text>{task.urgency}</Text>
                </View>

                <View>
                    <Text>Status:</Text>
                    <Text>{task.completed ? "Erledigt" : "Offen"}</Text>
                </View>
            </Section>

            <Section title="Intervall">
                <Text>Wiederholen in:</Text>
                <Text>
                    {task.recurrence?.interval}{" "}
                    {task.recurrence?.unit === "day" ? "Tage" : "Wochen"}
                </Text>
            </Section>

            {!task.completed && <Button title="Erledigen" onPress={() => {}} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.title,
        fontWeight: "bold",
        color: Colors.text,
    },
});
