import React, { createContext, useContext } from "react";
import useAnimationsData from "./useAnimationsData";

// Create a context
const AnimationsContext = createContext();

// Create a provider component
export function AnimationsProvider({ children, ...props }) {
  const animationsData = useAnimationsData(props);

  return (
    <AnimationsContext.Provider value={animationsData}>
      {children}
    </AnimationsContext.Provider>
  );
}

// Custom hook to use the AnimationsContext
export function useAnimations() {
  const context = useContext(AnimationsContext);
  if (!context) {
    throw new Error("useAnimations must be used within an AnimationsProvider");
  }
  return context;
}
