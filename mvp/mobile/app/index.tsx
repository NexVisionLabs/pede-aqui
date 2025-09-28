import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Ir para Cadastro de Produtos" onPress={() => router.push('/cadastro')} />
    </View>
  );
}