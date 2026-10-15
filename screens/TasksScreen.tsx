import { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import type { TaskStackParamList } from "../navigation/types";
import { useTasks } from "../hooks/useTasks";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { useServices } from "../services/ServicesContext";
import { createGrowNameLookup } from "../services/grows/growLookUp";
import TaskCard from "../components/TaskCard";

type Props = NativeStackScreenProps<TaskStackParamList, "TasksList">;

export default function TasksScreen({ navigation }: Props) {
    const { growService, taskService } = useServices();
    const { tasks, archivedTasks, loading, refresh } = useTasks();

    const [growNames, setGrowNames] = useState<Record<string, string>>({});
    const [archiveExpanded, setArchiveExpanded] = useState(false);

    useEffect(() => {
        async function loadGrowNames() {
            const grows = await growService.getAll();
            setGrowNames(createGrowNameLookup(grows));
        }

        loadGrowNames();
    }, [growService]);

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh]),
    );

    async function handleComplete(taskId: string) {
        await taskService.complete(taskId);
        await refresh();
    }

    async function handleArchive(taskId: string) {
        try {
            const archivedTask = await taskService.archive(taskId);

            if (!archivedTask) {
                Alert.alert(
                    "Archivieren fehlgeschlagen",
                    "Die Aufgabe konnte nicht archiviert werden.",
                );
                return;
            }

            await refresh();
        } catch (e) {
            console.error(e);
            Alert.alert(
                "Fehler",
                "Beim Archivieren der Aufgabe ist ein Fehler aufgetreten.",
            );
        }
    }

    if (loading) return <LoadingView />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meine Aufgaben</Text>
                <Pressable
                    style={styles.addButton}
                    onPress={() => navigation.navigate("CreateTask")}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        growName={
                            item.growId ? growNames[item.growId] : undefined
                        }
                        onEdit={() =>
                            navigation.navigate("EditTask", {
                                taskId: item.id,
                            })
                        }
                        onInfo={() =>
                            navigation.navigate("TaskDetail", {
                                taskId: item.id,
                                relatedName: item.growId
                                    ? growNames[item.growId]
                                    : "Grow-Gruppe",
                            })
                        }
                        onComplete={() => handleComplete(item.id)}
                        onArchive={() => handleArchive(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <EmptyState message="Keine Aufgaben vorhanden." />
                }
                ListFooterComponent={
                    <View style={styles.archiveSection}>
                        <Pressable
                            style={styles.archiveHeader}
                            onPress={() => setArchiveExpanded((current) => !current)}
                        >
                            <Text style={styles.archiveTitle}>Archivierte Aufgaben({archivedTasks.length})</Text>
                            <Text style={styles.archiveToggle}>{archiveExpanded ? "-" : "+"}</Text>
                        </Pressable>

                        {archiveExpanded && (
                            <View style={styles.archiveList}>
                                {archivedTasks.length === 0 ? (
                                    <Text style={styles.archiveEmpty}>
                                        Keine archivierten Aufgaben vorhanden.
                                    </Text>
                                ) : (
                                    archivedTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            growName={task.growId ? growNames[task.growId] : undefined}
                                        />
                                    ))
                                )}
                            </View>
                        )}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.heading,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
    },
    addButtonText: {
        fontSize: Typography.title,
        color: Colors.background,
        lineHeight: 32,
    },
    archiveSection: {
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    archiveHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
    },
    archiveTitle: {
        fontSize: Typography.body,
        fontWeight: "600",
        color: Colors.text,
    },
    archiveToggle: {
        fontSize: Typography.title,
        color: Colors.text,
    },
    archiveList: {
        marginTop: Spacing.md,
    },
    archiveEmpty: {
        padding: Spacing.md,
        color: Colors.textSecondary,
        fontSize: Typography.body,
    },
});
