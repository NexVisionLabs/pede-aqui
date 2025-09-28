import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: { backgroundColor: '#222' },
      headerTintColor: '#fff',
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="index"
      options={{ title: "Início" }}
    />
    <Stack.Screen
      name="cadastro"
      options={{ title: "Cadastro de Produto" }}
    />
  </Stack>
  );
}
