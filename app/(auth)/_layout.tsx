import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2f95dc',
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="sign-in-alt" color={color} size={size}/>
          ),
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          title: 'Cadastro',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-plus" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}