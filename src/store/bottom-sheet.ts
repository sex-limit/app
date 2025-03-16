import { useBottomSheet } from "@/ui/bottom-sheet/hook";
import { BottomSheetModalProps, BottomSheetProps } from "@gorhom/bottom-sheet";
import { createGlobalStore } from "hox";
import { useState } from "react";

export const [useGlobalBottomSheet, getGlobalBottomSheet] = createGlobalStore(() => {
  const { bottomSheetRef, open: innerOpen, close: innerClose } = useBottomSheet();
  const [props, setProps] = useState<BottomSheetProps>({} as BottomSheetProps);

  const open = (params: BottomSheetProps) => {
    setProps(params);
    innerOpen();
  }

  const close = () => {
    innerClose();
  }

  return {
    bottomSheetRef,
    open,
    close,
    props,
    setProps
  }
})