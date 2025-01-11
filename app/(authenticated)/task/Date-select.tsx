import { View, Text, StyleSheet, Pressable } from "react-native"
import { Colors, DATE_COLORS } from "@/constants/Colors"
import Ionicons from "@expo/vector-icons/build/Ionicons"
import { addDays, format, nextMonday, nextSaturday } from "date-fns"
import { useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store'
import CalendarPicker from 'react-native-calendar-picker'

const DateSelect = ({ onSave }: { onSave: (date: Date) => void }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    useEffect(() => {
        SecureStore.getItemAsync('selectedDate').then((date) => {
            if (date) {
                setCurrentDate(new Date(date))
            }
        })
    }, [])

    return (
        <View>
            <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleText}>Date</Text>
            </View>
            <View style={styles.quickButtons}>
                <Pressable
                    onPress={() => onSave(new Date())}
                    style={({ pressed }) => ([{
                        backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                    }, styles.quickButton])}
                >
                    <Ionicons name="today-outline" size={24} color={DATE_COLORS.today} />
                    <Text style={styles.quickButtonText}>Today</Text>
                    <Text style={styles.quickButtonDate}>{format(new Date(), 'EEE')}</Text>
                </Pressable>
                <Pressable
                    onPress={() => onSave(addDays(new Date(), 1))}
                    style={({ pressed }) => ([{
                        backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                    }, styles.quickButton])}
                >
                    <Ionicons name="calendar-outline" size={24} color={DATE_COLORS.tomorrow} />
                    <Text style={styles.quickButtonText}>Tomorrow</Text>
                    <Text style={styles.quickButtonDate}>{format(addDays(new Date(), 1), 'EEE')}</Text>
                </Pressable>
                <Pressable
                    onPress={() => onSave(nextSaturday(new Date()))}
                    style={({ pressed }) => ([{
                        backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                    }, styles.quickButton])}
                >
                    <Ionicons name="calendar-outline" size={24} color={DATE_COLORS.weekend} />
                    <Text style={styles.quickButtonText}>This Weekend</Text>
                    <Text style={styles.quickButtonDate}>{format(nextSaturday(new Date()), 'EEE')}</Text>
                </Pressable>
                <Pressable
                    onPress={() => onSave(nextMonday(new Date()))}
                    style={({ pressed }) => ([{
                        backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                    }, styles.quickButton])}
                >
                    <Ionicons name="calendar-outline" size={24} color={DATE_COLORS.other} />
                    <Text style={styles.quickButtonText}>Next Week</Text>
                    <Text style={styles.quickButtonDate}>{format(nextMonday(new Date()), 'EEE')}</Text>
                </Pressable>
            </View>
            <View style={styles.datePickerContainer}>
                <CalendarPicker
                    onDateChange={(date: Date) => {
                        const newDate = new Date(date)
                        setCurrentDate(newDate)

                    }}
                    minDate={new Date()}
                />
            </View>
            <View style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                <Pressable
                    onPress={() => onSave(currentDate)}
                    style={({ pressed }) => ([{
                        backgroundColor: pressed ? '#b33f34' : Colors.primary
                    }, styles.saveButton])}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scheduleContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    scheduleText: {
        color: Colors.dark,
        fontWeight: '300',
        fontSize: 24,
        textAlign: 'center'
    },
    quickButtons: {
        alignItems: 'center',
    },
    quickButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    quickButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1

    },
    quickButtonDate: {
        fontSize: 16,
        color: Colors.dark,
    },
    saveButton: {
        padding: 13,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    datePickerContainer: {
        width: '100%',
    }
})

export default DateSelect