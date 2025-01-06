import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { Colors, DEFAULT_PROJECT_COLOR, PROJECT_COLORS } from "@/constants/Colors"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/build/Ionicons"

const ColorSelect = () => {
    const headerHeight = useHeaderHeight()
    const [selected, setSelected] = useState(DEFAULT_PROJECT_COLOR)
    const router = useRouter()

    const onColorSelect = (color: string) => {
        setSelected(color)
        router.setParams({ bg: color })
    }
    return (
        <View style={{ marginTop: headerHeight }}>
            <View
                style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
            >
                {PROJECT_COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorPreview,
                            {
                                backgroundColor: color,
                                height: 60,
                                width: 60,
                                margin: 5,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}
                        onPress={() => onColorSelect(color)}
                    >
                        {selected === color && (
                            <Ionicons name="checkmark" size={24} color="#fff" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    colorPreview: {
        width: 24,
        height: 24,
        borderRadius: 12
    }
})

export default ColorSelect  
