import { Pressable, StyleSheet, Text, View } from "react-native";
import { Grow } from "../types/Grow";
import { useEffect } from "react";
import PlantService from "../services/plants";
import { usePlant } from "../hooks/usePlant";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = {
    grow: Grow;
    onPress: () => void;
};

export default function GrowCard({ grow, onPress }: Props) {
    const { plant } = usePlant(grow.plantId);

    return (
        <Pressable onPress={onPress}>
            <View style={styles.card}>
                <Text style={styles.name}>{plant?.name}</Text>
                <Text style={styles.name}>{grow.name}</Text>
                <Text style={styles.info}>Menge: {grow.amount}</Text>
                <Text style={styles.info}>Phase: {grow.stage}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderRadius: Radius.md,

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
        fontWeight: "bold",
        marginBottom: Spacing.xs,
    },

    info: {
        marginTop: Spacing.xs,
        color: Colors.textSecondary,
    },
});