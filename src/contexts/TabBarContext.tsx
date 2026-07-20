import { createContext, type ReactNode } from "react";
import { type SharedValue, useSharedValue } from "react-native-reanimated";

export const TabBarContext = createContext<SharedValue<number> | null>(null);

export const TabBarProvider = ({ children }: { children: ReactNode }) => {
  const translateY = useSharedValue(0);

  return (
    <TabBarContext.Provider value={translateY}>
      {children}
    </TabBarContext.Provider>
  );
};
