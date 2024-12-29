import { Colors } from '@/constants/Colors'
import { tokenCache } from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { router, Slot, Stack, usePathname, useRouter, useSegments } from 'expo-router'
import { Suspense, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Toaster } from 'sonner-native'
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { addDummyData } from '@/utils/addDummyData'

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

    console.log('isSignedIn', isSignedIn)
    console.log('isLoaded', isLoaded)

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
  const expoDB = openDatabaseSync('todos')
  const db = drizzle(expoDB)

  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    if (!success) return;

    addDummyData(db)

    if (error) {
      console.log(error)
    }
  }, [success])

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider databaseName='todos' useSuspense>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InitialLayout />
              <Toaster />
            </GestureHandlerRootView>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  )
}

function Loading() {
  return <ActivityIndicator size="large" color={Colors.primary} />
}

export default RootLayout