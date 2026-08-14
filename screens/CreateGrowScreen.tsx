import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { GrowStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { Plant } from "../types/Plant";
import { GrowStage } from "../types/GrowStage";
import { GrowMedium } from "../types/GrowMedium";
import { Radius, Spacing } from "../theme";
import Select from "../components/common/Select";

type Props = NativeStackScreenProps<GrowStackParamList, "CreateGrow">;

export default function CreateGrowScreen({ navigation }: Props) {
  const { plantService, growService } = useServices();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [selPlant, setSelPlant] = useState<Plant | undefined>();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [stage, setStage] = useState(GrowStage.Seed);
  const [medium, setMedium] = useState(GrowMedium.Coco);
  const [location, setLocation] = useState("");

  useEffect(() => {
    async function loadPlants() {
      const result = await plantService.getAll();
      setPlants(result);
      if (result.length > 0) {
        setSelPlant(result[0]);
      }
    }
    loadPlants();
  }, []);

  async function handleCreate() {
    if (!selPlant || !name.trim()) 
        return;

    const parsedAmount = Number(amount);
    if (
      !selPlant ||
      !name.trim() ||
      !Number.isInteger(parsedAmount) ||
      parsedAmount <= 0
    )
      return;

    await growService.create({
      plantId: selPlant.id,
      name: name.trim(),
      startDate,
      amount: parsedAmount,
      stage,
      medium,
      location: location.trim() || undefined,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {selPlant ? (
        <Select
            label="Pflanze"
            value={selPlant}
            options={plants}
            getLabel={(plant) => plant.name}
            onChange={setSelPlant}
        />
      ) : (
        <Text>Keine Pflanzen vorhanden. Bitte zuerst eine Pflanze anlegen.</Text>
      )}

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name des Grows"
        style={styles.input}
      />

      <Text style={styles.label}>Menge</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Anzahl"
        style={styles.input}
      />

      <View style={styles.dateRow}>
        <Text style={styles.label}>Startdatum</Text>
        <View style={styles.dateRowValue}>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
          <Text>📆</Text>
        </View>
      </View>

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
        placeholder="optional"
        style={styles.input}
      />

      <Pressable style={[
            styles.button,
            (!selPlant || !name.trim() || !Number.isInteger(Number(amount)) || Number(amount) <= 0) && styles.buttonDisabled
        ]} onPress={handleCreate} 
        disabled={
            !selPlant || !name.trim() || !Number.isInteger(Number(amount)) || Number(amount) <= 0
        }
      >
        <Text>Grow erstellen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  label: {
    fontWeight: "bold",
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  option: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  selectedOption: {
    borderWidth: 2,
  },
  button: {
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  dateRowValue: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
