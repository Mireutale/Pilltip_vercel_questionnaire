export const convertToRelativePath = (qrUrl: string): string => {
  // qrUrl에서 localhost:3000 부분을 제거하고 상대 경로로 변환
  return qrUrl.replace("localhost:3000", "");
};
