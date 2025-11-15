import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  country: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();

          // Check if we got valid location data
          if (data.country_name) {
            setLocation({
              city: data.city || "",
              country: data.country_name,
            });
            setError(null);
          } else {
            throw new Error("Invalid location data received");
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to detect location";
        console.error("Location detection error:", errorMessage);
        setError(errorMessage);
        setLocation(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  return { location, isLoading, error };
}
