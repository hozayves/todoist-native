import { Colors } from "@/constants/Colors";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { StyleSheet } from "react-native";

interface Props {
    title: string;
    children: React.ReactNode;
}
type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => [], []);

    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1} {...props}
        />)

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            handleIndicatorStyle={{ backgroundColor: Colors.dark }}
            backgroundStyle={{ backgroundColor: Colors.background }}
            backdropComponent={renderBackdrop}
            style={styles.contentContainer}
            enablePanDownToClose={true}
            enableDynamicSizing={true}
        >
            <BottomSheetView>
                {props.children}
            </BottomSheetView>
        </BottomSheetModal>
    )
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

export default BottomSheet;
