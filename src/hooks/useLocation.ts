// hooks/useLocation.ts - Flexible version with timeout
import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  country: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  detectionFailed: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectionFailed, setDetectionFailed] = useState(false);

  useEffect(() => {
    const detectLocation = async () => {
      // Set a timeout so we don't block users forever
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setDetectionFailed(true);
          setError("Location detection timed out");
        }
      }, 5000); // 5 second timeout

      try {
        const response = await fetch("https://ipapi.co/json/");
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();

          if (data.country_name) {
            setLocation({
              city: data.city || "",
              country: data.country_name,
            });
            setError(null);
            setDetectionFailed(false);
          } else {
            throw new Error("Invalid location data received");
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to detect location";
        console.error("Location detection error:", errorMessage);
        setError(errorMessage);
        setLocation(null);
        setDetectionFailed(true);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  return { location, isLoading, error, detectionFailed };
}
