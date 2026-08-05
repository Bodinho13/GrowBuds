import { View, Text, StyleSheet } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";

type Props = BottomTabScreenProps<TabParamList, "Einstellungen">;

export default function SettingsScreen({}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Einstellungen
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