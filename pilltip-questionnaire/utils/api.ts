import { ApiResponse } from "@/types/api";

const API_BASE_URL = "http://localhost:20022";

export const fetchQRUrls = async (
  accessToken: string
): Promise<ApiResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/questionnaire/qr-url/all?accessToken=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("API 호출에 실패했습니다.");
  }

  return response.json();
};
