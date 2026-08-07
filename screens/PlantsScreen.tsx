import { FlatList, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { PlantsStackParamList } from "../navigation/types";
import { usePlants } from "../hooks/usePlants";
import PlantCard from "../components/PlantCard";

import { Typography } from "../theme";

type Props = NativeStackScreenProps<PlantsStackParamList, "PlantsList">;

export default function PlantsScreen({ navigation }: Props) {
  const { plants, loading } = usePlants();

  if (loading) {
    return <Text>Lade Pflanzen...</Text>;
  } else {
    return (
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlantCard plant={item} />}
      />
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
});
