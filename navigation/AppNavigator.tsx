import { NavigationContainer } from "@react-navigation/native";

import TabNavigator from "./TabNavigator";

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}