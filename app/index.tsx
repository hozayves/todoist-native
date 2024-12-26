import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth, useOAuth } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

export default function index() {
  const { startOAuthFlow: authGithub } = useOAuth({ strategy: 'oauth_github' })
  const { startOAuthFlow: authGoogle } = useOAuth({ strategy: 'oauth_google' })
  const { top } = useSafeAreaInsets()

  const handleGoogleOAuth = async () => {
    try {
      const { createdSessionId, setActive } = await authGoogle()
      console.log("HandleGoogleOAuth ~ createdSessionId:", createdSessionId)

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (error) {
      console.log("HandleGoogleOAuth ~ error:", error)
    }
  }
  const handleGithubOAuth = async () => {
    try {
      const { createdSessionId, setActive } = await authGithub
        ()
      console.log("HandleGithubOAuth ~ createdSessionId:", createdSessionId)

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (error) {
      console.log("HandleGithubOAuth ~ error:", error)
    }
  }

  const openLink = async () => {
    WebBrowser.openBrowserAsync('https://galaxies.dev')
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
      <Image source={require("@/assets/images/todoist-logo.png")} style={styles.loginImage} resizeMode='contain' />
      <Image source={require("@/assets/images/login.png")} style={styles.bannerImage} resizeMode='contain' />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleGithubOAuth()}>
          <MaterialCommunityIcons name='github' size={24} />
          <Text style={styles.buttonText}>Continue with Github</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleGoogleOAuth()}>
          <MaterialCommunityIcons name='google' size={24} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Hello world')}>
          <MaterialCommunityIcons name='email' size={24} />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing you agree to our
          <Text style={styles.termsLink} onPress={openLink}>
            Terms of Service
          </Text> and <Text style={styles.termsLink} onPress={openLink}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 40,
    marginTop: 20
  },
  loginImage: {
    height: 40,
    alignItems: 'center',
    alignSelf: 'center'
  },
  bannerImage: {
    height: 280,
    alignSelf: 'center'
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 40
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    gap: 10
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500"
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: "500",
    color: Colors.lightText
  },
  termsLink: {
    color: Colors.lightText,
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: 'underline',
    textDecorationColor: Colors.lightText,
    textAlign: 'center'
  }
})
