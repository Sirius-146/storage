import { useAuth } from "@/context/AuthContext";
import { Button, Text, View } from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user?.name} ({user?.role})</Text>

      {user?.role === "ADMIN" ? (
        <Text>Você tem acesso a funcionalidades de administrador 🚀</Text>
      ) : (
        <Text>Acesso normal de usuário</Text>
      )}

      <Button title="Sair" onPress={logout} />
    </View>
  );
}
