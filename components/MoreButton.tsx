import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
const MoreButton = () => {
    return (
        <TouchableOpacity>
            <Ionicons name='ellipsis-vertical-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
    )
}

export default MoreButton

const styles = StyleSheet.create({})