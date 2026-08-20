import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Plant } from "../types/Plant";

import { Colors, Spacing, Radius, Typography } from "../theme";

type PlantCardProps = {
  plant: Plant;

  onPress?: () => void;
};

export default function PlantCard({ plant, onPress }: PlantCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{plant.name}</Text>
          {plant.isArchived && (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedBadgeText}>Archiviert</Text>
            </View>
          )}
        </View>

        {plant.strain && <Text style={styles.subtitle}>{plant.strain}</Text>}

        {plant.breeder && <Text style={styles.subtitle}>{plant.breeder}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: Radius.lg,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },
  name: {
    fontSize: Typography.subHeading,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: Spacing.xs,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  archivedBadge: {
    backgroundColor: Colors.archivedSurface,
    borderWidth: 1,
    borderColor: Colors.archivedBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  archivedBadgeText: {
    color: Colors.archivedText,
    fontSize: Typography.caption,
    fontWeight: "bold",
  },
});
