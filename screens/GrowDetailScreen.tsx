import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { usePlant } from "../hooks/usePlant";
import { EmptyState, LoadingView, Section } from "../components/common";
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
            `Möchtest du "${grow.name} - ${plantName}" wirklich archivieren?`,
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{grow.name}</Text>
                <Text style={styles.plantName}>{plantName}</Text>
            </View>

            {grow.isArchived && (
                <View style={styles.archivedInfo}>
                    <Text style={styles.archivedInfoTitle}>
                        Grow archiviert
                    </Text>
                    {grow.endDate && (
                        <Text style={styles.archivedInfoText}>
                            Enddatum: {" "}{grow.endDate.toLocaleDateString("de-DE")}
                        </Text>
                    )}
                </View>
            )}

            <Section title="Allgemein">
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Startdatum</Text>
                    <Text style={styles.value}>{grow.startDate.toLocaleDateString("de-DE")}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Menge</Text>
                    <Text style={styles.value}>{grow.amount}</Text>
                </View>
            </Section>

            <Section title="Anbau">
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Phase</Text>
                    <Text style={styles.value}>{grow.stage}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Medium</Text>
                    <Text style={styles.value}>{grow.medium}</Text>
                </View>

                {grow.location && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Standort</Text>
                        <Text style={styles.value}>{grow.location}</Text>
                    </View>
                )}
            </Section>

            {(grow.weight !== undefined) && (
                <Section title="Ergebnis">
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Gewicht</Text>
                        <Text style={styles.value}>{grow.weight}</Text>
                    </View>
                </Section>
            )}

            <Section title="Verwaltung">
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Erstellt am</Text>
                  <Text style={styles.value}>{grow.createdAt.toLocaleDateString("de-DE")}</Text>
                </View>
            
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Zuletzt geändert</Text>
                  <Text style={styles.value}>{grow.updatedAt.toLocaleDateString("de-DE")}</Text>
                </View>
            </Section>

            <View style={styles.actions}>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.title,
        fontWeight: "bold",
        color: Colors.text,
    },
    plantName: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: Spacing.xs,
    },
    label: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
        flex: 1,
    },
    value: {
        fontSize: Typography.body,
        color: Colors.text,
        fontWeight: "500",
        textAlign: "right",
        flex: 1,
    },
    actions: {
        marginTop: Spacing.sm,
    },
    button: {
        padding: Spacing.md,
        borderRadius: Spacing.sm,
        alignItems: "center",
        marginTop: Spacing.md,
        backgroundColor: Colors.primary,
    },
    buttonText: {
        fontSize: Typography.body,
        fontWeight: "bold",
        color: Colors.surface,
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
    archivedInfoText: {
        color: Colors.archivedTextSecondary,
        fontSize: Typography.body,
    },
});