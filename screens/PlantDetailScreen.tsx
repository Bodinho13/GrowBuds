import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors, Radius, Spacing, Typography } from "../theme";
import { PlantsStackParamList } from "../navigation/types";
import { usePlant } from "../hooks/usePlant";
import { EmptyState, LoadingView, Section } from "../components/common";
import { Plant } from "../types/Plant";
import { useServices } from "../services/ServicesContext";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantDetail">;

export default function PlantDetailScreen({ route, navigation }: Props) {
  const { plantId } = route.params;

  const { plant, loading, refresh } = usePlant(plantId);
  const { plantService } = useServices();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  async function handleArchive(plant: Plant) {
    Alert.alert(
      "Pflanze archivieren",
      `Möchtest du "${plant.name}" wirklich archivieren?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Archivieren",
          style: "destructive",
          onPress: async () => {
            try {
              const archivedPlant = await plantService.archive(plant.id);
              if (!archivedPlant) {
                Alert.alert(
                  "Fehler",
                  "Die Pflanze konnte nicht archiviert werden.",
                );
                return;
              }
              navigation.goBack();
            } catch (error) {
              console.error("Failed to archive plant:", error);
              Alert.alert(
                "Fehler",
                "Die Pflanze konnte nicht archiviert werden.",
              );
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return <LoadingView />;
  }

  if (!plant) {
    return <EmptyState message="Pflanze nicht gefunden." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{plant.name}</Text>
      </View>

      {plant.isArchived && (
        <View style={styles.archivedInfo}>
          <Text style={styles.archivedInfoTitle}>Archiviert</Text>
          {plant.archivedAt && (
            <Text style={styles.archivedInfoText}>
              Archiviert am: {plant.archivedAt.toLocaleDateString("de-DE")}
            </Text>
          )}
        </View>
      )}

      <Section title="Informationen">
        {plant.strain && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Typ</Text>
            <Text style={styles.value}>{plant.strain}</Text>
          </View>
        )}

        {plant.cross && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kreuzung</Text>
            <Text style={styles.value}>{plant.cross}</Text>
          </View>
        )}

        {plant.breeder && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Züchter</Text>
            <Text style={styles.value}>{plant.breeder}</Text>
          </View>
        )}
      </Section>

      {plant.notes && (
        <Section title="Notizen">
          <Text style={styles.notes}>{plant.notes}</Text>
        </Section>
      )}

      <Section title="Verwaltung">
        <View style={styles.infoRow}>
          <Text style={styles.label}>Erstellt am</Text>
          <Text style={styles.value}>
            {plant.createdAt.toLocaleDateString("de-DE")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Zuletzt geändert</Text>
          <Text style={styles.value}>
            {plant.updatedAt.toLocaleDateString("de-DE")}
          </Text>
        </View>

        {plant.archivedAt && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Archiviert am</Text>
            <Text style={styles.value}>{plant.archivedAt.toLocaleDateString("de-DE")}</Text>
          </View>
        )}
      </Section>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("EditPlant", { plantId: plant.id })}
      >
        <Text style={styles.buttonText}>Bearbeiten</Text>
      </Pressable>
      {!plant.isArchived && (
        <Pressable
          style={[styles.button, styles.archiveButton]}
          onPress={() => handleArchive(plant)}
        >
          <Text style={[styles.buttonText, styles.archiveButtonText]}>
            Archivieren
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: "bold",
    color: Colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: Typography.body,
    color: Colors.text,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  notes: {
    fontSize: Typography.body,
    lineHeight: 22,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.body,
    fontWeight: "bold",
  },
  archiveButton: {
    backgroundColor: Colors.error,
  },
  archiveButtonText: {
    color: Colors.surface,
  },
  archivedInfo: {
    backgroundColor: Colors.archivedBackground,
    borderWidth: 1,
    borderColor: Colors.archivedBorder,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  archivedInfoTitle: {
    color: Colors.archivedText,
    fontSize: Typography.body,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  archivedInfoText: {
    color: Colors.archivedTextSecondary,
    fontSize: Typography.body,
  },
});