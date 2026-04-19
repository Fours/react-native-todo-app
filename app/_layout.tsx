import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Colors } from '@/constants/theme'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 22 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </GestureHandlerRootView>
  )
}
