import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import type { TaskStackParamList } from "../navigation/types";
import { useTasks } from "../hooks/useTasks";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Spacing, Typography } from "../theme";
import { useServices } from "../services/ServicesContext";
import { createGrowNameLookup } from "../services/grows/growLookUp";
import TaskCard from "../components/TaskCard";

type Props = NativeStackScreenProps<TaskStackParamList, "TasksList">;

export default function TasksScreen({ navigation }: Props) {
    const { growService } = useServices();
    const { tasks, loading, refresh } = useTasks();

    const [growNames, setGrowNames] = useState<Record<string, string>>({});

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

            {tasks.length === 0 ? (
                <EmptyState message="Keine Aufgaben vorhanden." />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskCard
                            task={item}
                            growName={
                                item.growId ? growNames[item.growId] : undefined
                            }
                        />
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
});
