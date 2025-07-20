"use client";

import { useState } from "react";
import { QRUrlData } from "@/types/api";
import { fetchQRUrls } from "@/utils/api";

export const useQRUrls = () => {
  const [qrUrls, setQrUrls] = useState<QRUrlData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQRUrlsByToken = async (accessToken: string) => {
    if (!accessToken.trim()) {
      setError("액세스 토큰을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetchQRUrls(accessToken);

      if (result.status === "success") {
        setQrUrls(result.data);
      } else {
        setError(result.message || "데이터를 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      console.error("Error fetching QR URLs:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    qrUrls,
    loading,
    error,
    fetchQRUrlsByToken,
    clearError,
  };
};
