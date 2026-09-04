import { View, Text, StyleSheet, FlatList } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";
import { useTasks } from "../hooks/useTasks";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { useServices } from "../services/ServicesContext";
import { createGrowNameLookup } from "../services/grows/growLookUp";
import TaskCard from "../components/TaskCard";

type Props = BottomTabScreenProps<TabParamList, "Aufgaben">;

export default function TasksScreen({}: Props) {
    const {growService} = useServices();
    const {tasks, loading, refresh} = useTasks();

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
                        <TaskCard
                            task={item}
                            growName={growNames[item.growId]}
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
    title: {
        fontSize: Typography.heading,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: Spacing.md,
    },
});