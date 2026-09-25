import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { Task } from "../types/Task";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = {
    task: Task;
    growName?: string;
    onEdit?: () => void;
    onInfo?: () => void;
    onComplete?: () => void;
};

export default function TaskCard({
    task,
    growName,
    onEdit,
    onInfo,
    onComplete,
}: Props) {
    const [expanded, setExpanded] = useState(false);

    const handleCardPress = () => {
        setExpanded((current) => !current);
    };

    return (
        <View style={[styles.container, task.completed && styles.completed]}>
            <Pressable onPress={handleCardPress}>
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.title,
                                task.completed && styles.completedText,
                            ]}
                        >
                            {task.title}
                        </Text>

                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{task.status}</Text>
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

            {expanded && (
                <View style={styles.actionMenu}>
                    <Pressable style={styles.actionButton} onPress={onEdit}>
                        <Text style={styles.actionIcon}>⚙</Text>
                        <Text style={styles.actionText}>Bearbeiten</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={onInfo}>
                        <Text style={styles.actionIcon}>ℹ</Text>
                        <Text style={styles.actionText}>Info</Text>
                    </Pressable>
                    {!task.completed && (
                        <Pressable
                            style={styles.actionButton}
                            onPress={onComplete}
                        >
                            <Text style={styles.actionIcon}>✓</Text>
                            <Text style={styles.actionText}>Abschließen</Text>
                        </Pressable>
                    )}
                </View>
            )}
        </View>
    );
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
    actionMenu: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    actionButton: {
        flex: 1,
        alignItems: "center",
        gap: Spacing.xs,
    },
    actionIcon: {
        fontSize: 20,
        color: Colors.text,
    },
    actionText: {
        fontSize: Typography.caption,
        color: Colors.text,
    },
    completed: {
        opacity: 0.6,
    },
    completedText: {
        textDecorationLine: "line-through",
    },
});
