import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GrowStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { useGrows } from "../hooks/useGrows";
import { EmptyState, LoadingView, Section } from "../components/common";
import { useCallback, useEffect, useState } from "react";
import { GrowGroup } from "../types/GrowGroup";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Radius, Spacing, Typography } from "../theme";
import GrowCard from "../components/GrowCard";
import { createPlantNameLookup } from "../services/plants/plantLookup";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowGroupDetail">;

export default function GrowGroupDetailScreen({route, navigation}: Props){
    const {growGroupService, plantService} = useServices();
    const {grows, loading: growsLoading, refresh} = useGrows();

    const {growGroupId} = route.params;

    const [growGroup, setGrowGroup] = useState<GrowGroup | undefined>();
    const [groupLoading, setGroupLoading] = useState(true);
    const [plantNames, setPlantNames] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadPlantNames() {
            const plants = await plantService.getAll();
            setPlantNames(createPlantNameLookup(plants));
        }

        loadPlantNames();
    }, [plantService]);

    const loadGrowGroup = useCallback(async () => {
        setGroupLoading(true);
        try {
            const result = await growGroupService.getById(growGroupId);
            setGrowGroup(result);
        } catch(error) {
            console.error("Error loading the group", error);
        } finally {
            setGroupLoading(false);
        }
    }, [growGroupId, growGroupService]);

    useFocusEffect(useCallback(() => {
        loadGrowGroup();
        refresh();
    }, [loadGrowGroup, refresh]));

    const groupGrows = grows.filter(
        (grow) => grow.growGroupId === growGroupId
    );

    if(groupLoading || growsLoading)
        return <LoadingView/>;

    if(!growGroup)
        return <EmptyState message="Grow-Gruppe nicht gefunden."/>;

    return(
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{growGroup.name}</Text>
                <Text style={styles.description}>
                    {groupGrows.length}{" "}
                    {groupGrows.length === 1 ? "Grow" : "Grows"}
                </Text>
            </View>

            <Section title="Zugehörige Grows">
                {groupGrows.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Dieser Gruppe sind noch keine Grows zugeordnet.
                    </Text>
                ) : (
                    groupGrows.map((grow) => (
                        <GrowCard
                            key={grow.id}
                            grow={grow}
                            plantName={plantNames[grow.plantId] ?? "Unbekannte Pflanze"}              
                            onPress={() => {
                                navigation.navigate("GrowDetail", {
                                    growId: grow.id,
                                    plantName: plantNames[grow.plantId] ?? "Unbekannte Pflanze",
                                })
                            }}        
                        />
                    ))
                )}
            </Section>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flexGrow: 1,
        padding: Spacing.md,
    },
    header: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography.title,
        fontWeight: "bold",
        color: Colors.text,
    },
    description: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
    emptyText: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
});