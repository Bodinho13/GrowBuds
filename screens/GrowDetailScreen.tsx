import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { usePlant } from "../hooks/usePlant";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { useServices } from "../services/ServicesContext";
import { Grow } from "../types/Grow";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowDetail">;

export default function GrowDetailScreen({route, navigation}: Props) {
    const { growId, plantName } = route.params;

    const { grow, loading } = useGrow(growId);
    const {growService} = useServices();
    
    if(loading)
        return <LoadingView/>;

    if(!grow)
        return <EmptyState message="Grow wurde nicht gefunden."/>

    async function handleArchive(grow: Grow){
        Alert.alert(
            "Grow archivieren",
            `Möchtest du "${grow?.name} - ${plantName}" wirklich archivieren?`,
            [{
                text: "Abbrechen",
                style: "cancel",
            }, {
                text: "Archivieren",
                style: "destructive",
                onPress: async () => {
                    try {
                        const archivedGrow = await growService.archive(grow.id);

                        if(!archivedGrow) {
                            Alert.alert("Fehler", "Der Grow konnte nicht archiviert werden.",);
                            return;
                        }
                        navigation.goBack();
                    } catch (error) {
                        console.error("Failed to archive grow:", error);
                        Alert.alert("Fehler", "Der Grow konnte nicht archiviert werden.");
                    }
                },
            },
            ],
        );
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{grow.name}</Text>

            {grow.isArchived && (
                <View style={styles.archivedInfo}>
                    <Text style={styles.archivedInfoTitle}>
                        Grow archiviert
                    </Text>
                    {grow.endDate && (
                        <Text style={{color: Colors.archivedTextSecondary}}>
                            Enddatum: {" "}{grow.endDate.toLocaleDateString("de-DE")}
                        </Text>
                    )}
                </View>
            )}

            <Text>Pflanze: {plantName}</Text>
            <Text>
                Startdatum:{" "}
                {grow.startDate.toLocaleDateString("de-DE")}
            </Text>

            <Text>Menge: {grow.amount}</Text>
            <Text>Phase: {grow.stage}</Text>
            <Text>Medium: {grow.medium}</Text>
            {grow.location && (
                <Text>Standort: {grow.location}</Text>
            )}
            {grow.weight !== undefined && (
                <Text>Gewicht: {grow.weight}</Text>
            )}

            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate("EditGrow", {growId: grow.id, plantName: plantName})}
            >
                <Text style={styles.buttonText}>Bearbeiten</Text>
            </Pressable>
            {!grow.isArchived && (
                <Pressable
                    style={[styles.button, styles.archiveButton]}
                    onPress={() => handleArchive(grow)}
                >
                    <Text style={[styles.buttonText, styles.archiveButtonText]}>Archivieren</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
    title: {
        fontSize: Typography.title,
        fontWeight: "bold",
        marginBottom: Spacing.md,
    },
    button: {
        padding: Spacing.md,
        borderRadius: Spacing.sm,
        alignItems: "center",
        marginTop: Spacing.md
    },
    buttonText: {
        fontSize: Typography.body,
        fontWeight: "bold",
    },
    archiveButton: {
        backgroundColor: Colors.error,
    },
    archiveButtonText: {
        color: Colors.surface,
    },
    archivedInfo: {
        backgroundColor: Colors.archivedBackground,
        borderWidth: 1,
        borderColor: Colors.archivedBorder,
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },
    archivedInfoTitle: {
        color: Colors.archivedText,
        fontSize: Typography.body,
        fontWeight: "bold",
        marginBottom: Spacing.xs,
    },
});