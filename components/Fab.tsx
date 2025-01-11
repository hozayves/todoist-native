import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import TodoForm from './TodoForm'
import BottomSheet from './BottomSheet'
import { BottomSheetModal } from '@gorhom/bottom-sheet'


const Fab = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    const onPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        bottomSheetRef.current?.present()
    }
    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.fab}>
                <Ionicons name='add' size={30} color="white" />
            </TouchableOpacity>
            <BottomSheet title='Add Task' ref={bottomSheetRef} snapPoints={[]} index={0} >
                <TodoForm />
            </BottomSheet>
        </>
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