import { useRouter } from "expo-router";
import { useState } from "react";

const useDelayedNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigateWithDelay = (path: string, delay: number = 2000) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // @ts-ignore - Expo Router dynamic path typing
      router.navigate({ pathname: path });
    }, delay);
  };

  return { isLoading, navigateWithDelay };
};

export default useDelayedNavigation;
