import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () =>{
        if (!username || !password) {
            Alert.alert("Erro", "Preencha usuário e senha");
            return;
        }
        
        setLoading(true);

        try {
            // http://192.168.0.105:8080/login para acessar pelo expo (tentar)
            const url = "http://192.168.0.105:8080/login";
            // const url = "http://localhost:8080/login";
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password}),
            });

            if (!response.ok){
                throw new Error("Credenciais inválidas");   
            }

            const data = await response.json();
            await login(data); 
        } catch (error: any) {
            Alert.alert("Falha no login", error.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };
    
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? "Entrando..." : "entrar"} onPress={handleLogin} disabled={loading} />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});