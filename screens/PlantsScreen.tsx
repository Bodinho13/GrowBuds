import { Text, StyleSheet, Pressable, View, SectionList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { PlantsStackParamList } from "../navigation/types";
import { usePlants } from "../hooks/usePlants";
import PlantCard from "../components/PlantCard";

import { Colors, Radius, Spacing, Typography } from "../theme";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LoadingView } from "../components/common";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantsList">;

export default function PlantsScreen({ navigation }: Props) {
  const { plants, loading, refresh } = usePlants();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const activePlants = plants.filter((plant) => !plant.isArchived);
  const archivedPlants = plants.filter((plant) => plant.isArchived);

  const sections = [
    {
      title: "Aktive Pflanzen",
      data: activePlants,
    },
    {
      title: "Archivierte Pflanzen",
      data: archivedPlants,
    },
  ];

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            onPress={() =>
              navigation.navigate("PlantDetail", { plantId: item.id })
            }
          />
        )}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderSectionFooter={({section}) =>
          section.data.length === 0 ? (
            <Text style={styles.emptyText}>Keine {section.title.toLowerCase()} vorhanden.</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.title,
    fontWeight: "bold",
    color: Colors.text,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  createButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  createButtonText: {
    fontSize: Typography.body,
    fontWeight: "bold",
  },
});
