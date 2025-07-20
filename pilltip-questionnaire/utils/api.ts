import { ApiResponse } from "@/types/api";

const API_BASE_URL = "https://pilltip.com:20022";

export const fetchQRUrls = async (
  accessToken: string
): Promise<ApiResponse> => {
  const url = `${API_BASE_URL}/api/questionnaire/qr-url/all?accessToken=${accessToken}`;

  console.log("[API DEBUG] 요청 URL:", url);
  console.log("[API DEBUG] Base URL:", API_BASE_URL);
  console.log("[API DEBUG] Access Token:", accessToken);

  try {
    const response = await fetch(url);

    console.log("[API DEBUG] 응답 상태:", response.status);
    console.log("[API DEBUG] 응답 상태 텍스트:", response.statusText);
    console.log(
      "[API DEBUG] 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API DEBUG] 에러 응답 본문:", errorText);
      throw new Error(
        `API 호출에 실패했습니다. 상태: ${response.status}, 메시지: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("[API DEBUG] 성공 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("[API DEBUG] 네트워크 에러:", error);
    console.error(
      "[API DEBUG] 에러 타입:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "[API DEBUG] 에러 메시지:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};
