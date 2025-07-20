export interface QRUrlData {
  realName: string;
  qrUrl: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: QRUrlData[];
}

export interface TokenRequest {
  accessToken: string;
}
