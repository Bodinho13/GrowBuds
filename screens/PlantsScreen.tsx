import { FlatList, Text, StyleSheet, Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { PlantsStackParamList } from "../navigation/types";
import { usePlants } from "../hooks/usePlants";
import PlantCard from "../components/PlantCard";

import { Spacing, Typography } from "../theme";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantsList">;

export default function PlantsScreen({ navigation }: Props) {
  const { plants, loading, refresh } = usePlants();

  useFocusEffect(
    useCallback(() => {
      refresh();
    },[refresh])
  );

  if (loading) {
    return <Text>Lade Pflanzen...</Text>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <PlantCard 
                  plant={item} 
                  onPress={() => navigation.navigate("PlantDetail", {plantId: item.id})}
              />
          )}
        />
        <Pressable
          style={styles.createButton}
          onPress={() => navigation.navigate("CreatePlant")}
        >
          <Text style={styles.createButtonText}>+ Neue Pflanze</Text>
        </Pressable>
      </View>
    );
  }
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
  createButton: {
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.md
  },
  createButtonText: {
    fontSize: Typography.body,
    fontWeight: "bold",
  }
});
