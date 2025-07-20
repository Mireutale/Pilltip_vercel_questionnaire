export interface QRUrlData {
  realName: string;
  qrUrl: string;
  createDate: string;
  expirationDate: number;
  address: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  isMedication: boolean;
  isAllergy: boolean;
  isChronicDisease: boolean;
  isSurgeryHistory: boolean;
  hospitalName: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: QRUrlData[];
}

export interface TokenRequest {
  accessToken: string;
}
