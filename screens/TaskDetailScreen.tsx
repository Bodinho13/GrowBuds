import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TaskStackParamList } from "../navigation/types";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTask } from "../hooks/useTask";
import { EmptyState, LoadingView, Section } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { useServices } from "../services/ServicesContext";

type Props = NativeStackScreenProps<TaskStackParamList, "TaskDetail">;

export default function TaskDetailScreen({ route, navigation }: Props) {
    const { taskId, relatedName } = route.params;
    const { taskService } = useServices();
    const { task, loading, refresh } = useTask(taskId);

    if (loading) return <LoadingView />;

    if (!task) return <EmptyState message="Aufgabe nicht gefunden." />;

    async function handleComplete() {
        await taskService.complete(taskId);
        await refresh();
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{task.title}</Text>
                {relatedName && (
                    <Text style={styles.relatedName}>{relatedName}</Text>
                )}
            </View>

            <Section title="Allgemein">
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fällig</Text>
                    <Text style={styles.value}>
                        {task.dueDate.toLocaleDateString("de-DE")}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Dringlichkeit</Text>
                    <Text style={styles.value}>{task.urgency}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>
                        {task.completed ? "Erledigt" : task.status}
                    </Text>
                </View>
            </Section>

            {task.recurrence && (
                <Section title="Wiederholung">
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Intervall</Text>
                        <Text style={styles.value}>
                            Alle {task.recurrence?.interval}{" "}
                            {task.recurrence?.unit === "day"
                                ? "Tage"
                                : "Wochen"}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Erneut öffnen</Text>
                        <Text style={styles.value}>
                            {task.recurrence.timeToReopen} %
                        </Text>
                    </View>
                    {task.lastCompletedAt && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Zuletzt erledigt</Text>
                            <Text style={styles.value}>
                                {task.lastCompletedAt.toLocaleDateString(
                                    "de-DE",
                                )}
                            </Text>
                        </View>
                    )}
                </Section>
            )}

            {!task.completed && (
                <Pressable
                    style={styles.completeButton}
                    onPress={handleComplete}
                >
                    <Text style={styles.completeButtonText}>Erledigen ✓</Text>
                </Pressable>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    header: {
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.title,
        fontWeight: "bold",
        color: Colors.text,
        textAlign: "center",
    },
    relatedName: {
        marginTop: Spacing.xs,
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Spacing.sm,
    },
    label: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
    value: {
        fontSize: Typography.body,
        fontWeight: "600",
        color: Colors.text,
    },
    completeButton: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        padding: Spacing.md,
        alignItems: "center",
        marginTop: Spacing.md,
    },
    completeButtonText: {
        color: Colors.surface,
        fontSize: Typography.body,
        fontWeight: "600",
    },
});
