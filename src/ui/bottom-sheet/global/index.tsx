import { isEmptyObject } from "@/shared/utils/is";
import { useGlobalBottomSheet } from "@/store/bottom-sheet";
import BottomSheet, { BottomSheetBackdropProps, BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo } from "react";

const GlobalBottomSheet: React.FC = () => {
  const { bottomSheetRef, close, props } = useGlobalBottomSheet();

  // 确保snapPoints至少有一个值且index不超出范围
  const memoSnapPoints = useMemo(
    () => props.snapPoints || ['50%'],
    [props.snapPoints],
  )

  // 设置初始index为0而不是1，避免超出snapPoints范围
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  )

  return (
    <>
      <BottomSheet
        handleStyle={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        onClose={close}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={memoSnapPoints}
        backdropComponent={renderBackdrop} // 修正backdrop组件的prop名称
        enablePanDownToClose={true}
        {...props}
      />
    </>
  )
}

export default GlobalBottomSheet;