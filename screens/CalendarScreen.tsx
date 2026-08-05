import { View, Text, StyleSheet } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";

type Props = BottomTabScreenProps<TabParamList, "Kalender">;

export default function CalendarScreen({}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Grow Kalender
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