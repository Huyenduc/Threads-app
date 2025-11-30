import { TAB_BAR_HEIGHT } from "@/constants/tabBar";
import { TabBarContext } from "@/contexts/TabBarContext";
import { useCallback, useContext, useMemo, useRef } from "react";
import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

export const useTabBarAnimation = () => {
  const translateY = useContext(TabBarContext);
  if (!translateY) {
    throw new Error("useTabBarAnimation must be used within TabBarProvider");
  }

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const accumulatedScroll = useRef(0);
  const multiplier = 1.5; // Speed up translateY by 1.5x

  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: ({
          nativeEvent,
        }: NativeSyntheticEvent<NativeScrollEvent>) => {
          const currentY = nativeEvent.contentOffset.y;
          const contentHeight = nativeEvent.contentSize.height;
          const layoutHeight = nativeEvent.layoutMeasurement.height;

          if (currentY < 0) return;
          const maxScrollY = contentHeight - layoutHeight;
          if (currentY > maxScrollY) return;

          const diff = currentY - lastScrollY.current;

          if (diff > 0) {
            accumulatedScroll.current = Math.min(
              accumulatedScroll.current + diff * multiplier,
              TAB_BAR_HEIGHT,
            );
          } else if (diff < 0) {
            accumulatedScroll.current = Math.max(
              accumulatedScroll.current + diff * multiplier,
              0,
            );
          }

          translateY.setValue(accumulatedScroll.current);
          lastScrollY.current = currentY;
        },
      }),
    [scrollY, translateY],
  );

  const handleScrollEnd = useCallback(() => {
    const current = accumulatedScroll.current;
    // Decide whether to show or hide the tab bar based on threshold
    const threshold = TAB_BAR_HEIGHT / 2;
    const finalValue = current > threshold ? TAB_BAR_HEIGHT : 0;
    Animated.timing(translateY, {
      toValue: finalValue,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      accumulatedScroll.current = finalValue; // sync
    });
  }, [translateY]);

  return {
    translateY,
    handleScroll,
    handleScrollEnd,
  };
};
