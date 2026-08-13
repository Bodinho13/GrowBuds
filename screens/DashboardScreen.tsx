import { View, Text, StyleSheet, FlatList } from "react-native";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";
import { useGrows } from "../hooks/useGrows";
import { EmptyState, LoadingView, Section } from "../components/common";
import { Typography } from "../theme";

type Props = BottomTabScreenProps<TabParamList, "Dashboard">;

export default function DashboardScreen({}: Props) {
    const {grows, loading} = useGrows();

    if(loading) 
        return <LoadingView/>;

    if(!grows || grows.length === 0)
        return <EmptyState message="Keine aktiven Grows vorhanden"/>

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Willkommen bei Grow-Buds
            </Text>
            <Text style={styles.heading}>
                Deine aktiven Grows:
            </Text>
            <FlatList
                data={grows}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Text style={styles.item_title}>{item.name}</Text>
                )}
            />
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
        fontWeight: "bold",
    },
    item_title: {
        fontSize: Typography.subHeading,
    },
    heading: {
        fontSize: Typography.heading
    },
});