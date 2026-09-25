import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types/Task";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = {
    task: Task;
    growName?: string;
    onPress?: () => void; 
};

export default function TaskCard({task, growName, onPress}: Props) {
    return (
        <Pressable
            style={[
                styles.container, 
                task.completed && styles.completed,
            ]}
            onPress={onPress}
        >
            <View style={styles.content}>
                <View style={styles.titleRow}>
                <Text style={[
                    styles.title,
                    task.completed && styles.completedText,
                ]}>
                    {task.title}
                </Text>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {task.status}
                        </Text>
                    </View>
                </View>

                {growName && (
                    <Text style={styles.cardText}>{growName}</Text>
                )}
                <Text style={styles.cardText}>
                    Fällig: {task.dueDate.toLocaleDateString("de-DE")}
                </Text>
                <Text style={styles.cardText}>
                    Dringlichkeit: {task.urgency}
                </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    content: {
        gap: Spacing.sm,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: Spacing.sm,
    },
    title: {
        fontSize: Typography.body,
        fontWeight: "600",
        color: Colors.text,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.sm,
        backgroundColor: Colors.background,
    },
    statusText: {
        fontSize: Typography.caption,
        fontWeight: "600",
        color: Colors.text,
    },
    cardText: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
    completed: {
        opacity: 0.6,
    },
    completedText: {
        textDecorationLine: "line-through",
    },
});