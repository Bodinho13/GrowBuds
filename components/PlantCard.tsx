import { StyleSheet, Text, View } from "react-native";

import type { Plant } from "../types/Plant";

type PlantCardProps = {
    plant: Plant;
}

export default function PlantCard ({ plant }: PlantCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>
                {plant.name}
            </Text>

            {plant.strain && (
                <Text style={styles.subtitle}>
                    {plant.strain}
                </Text>
            )}

            {plant.breeder && (
                <Text style={styles.subtitle}>
                    {plant.breeder}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    name: {
        fontSize: 18,
        fontWeight: "600",
    },

    subtitle: {
        marginTop: 4,
        color: "#666",
    },
});