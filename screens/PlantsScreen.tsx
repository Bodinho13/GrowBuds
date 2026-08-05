import { View, Text, StyleSheet } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PlantsStackParamList, TabParamList } from "../navigation/types";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantsList">;

export default function PlantsScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Meine Pflanzen
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