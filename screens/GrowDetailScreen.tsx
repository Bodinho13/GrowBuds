import { View, Text, StyleSheet, Pressable } from "react-native";
import { Spacing, Typography } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { EmptyState, LoadingView } from "../components/common";
import { usePlant } from "../hooks/usePlant";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowDetail">;

export default function GrowDetailScreen({route, navigation}: Props) {
    const { growId } = route.params;

    const { grow, loading } = useGrow(growId);
    const {plant} = usePlant(grow?.plantId);
    
    if(loading)
        return <LoadingView/>;

    if(!grow)
        return <EmptyState message="Grow wurde nicht gefunden."/>

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{grow.name}</Text>
            <Text>Pflanze: {plant?.name}</Text>
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
                onPress={() => navigation.navigate("EditGrow", {growId: grow.id})}
            >
                <Text style={styles.buttonText}>Bearbeiten</Text>
            </Pressable>
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
});