import { Colors } from '@/constants/Colors'
import { tokenCache } from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { router, Slot, Stack, usePathname, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { View, Text } from 'react-native'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

const InitialLayout = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const segment = useSegments()
  const pathname = usePathname()

  const inAuthGroup = segment[0] === '(authenticated)'

  useEffect(() => {
    if (!isLoaded) return

    console.log('Segments', segment)
    console.log('pathname', pathname)

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(authenticated)/(tabs)/today')
    } else if (!isSignedIn && pathname !== '/') {
      router.replace("/")
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  )
}
const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  )
}

export default RootLayout