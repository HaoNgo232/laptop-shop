/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import type { NavigateOptions } from "react-router-dom";

/**
 * Custom hook đơn giản để clear error khi component mount
 */
export function useErrorHandler(clearError: () => void) {
  useEffect(() => {
    clearError();
  }, []); // Luôn clear error khi component mount
}

/**
 * Custom hook để redirect khi đã authenticated
 * Tái sử dụng logic chung giữa Login và Register page
 */
export function useAuthRedirect(
  isAuthenticated: boolean,
  navigate: (path: string, options?: NavigateOptions) => void,
) {
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
}
