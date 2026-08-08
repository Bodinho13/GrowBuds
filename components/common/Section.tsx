import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

import { Colors, Spacing, Typography } from "../../theme";

type Props = {
    title: string;
    children: ReactNode;
}

export default function Section({title, children}: Props) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>

            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },

    title: {
        fontSize: Typography.heading,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: Spacing.sm,
        justifyContent: "center",
        alignSelf: "center",
    },
});