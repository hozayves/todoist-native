import { Colors } from '@/constants/Colors'
import { tokenCache } from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { router, Slot, Stack, useNavigationContainerRef, usePathname, useRouter, useSegments } from 'expo-router'
import { Suspense, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Toaster } from 'sonner-native'
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { addDummyData } from '@/utils/addDummyData'

import * as Sentry from '@sentry/react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true, // Only show the time to initial display if it's less than 1000ms, Only in native builds, not in expo Go
})

Sentry.init({
  dsn: 'https://eaf5a178624b689d716ad8c2451fa365@o4507794120048640.ingest.de.sentry.io/4508553070706768',

  attachScreenshot: true,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0, // Change in production
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [Sentry.mobileReplayIntegration({
    maskAllText: true,
    maskAllImages: true,
    maskAllVectors: true
  }),
    navigationIntegration,
  Sentry.spotlightIntegration() // Sentry for crash reporting for development
  ],
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});
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
  const ref = useNavigationContainerRef()

  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref)
  }, [ref])


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
          <SQLiteProvider databaseName='todos' useSuspense options={{ enableChangeListener: true }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <InitialLayout />
                <Toaster />
              </BottomSheetModalProvider>
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

export default Sentry.wrap(RootLayout)