import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const open = () => {
    bottomSheetRef.current?.expand()
  }

  const close = () => {
    bottomSheetRef.current?.close();
  }

  return { bottomSheetRef, open, close };
}
