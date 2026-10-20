import { Pressable, View, Text, StyleSheet } from "react-native";
import { GrowGroup } from "../types/GrowGroup"
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = {
    growGroup: GrowGroup;
    growCount: number;
    onPress?: () => void;
};

export default function GrowGroupCard({growGroup, growCount, onPress}: Props) {
    return(
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                <Text style={styles.title}>{growGroup.name}</Text>
                <Text style={styles.description}>
                    {growCount} {growCount === 1 ? "Grow" : "Grows"}
                </Text>

                {growGroup.isArchived && (
                    <Text style={styles.archived}>Archiviert</Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    content: {
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography.body,
        fontWeight: "600",
        color: Colors.text,
    },
    description: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
    archived: {
        fontSize: Typography.caption,
        color: Colors.textSecondary,
    },
})