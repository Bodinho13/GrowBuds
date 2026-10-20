import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GrowStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = NativeStackScreenProps<GrowStackParamList, "CreateGrowGroup">;

export default function CreateGrowGroupScreen({navigation,}: Props) {
    const {growGroupService} = useServices();
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleCreate() {
        console.log("1. handler gestartet");
        const trimmedName = name.trim();
        console.log("2. Gruppenname:", trimmedName);

        if(!trimmedName || saving){
            console.log("Abbruch: Name leer oder Speichern läuft bereits");
            return;
        }

        setSaving(true);

        try {
            console.log("3. Rufe growGroupService.create auf");
            const result = await growGroupService.create({name: trimmedName,});

            console.log("4. Gruppe erstellt", result);
            navigation.goBack();
        } catch(error) {
            console.error("Fehler beim Erstellen der Grow-Gruppe:", error);
        } finally {
            console.log("5. Speichern beendet");
            setSaving(false);
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Gruppenname</Text>
                <TextInput
                    testID="grow-group-name-input"
                    value={name}
                    onChangeText={setName}
                    placeholder="Name der Gruppe"
                    style={styles.input}
                    maxLength={100}
                    returnKeyType="done"
                    onSubmitEditing={handleCreate}
                />

                <Pressable
                    testID="create-grow-group-button"
                    style={[styles.button,
                        (!name.trim() || saving) && styles.buttonDisabled,
                    ]}
                    onPress={handleCreate}
                    disabled={!name.trim() || saving}
                >
                    <Text style={styles.buttonText}>
                        {saving ? "Wird erstellt..." : "Gruppe anlegen"}
                    </Text>
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
        marginBottom: Spacing.md,
        color: Colors.text,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: "center",
        marginTop: Spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.surface,
        fontSize: Typography.body,
        fontWeight: "bold",
    },
});