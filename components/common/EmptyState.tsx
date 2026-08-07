import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

type Props = {
    message: string;
};

export default function EmptyState({message}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.md,
    },
    text: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
    },
});