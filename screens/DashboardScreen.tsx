import { View, Text, StyleSheet } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";

type Props = BottomTabScreenProps<TabParamList, "Dashboard">;

export default function DashboardScreen({}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Willkommen bei Grow-Buds
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
        fontSize: 24,
        fontWeight: "bold",
    },
});