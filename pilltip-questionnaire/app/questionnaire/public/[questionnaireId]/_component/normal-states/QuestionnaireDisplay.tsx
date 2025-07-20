"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./QuestionnaireDisplay.module.css";
import BasicInfo from "./BasicInfo";
import MedicationInfoBlock from "./MedicationInfo";
import AllergyInfoBlock from "./AllergyInfo";
import ChronicDiseaseInfoBlock from "./ChronicDiseaseInfo";
import SurgeryHistoryInfoBlock from "./SurgeryHistoryInfo";
import Notes from "./Notes";
import { downloadTxtFile } from "@/app/questionnaire/QuestionnaireTxtDownloadButton";
import {
  MedicationInfo,
  AllergyInfo,
  ChronicDiseaseInfo,
  SurgeryHistoryInfo,
  QuestionnaireDisplayProps,
} from "@/types/questionnaire";
import userCircle from "@/public/UserCircle.svg";

export default function QuestionnaireDisplay({
  questionnaire,
  timeUntilExpiration,
}: QuestionnaireDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // 시간을 분:초 형태로 변환하는 함수
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  function safeParse(data: any) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  }

  // medicationInfo: medication_id or medicationId
  const medicationInfoRaw = questionnaire.data.medicationInfo;
  const medicationInfo = safeParse(medicationInfoRaw).map((item: any) => ({
    medication_id: item.medication_id ?? item.medicationId ?? "",
    medication_name: item.medication_name ?? item.medicationName ?? "",
    submitted: item.submitted,
  }));

  // allergyInfo: allergy_name or allergyName
  const allergyInfoRaw = questionnaire.data.allergyInfo;
  const allergyInfo = safeParse(allergyInfoRaw).map((item: any) => ({
    allergy_name: item.allergy_name ?? item.allergyName ?? "",
    submitted: item.submitted,
  }));

  // chronicDiseaseInfo: chronicDisease_name or chronicDiseaseName
  const chronicDiseaseInfoRaw = questionnaire.data.chronicDiseaseInfo;
  const chronicDiseaseInfo = safeParse(chronicDiseaseInfoRaw).map(
    (item: any) => ({
      chronicDisease_name:
        item.chronicDisease_name ?? item.chronicDiseaseName ?? "",
      submitted: item.submitted,
    })
  );

  // surgeryHistoryInfo: surgeryHistory_name or surgeryHistoryName
  const surgeryHistoryInfoRaw = questionnaire.data.surgeryHistoryInfo;
  const surgeryHistoryInfo = safeParse(surgeryHistoryInfoRaw).map(
    (item: any) => ({
      surgeryHistory_name:
        item.surgeryHistory_name ?? item.surgeryHistoryName ?? "",
      submitted: item.submitted,
    })
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (questionnaire && questionnaire.expirationDate) {
      const expirationTime = new Date(questionnaire.expirationDate).getTime();
      const updateRemaining = () => {
        const currentTime = new Date().getTime();
        const remainingTime = expirationTime - currentTime;
        setRemainingSeconds(
          remainingTime > 0 ? Math.ceil(remainingTime / 1000) : 0
        );
      };
      updateRemaining();
      timer = setInterval(updateRemaining, 1000);
      if (expirationTime - new Date().getTime() > 0) {
        const reloadTimer = setTimeout(() => {
          window.location.reload();
        }, expirationTime - new Date().getTime());
        // 컴포넌트 언마운트 시 타이머 정리
        return () => {
          clearInterval(timer!);
          clearTimeout(reloadTimer);
        };
      } else {
        // 이미 만료된 경우 바로 새로고침
        window.location.reload();
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [questionnaire]);

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>문진표 관리 [병원용]</div>
        <div className={styles.topBarRight}>
          <button onClick={toggleUserMenu} className={styles.userIcon}>
            <img
              src={userCircle.src}
              alt="user"
              className={styles.userIconImg}
            />
          </button>
          {showUserMenu && (
            <div className={styles.userMenu}>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>병원명</span>
                <span className={styles.menuValue}>
                  {questionnaire.data.hospitalName || "병원명 없음"}
                </span>
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>문진표 ID</span>
                <span className={styles.menuValue}>
                  {questionnaire.data.questionnaireId}
                </span>
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>환자명</span>
                <span className={styles.menuValue}>
                  {questionnaire.data.realName || "환자명 없음"}
                </span>
              </div>
              <div className={styles.menuItem}>
                <button
                  className={styles.logoutButton}
                  onClick={handleBackToHome}
                >
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.questionnaireHeader}>
              <h2>문진표</h2>
              <p>문진표 내부 수정은 불가합니다.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.header}>
                <h1 className={styles.title}>
                  {questionnaire.data.questionnaireName}
                </h1>
                <div className={styles.questionnaireId}>
                  {questionnaire.data.questionnaireId}
                </div>
              </div>
              <div className={styles.divider} />

              <div className={styles.grid}>
                <BasicInfo data={questionnaire.data} />
                <MedicationInfoBlock medicationInfo={medicationInfo} />
                <AllergyInfoBlock allergyInfo={allergyInfo} />
                <ChronicDiseaseInfoBlock
                  chronicDiseaseInfo={chronicDiseaseInfo}
                />
                <SurgeryHistoryInfoBlock
                  surgeryHistoryInfo={surgeryHistoryInfo}
                />
              </div>
              <div className={styles.divider} />
              <div className={styles.infoItem}>
                <Notes notes={questionnaire.data.notes ?? ""} />
                <span> 작성일 : {questionnaire.data.lastModifiedDate}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsDownloading(true);
                downloadTxtFile({
                  ...questionnaire.data,
                  medicationInfo,
                  allergyInfo,
                  chronicDiseaseInfo,
                  surgeryHistoryInfo,
                });
                setIsDownloading(false);
              }}
              disabled={isDownloading}
              className={styles.downloadButton}
            >
              {isDownloading ? "다운로드 중..." : "출력하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
