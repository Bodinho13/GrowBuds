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

type Props = NativeStackScreenProps<GrowStackParamList, "GrowsList">;

export default function GrowsScreen({ navigation }: Props) {
    const { plantService } = useServices();
    const { grows, loading, refresh } = useGrows();

    const activeGrows = grows.filter((grow) => !grow.isArchived);
    const archivedGrows = grows.filter((grow) => grow.isArchived);

    const [plantNames, setPlantNames] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadPlantNames() {
            const plants = await plantService.getAll();
            setPlantNames(createPlantNameLookup(plants));
        }

        loadPlantNames();
    }, [plantService]);

    const sections = [
        {
            title: "Aktive Grows",
            data: activeGrows,
        },
        {
            title: "Archivierte Grows",
            data: archivedGrows,
        },
    ];

    useFocusEffect(
        useCallback(() => {
            refresh();
        },[refresh])
    );

    if(loading)
        return <LoadingView />
    
    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <GrowCard grow={item}
                        plantName={plantNames[item.plantId]}
                        onPress={() => {
                            navigation.navigate("GrowDetail", {
                                growId: item.id,
                                plantName: plantNames[item.plantId],
                            })
                        }}
                    />
                )}
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