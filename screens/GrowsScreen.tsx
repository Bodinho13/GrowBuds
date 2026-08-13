import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GrowStackParamList } from "../navigation/types";
import { useGrows } from "../hooks/useGrows";
import { Radius, Spacing, Typography } from "../theme";
import { LoadingView } from "../components/common";
import GrowCard from "../components/GrowCard";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowsList">;

export default function GrowsScreen({ navigation }: Props) {
    const { grows, loading } = useGrows();

    if(loading)
        return <LoadingView />
    
    return (
        <View style={styles.container}>
            <FlatList
                data={grows}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <GrowCard
                        grow={item}
                        onPress={() =>
                            navigation.navigate("GrowDetail", {growId: item.id})
                        }
                    />
                )}
            />
            <Pressable
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateGrow")}
            >
                <Text style={styles.createButtonText}>
                    + Neuer Grow
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
    createButton: {
        padding: Spacing.md,
        borderRadius: Spacing.sm,
        alignItems: "center",
        marginTop: Spacing.md
    },
    createButtonText: {
        fontSize: Typography.body,
        fontWeight: "bold",
    },
});