import { createContext, type ReactNode, useRef } from "react";
import { Animated } from "react-native";

export const TabBarContext = createContext<Animated.Value | null>(null);

export const TabBarProvider = ({ children }: { children: ReactNode }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  return (
    <TabBarContext.Provider value={translateY}>
      {children}
    </TabBarContext.Provider>
  );
};
