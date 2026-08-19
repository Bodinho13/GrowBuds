import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import { PlantsStackParamList } from "../navigation/types";
import { usePlant } from "../hooks/usePlant";
import { useServices } from "../services/ServicesContext";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { EmptyState, LoadingView } from "../components/common";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = NativeStackScreenProps<PlantsStackParamList, "EditPlant">;

export default function EditPlantScreen ({route, navigation}: Props) {
    const {plantId} = route.params;
    const {plant, loading} = usePlant(plantId);
    const {plantService} = useServices();

    const [name, setName] = useState("");
    const [strain, setStrain] = useState("");
    const [cross, setCross] = useState("");
    const [breeder, setBreeder] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(!plant)
            return;
        
        setName(plant.name);
        setStrain(plant.strain ?? "");
        setCross(plant.cross ?? "");
        setBreeder(plant.breeder ?? "");
        setNotes(plant.notes ?? "");
    }, [plant]);

    async function handleSave() {
        if(!name.trim()) {
            Alert.alert("Fehler", "Bitte gib einen Namen für die Pflanze ein.");
            return;
        }

        try {
            setSaving(true);

            const updatedPlant = await plantService.update(
                plantId, {
                    name: name.trim(),
                    strain: strain.trim() || undefined,
                    cross: cross.trim() || undefined,
                    breeder: breeder.trim() || undefined,
                    notes: notes.trim() || undefined,
                },
            );
            if(!updatedPlant){
                Alert.alert("Fehler", "Die Pflanze konnte nicht aktualisiert werden.");
                return;
            }
            navigation.goBack();
        } catch (error) {
            console.error("Failed to update plant:", error);
            Alert.alert("Fehler", "Die Pflanze konnte nicht aktualisiert werden");
        } finally {
            setSaving(false);
        }
    }

    if(loading)
        return <LoadingView/>;

    if(!plant)
        return <EmptyState message="Pflanze wurde nicht gefunden." />;

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name der Pflanze"
                />

                <Text style={styles.label}>Typ</Text>
                <TextInput
                    style={styles.input}
                    value={strain}
                    onChangeText={setStrain}
                    placeholder="Sativa / Indica"
                />

                <Text style={styles.label}>Kreuzung</Text>
                <TextInput
                    style={styles.input}
                    value={cross}
                    onChangeText={setCross}
                    placeholder="z.B A x B"
                />

                <Text style={styles.label}>Züchter</Text>
                <TextInput
                    style={styles.input}
                    value={breeder}
                    onChangeText={setBreeder}
                    placeholder="z.B. Cookies"
                />

                <Text style={styles.label}>Notizen</Text>
                <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Notizen"
                    multiline
                />

                <Pressable
                    style={styles.button}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <Text style={styles.buttonText}>{saving ? "Speichern..." : "Änderungen speichern"}</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
    label: {
        fontSize: Typography.body,
        fontWeight: "bold",
        marginBottom: Spacing.xs,
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        fontSize: Typography.body,
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    notesInput: {
        minHeight: 120,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: "center",
        marginTop: Spacing.md,
    },
    buttonText: {
        color: Colors.surface,
        fontSize: Typography.body,
        fontWeight: "bold",
    },
})