import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { toast } from 'sonner-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'


const Fab = () => {
    const router = useRouter()
    const onPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/task/new')
    }
    return (
        <TouchableOpacity onPress={onPress} style={styles.fab}>
            <Ionicons name='add' size={30} color="white" />
        </TouchableOpacity>
    )
}

export default Fab

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    }
})