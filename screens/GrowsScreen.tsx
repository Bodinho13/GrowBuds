import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GrowStackParamList } from "../navigation/types";
import { useGrows } from "../hooks/useGrows";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { LoadingView } from "../components/common";
import GrowCard from "../components/GrowCard";
import { useServices } from "../services/ServicesContext";
import { createPlantNameLookup } from "../services/plants/plantLookup";
import { useGrowGroups } from "../hooks/useGrowGroups";
import { GrowGroup } from "../types/GrowGroup";
import { Grow } from "../types/Grow";
import GrowGroupCard from "../components/GrowGroupCard";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowsList">;

type GrowSection = | {
    title: string;
    type: "group";
    data: GrowGroup[];
} | {
    title: string;
    type: "grow";
    data: Grow[];
};

export default function GrowsScreen({ navigation }: Props) {
    const { plantService } = useServices();
    const { grows, loading, refresh } = useGrows();
    const { growGroups, loading: groupsLoading, refresh: groupsRefresh } = useGrowGroups();

    const activeGrows = grows.filter((grow) => !grow.isArchived);
    const archivedGrows = grows.filter((grow) => grow.isArchived);

    const activeGroups = growGroups.filter((group) => !group.archivedAt);
    const archivedGroups = growGroups.filter((group) => group.archivedAt);

    const [plantNames, setPlantNames] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadPlantNames() {
            const plants = await plantService.getAll();
            setPlantNames(createPlantNameLookup(plants));
        }

        loadPlantNames();
    }, [plantService]);

    const sections: GrowSection[] = [
        {
            title: "Grow-Gruppen",
            data: activeGroups,
            type: "group" as const,
        },
        {
            title: "Aktive Grows",
            data: activeGrows,
            type: "grow" as const,
        },
        {
            title: "Archivierte Gruppen",
            data: archivedGroups,
            type: "group" as const,
        },
        {
            title: "Archivierte Grows",
            data: archivedGrows,
            type: "grow" as const,
        },
    ];

    useFocusEffect(
        useCallback(() => {
            refresh();
            groupsRefresh();
        },[refresh, groupsRefresh])
    );

    function getGrowCount(growGroupId: string): number {
        return grows.filter((grow) => grow.growGroupId === growGroupId).length;
    }

    if(loading || groupsLoading)
        return <LoadingView />
    
    return (
        <View style={styles.container}>
            <SectionList<Grow | GrowGroup, GrowSection>
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({item, section}) => {
                    if(section.type === "group"){
                        const growGroup = item as GrowGroup;

                        return(
                            <GrowGroupCard
                                growGroup={growGroup}
                                growCount={getGrowCount(growGroup.id)}
                            />
                        );
                    }
                    const grow = item as Grow;
                    return(
                        <GrowCard grow={grow}
                            plantName={plantNames[grow.plantId]}
                            onPress={() => {
                                navigation.navigate("GrowDetail", {
                                    growId: grow.id,
                                    plantName: plantNames[grow.plantId],
                            })
                        }}
                    />
                    )
                }}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionTitle}>
                        {section.title}
                    </Text>
                )}
                renderSectionFooter={({section}) => 
                    section.data.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Keine {section.title} vorhanden.
                        </Text>
                    ) : null
                }
            />
            <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateGrowGroup")}
            >
                <Text style={styles.createButtonText}>+ Neue Gruppe</Text>
            </Pressable>
            <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateGrow")}
            >
                <Text style={styles.createButtonText}>
                    + Neuer Grow
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    createButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: "center",
        marginTop: Spacing.md
    },
    createButtonText: {
        color: Colors.surface,
        fontSize: Typography.body,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: Typography.heading,
        fontWeight: "600",
        color: Colors.text,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
});