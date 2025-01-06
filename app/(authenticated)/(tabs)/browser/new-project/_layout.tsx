import { Colors } from "@/constants/Colors"
import { useRouter, Stack } from "expo-router"
import { Button, View } from "react-native"


const Layout = () => {
    const router = useRouter()
    return (
        <Stack screenOptions={{
            headerShadowVisible: false,
            contentStyle: { backgroundColor: Colors.backgroundAlt },
            headerTintColor: Colors.primary,
            headerTitleStyle: { color: '#000' }
        }}>
            <Stack.Screen name="index" options={{
                title: 'New Project',
                presentation: 'modal',
                headerTransparent: true

            }} />
            <Stack.Screen name="color-select" options={{ headerTransparent: true, title: 'Color' }} />
        </Stack>
    )
}

export default Layout