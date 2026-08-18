import { Pressable, StyleSheet, Text, View } from "react-native";
import { Grow } from "../types/Grow";
import { usePlant } from "../hooks/usePlant";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = {
    grow: Grow;
    plantName?: string;
    onPress: () => void;
};

export default function GrowCard({ grow, plantName, onPress }: Props) {

    return (
        <Pressable onPress={onPress}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.name}>{grow.name}</Text>
                    {grow.isArchived && (
                        <View style={styles.archiveBadge}>
                            <Text style={styles.archiveBadgeText}>Archiviert</Text>
                        </View>
                    )}
                </View>
                {plantName && (
                    <Text style={styles.name}>{plantName}</Text>
                )}
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

    archiveBadge: {
        backgroundColor: Colors.archivedSurface,
        borderWidth: 1,
        borderColor: Colors.archivedBorder,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.md,
    },

    archiveBadgeText: {
        color: Colors.archivedText,
        fontSize: Typography.caption,
        fontWeight: "bold",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});