import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TaskDetails = ({ id }: { id: number }) => {
    return (
        <View>
            <Text>Page: {id}</Text>
        </View>
    )
}

export default TaskDetails

const styles = StyleSheet.create({})