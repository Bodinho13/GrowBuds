import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";

import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { useServices } from "../services/ServicesContext";
import { GrowStage } from "../types/GrowStage";
import { GrowMedium } from "../types/GrowMedium";
import { EmptyState, LoadingView } from "../components/common";
import Select from "../components/common/Select";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = NativeStackScreenProps<GrowStackParamList, "EditGrow">;

export default function EditGrowScreen({ route, navigation }: Props) {
  const { growId, plantName } = route.params;
  const { grow, loading } = useGrow(growId);
  const { growService } = useServices();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState(GrowStage.Seed);
  const [medium, setMedium] = useState(GrowMedium.Soil);
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    if (!grow) return;

    setName(grow.name);
    setAmount(String(grow.amount));
    setStage(grow.stage);
    setMedium(grow.medium);
    setLocation(grow.location ?? "");
    setWeight(grow.weight !== undefined ? String(grow.weight) : "");
  }, [grow]);

  async function handleUpdate() {
    if (!grow) return;

    const parsedAmount = Number(amount);
    if (!name.trim() || !Number.isInteger(parsedAmount) || parsedAmount <= 0)
      return;

    const parsedWeight = weight.trim() === "" ? undefined : Number(weight);
    if (
      parsedWeight !== undefined &&
      (!Number.isFinite(parsedWeight) || parsedWeight < 0)
    )
      return;

    await growService.update(grow.id, {
      ...grow,
      name: name.trim(),
      amount: parsedAmount,
      stage,
      medium,
      location: location.trim() || undefined,
      weight: parsedWeight,
    });

    navigation.goBack();
  }

  if (loading) return <LoadingView />;

  if (!grow) return <EmptyState message="Grow wurde nicht gefunden." />;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Pflanze</Text>
        <Text style={[styles.input, styles.inputDisabled]}>
          {plantName ?? "Pflanze wird geladen..."}
        </Text>

        <Text style={styles.label}>Menge</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Select
          label="Grow-Phase"
          value={stage}
          options={Object.values(GrowStage)}
          getLabel={(value) => value}
          onChange={setStage}
        />

        <Select
          label="Medium"
          value={medium}
          options={Object.values(GrowMedium)}
          getLabel={(value) => value}
          onChange={setMedium}
        />

        <Text style={styles.label}>Standort</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Text style={styles.label}>Gewicht</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="Optional"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Speichern</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
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
  inputDisabled: {
    opacity: 0.5,
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
