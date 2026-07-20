import {
  DIRECTION_CHANGE_THRESHOLD,
  SCROLL_MULTIPLIER,
  SNAP_DELAY_MS,
  SNAP_DURATION_MS,
  TAB_BAR_HEIGHT,
} from "@/constants/tabBar";
import { TabBarContext } from "@/contexts/TabBarContext";
import { useCallback, useContext } from "react";
import {
  cancelAnimation,
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const timingConfig = {
  duration: SNAP_DURATION_MS,
  easing: Easing.out(Easing.cubic),
};

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

type ScrollContext = {
  previousY?: number;
  direction?: -1 | 1;
  pendingDirectionDistance: number;
};

const useTabBarTranslateY = () => {
  const translateY = useContext(TabBarContext);

  if (!translateY) {
    throw new Error("useTabBarAnimation must be used within TabBarProvider");
  }

  return translateY;
};

export const useTabBarAnimation = () => {
  // This hook provides a scroll handler that can be attached to a scrollable component
  const translateY = useTabBarTranslateY();

  const handleScroll = useAnimatedScrollHandler<ScrollContext>({
    onBeginDrag: (event, context) => {
      cancelAnimation(translateY);
      const maxScrollY = Math.max(
        event.contentSize.height - event.layoutMeasurement.height,
        0,
      );
      context.previousY = clamp(event.contentOffset.y, 0, maxScrollY);
      context.direction = translateY.value >= TAB_BAR_HEIGHT / 2 ? 1 : -1;
      context.pendingDirectionDistance = 0;
    },
    onScroll: (event, context) => {
      const maxScrollY = Math.max(
        event.contentSize.height - event.layoutMeasurement.height,
        0,
      );

      if (maxScrollY === 0) {
        translateY.value = 0;
        context.previousY = 0;
        return;
      }

      // Clamping removes iOS bounce and Android overscroll from the delta.
      const currentY = clamp(event.contentOffset.y, 0, maxScrollY);
      const previousY = context.previousY;
      context.previousY = currentY;

      if (previousY === undefined) {
        return;
      }

      const diff = currentY - previousY;

      if (diff === 0) {
        return;
      }

      const nextDirection = diff > 0 ? 1 : -1;
      let effectiveDiff = diff;

      if (context.direction !== nextDirection && nextDirection === -1) {
        const pendingDistance =
          (context.pendingDirectionDistance ?? 0) + Math.abs(diff);
        context.pendingDirectionDistance = pendingDistance;

        // Showing requires deliberate upward scrolling so small finger jitter
        // while moving down cannot reveal the tab bar. Hiding stays immediate.
        if (pendingDistance <= DIRECTION_CHANGE_THRESHOLD) {
          return;
        }

        effectiveDiff =
          nextDirection * (pendingDistance - DIRECTION_CHANGE_THRESHOLD);
        context.direction = nextDirection;
        context.pendingDirectionDistance = 0;
      } else {
        context.direction = nextDirection;
        context.pendingDirectionDistance = 0;
      }

      translateY.value = clamp(
        translateY.value + effectiveDiff * SCROLL_MULTIPLIER,
        0,
        TAB_BAR_HEIGHT,
      );
    },
    onEndDrag: () => {
      // Momentum begins just after end-drag. The short delay prevents an early
      // snap; onMomentumBegin cancels it when the list keeps moving.
      const target = translateY.value > TAB_BAR_HEIGHT / 2 ? TAB_BAR_HEIGHT : 0;
      translateY.value = withDelay(
        SNAP_DELAY_MS,
        withTiming(target, timingConfig),
      );
    },
    onMomentumBegin: () => {
      cancelAnimation(translateY);
    },
    onMomentumEnd: () => {
      const target = translateY.value > TAB_BAR_HEIGHT / 2 ? TAB_BAR_HEIGHT : 0;
      translateY.value = withTiming(target, timingConfig);
    },
  });

  const showTabBar = useShowTabBar();

  return {
    handleScroll,
    showTabBar,
  };
};

export const useShowTabBar = () => {
  const translateY = useTabBarTranslateY();

  return useCallback(() => {
    cancelAnimation(translateY);
    translateY.value = withTiming(0, timingConfig);
  }, [translateY]);
};

export const useTabBarAnimatedStyle = () => {
  const translateY = useTabBarTranslateY();

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
};
