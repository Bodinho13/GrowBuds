import { StyleSheet, Text, View } from "react-native";

import type { Plant } from "../types/Plant";

import { Colors, Spacing, Radius, Typography } from "../theme";

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
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
        marginVertical: Spacing.sm,
        borderRadius: Radius.lg,

        shadowColor: Colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    name: {
        fontSize: Typography.subHeading,
        fontWeight: "600",
    },

    subtitle: {
        marginTop: Spacing.xs,
        color: Colors.textSecondary,
    },
});