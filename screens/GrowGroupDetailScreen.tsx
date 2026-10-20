import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GrowStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { useGrows } from "../hooks/useGrows";
import { EmptyState, LoadingView } from "../components/common";
import { useState } from "react";
import { GrowGroup } from "../types/GrowGroup";
import { ScrollView, View, Text } from "react-native";

type Props = NativeStackScreenProps<GrowStackParamList, "GrowGroupDetail">;

export default function GrowGroupDetailScreen({route}: Props){
    const {growGroupService} = useServices();
    const {grows, loading: growsLoading, refresh} = useGrows();

    const {growGroupId} = route.params;

    const [growGroup, setGrowGroup] = useState<GrowGroup | undefined>();
    const [groupLoading, setGroupLoading] = useState(true);

    if(groupLoading || growsLoading)
        return <LoadingView/>;

    if(!growGroup)
        return <EmptyState message="Grow-Gruppe nicht gefunden."/>;

    return(
        <ScrollView

        >
            <View>
                <Text>{growGroup.name}</Text>
            </View>
        </ScrollView>
    );
}