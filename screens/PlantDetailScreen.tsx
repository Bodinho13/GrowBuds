import { StyleSheet, Text, View } from "react-native";

import { Typography } from "../theme";

export default function PlantDetailScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Plant Detail
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: Typography.title,
        fontWeight: "600",
    },
});