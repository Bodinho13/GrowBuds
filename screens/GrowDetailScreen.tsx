import { View, Text, StyleSheet } from "react-native";
import { Spacing, Typography } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GrowStackParamList } from "../navigation/types";
import { useGrow } from "../hooks/useGrow";
import { EmptyState, LoadingView } from "../components/common";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowDetail">;

export default function GrowDetailScreen({route}: Props) {
    const { growId } = route.params;

    const { grow, loading } = useGrow(growId);
    
    if(loading)
        return <LoadingView/>;

    if(!grow)
        return <EmptyState message="Grow wurde nicht gefunden."/>

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{grow.name}</Text>

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
});