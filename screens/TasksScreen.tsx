import { View, Text, StyleSheet, FlatList } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";
import { useTasks } from "../hooks/useTasks";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = BottomTabScreenProps<TabParamList, "Aufgaben">;

export default function TasksScreen({}: Props) {
    const {tasks, loading, refresh} = useTasks();

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );
    
    if(loading)
        return <LoadingView/>

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Meine Aufgaben
            </Text>

            {tasks.length === 0 ? (
                <EmptyState
                    message="Keine Aufgaben vorhanden."
                />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={styles.task}>
                            <Text style={styles.taskTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.taskText}>
                                Fällig: {item.dueDate.toLocaleDateString()}
                            </Text>
                            <Text style={styles.taskText}>
                                Priorität: {item.urgency}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: Typography.heading,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    task: {
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
    },
    taskTitle: {
        fontSize: Typography.body,
        fontWeight: "600",
        color: Colors.text,
    },
    taskText: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
        marginTop: Spacing.sm,
    },
});