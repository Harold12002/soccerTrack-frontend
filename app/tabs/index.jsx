import { View, Text } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Soccer Track!</Text>
    </View>
  );
}
