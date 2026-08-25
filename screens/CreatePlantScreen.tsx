import { useState } from "react";
import { useServices } from "../services/ServicesContext";
import {
  Alert,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PlantsStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<PlantsStackParamList, "CreatePlant">;

export default function CreatePlantScreen({ navigation }: Props) {
  const { plantService } = useServices();

  const [name, setName] = useState("");
  const [strain, setStrain] = useState("");
  const [cross, setCross] = useState("");
  const [breeder, setBreeder] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Namen für die Pflanze ein.");
      return;
    }

    try {
      setSaving(true);
      await plantService.create({
        name: name.trim(),
        strain: strain.trim() || undefined,
        cross: cross.trim() || undefined,
        breeder: breeder.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create plant:", error);
      Alert.alert("Fehler", "Die Pflanze konnte nicht erstellt werden.");
    } finally {
      setSaving(false);
    }
  }

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
          placeholder="z.B. Indica"
        />

        <Text style={styles.label}>Kreuzung</Text>
        <TextInput
          style={styles.input}
          value={cross}
          onChangeText={setCross}
          placeholder="z.B. A x B"
        />

        <Text style={styles.label}>Züchter</Text>
        <TextInput
          style={styles.input}
          value={breeder}
          onChangeText={setBreeder}
          placeholder="Züchter"
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
          onPress={handleCreate}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Speichern..." : "Pflanze erstellen"}
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
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    flexGrow: 1,
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
});
