import { StyleSheet, Text, View } from "react-native";

import { Colors, Spacing, Typography } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PlantsStackParamList } from "../navigation/types";
import { usePlant } from "../hooks/usePlant";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantDetail">;

export default function PlantDetailScreen({route}: Props) {
    const { plantId } = route.params;

    const {plant, loading,} = usePlant(plantId);

    if(loading) {
        return (
            <View style={styles.center}>
                <Text>Lade Pflanze...</Text>
            </View>
        );
    }

    if(!plant) {
        return (
            <View style={styles.center}>
                <Text>Pflanze nicht gefunden.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {plant.name}
            </Text>
            
            {plant.strain && (
                <Text style={styles.text}>
                    Sorte: {plant.strain}
                </Text>
            )}

            {plant.parents && (
                <Text style={styles.text}>
                    Kreuzung: {plant.parents}
                </Text>
            )}

            {plant.breeder && (
                <Text style={styles.text}>
                    Züchter: {plant.breeder}
                </Text>
            )}

            {plant.notes && (
                <Text style={styles.text}>
                    {plant.notes}
                </Text>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: Typography.body,
        marginBottom: Spacing.sm,
        color: Colors.textSecondary,
    },

    title: {
        fontSize: Typography.title,
        fontWeight: "600",
    },
});