import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";

import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { useServices } from "../services/ServicesContext";
import { GrowStage } from "../types/GrowStage";
import { GrowMedium } from "../types/GrowMedium";
import { EmptyState, LoadingView } from "../components/common";
import Select from "../components/common/Select";
import { Radius, Spacing, Typography } from "../theme";
import { usePlant } from "../hooks/usePlant";

type Props = NativeStackScreenProps<GrowStackParamList, "EditGrow">;

export default function EditGrowScreen({route, navigation}: Props) {
    const {growId} = route.params;
    const {grow, loading} = useGrow(growId);
    const {growService} = useServices();

    const {plant} = usePlant(grow?.plantId);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [stage, setStage] = useState(GrowStage.Seed);
    const [medium, setMedium] = useState(GrowMedium.Soil);
    const [location, setLocation] = useState("");
    const [weight, setWeight] = useState("");

    useEffect(() => {
        if(!grow)
            return;

        setName(grow.name);
        setAmount(String(grow.amount));
        setStage(grow.stage);
        setMedium(grow.medium);
        setLocation(grow.location ?? "");
        setWeight(grow.weight !== undefined ? String(grow.weight) : "");
    }, [grow]);

    async function handleUpdate() {
        if(!grow)
            return;

        const parsedAmount = Number(amount);
        if(!name.trim() || !Number.isInteger(parsedAmount) || parsedAmount <= 0)
            return;

        const parsedWeight = weight.trim() === "" ? undefined : Number(weight);
        if(parsedWeight !== undefined && (!Number.isFinite(parsedWeight) || parsedWeight < 0))
            return;

        await growService.update( grow.id, {
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

    if(loading)
        return <LoadingView/>

    if(!grow)
        return <EmptyState message="Grow wurde nicht gefunden."/>

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <Text style={styles.label}>Pflanze</Text>
            <Text style={styles.input && styles.inputDisabled}>{plant?.name ?? "Pflanze wird geladen..."}</Text>

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

            <Pressable
                style={styles.button}
                onPress={handleUpdate}
            >
                <Text style={styles.buttonText}>Speichern</Text>
            </Pressable>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
    input: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.sm,
    },
    inputDisabled: {
        opacity: 0.5,
    },
    label: {
        fontWeight: "bold",
        marginTop: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    button: {
        padding: Spacing.md,
        borderWidth: 1,
        borderRadius: Radius.md,
        alignItems: "center",
        marginTop: Spacing.lg,
    },
    buttonText: {
        fontSize: Typography.body,
        fontWeight: "bold",
    },
});