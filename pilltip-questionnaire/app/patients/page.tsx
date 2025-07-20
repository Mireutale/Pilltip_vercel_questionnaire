"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQRUrls } from "@/hooks/useQRUrls";
import { convertToRelativePath } from "@/utils/navigation";
import styles from "./page.module.css";
import searchIcon from "@/public/SearchIcon.svg";
import calendarOutline from "@/public/CalendarOutline.svg";
import cogOutline from "@/public/CogOutline.svg";
import userCircle from "@/public/UserCircle.svg";

export default function PatientsPage() {
  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { qrUrls, loading, error, fetchQRUrlsByToken } = useQRUrls();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditingStart, setIsEditingStart] = useState(false);
  const [isEditingEnd, setIsEditingEnd] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const formatKoreanDate = (date: string) => {
    const dateObj = new Date(date);
    return `${dateObj.getFullYear()}년 ${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}월 ${String(dateObj.getDate()).padStart(2, "0")}일`;
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      fetchQRUrlsByToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleQRUrlClick = (qrUrl: string) => {
    const relativePath = convertToRelativePath(qrUrl);
    router.push(relativePath);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const filteredQrUrls = qrUrls.filter((qrUrl) =>
    qrUrl.realName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  {qrUrls.length > 0 ? qrUrls[0].hospitalName : "병원명 없음"}
                </span>
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>미확인 문진표</span>
                <span className={styles.menuValue}>
                  {
                    qrUrls.filter((qrUrl) => {
                      const now = Date.now();
                      const koreaTimeOffset = 9 * 60 * 60 * 1000;
                      const nowInKorea = now + koreaTimeOffset;
                      return qrUrl.expirationDate > nowInKorea;
                    }).length
                  }
                </span>
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>전체 문진표</span>
                <span className={styles.menuValue}>{qrUrls.length}</span>
              </div>
              <div className={styles.menuItem}>
                <button className={styles.logoutButton}>로그아웃</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>문진표 관리</h1>
          </div>

          {/* Search and Filter Section */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <img
                src={searchIcon.src}
                alt="search"
                className={styles.searchIcon}
              />
              <input
                type="text"
                placeholder="환자명을 입력해주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.dateAndManageContainer}>
              <div className={styles.dateFilters}>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    value={formatKoreanDate(startDate)}
                    onFocus={() => setIsEditingStart(true)}
                    onBlur={() => setIsEditingStart(false)}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.dateInput}
                    readOnly
                    onClick={() => {
                      const hiddenInput = document.querySelector(
                        `.${styles.hiddenDateInput}`
                      ) as HTMLInputElement;
                      if (hiddenInput) hiddenInput.showPicker();
                    }}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.hiddenDateInput}
                  />
                  <img
                    src={calendarOutline.src}
                    alt="calendar"
                    className={styles.calendarIcon}
                    onClick={() => {
                      const hiddenInput = document.querySelector(
                        `.${styles.hiddenDateInput}`
                      ) as HTMLInputElement;
                      if (hiddenInput) hiddenInput.showPicker();
                    }}
                  />
                </div>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    value={formatKoreanDate(endDate)}
                    onFocus={() => setIsEditingEnd(true)}
                    onBlur={() => setIsEditingEnd(false)}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.dateInput}
                    readOnly
                    onClick={() => {
                      const hiddenInput = document.querySelector(
                        `.${styles.hiddenDateInput}`
                      ) as HTMLInputElement;
                      if (hiddenInput) hiddenInput.showPicker();
                    }}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.hiddenDateInput}
                  />
                  <img
                    src={calendarOutline.src}
                    alt="calendar"
                    className={styles.calendarIcon}
                    onClick={() => {
                      const hiddenInput = document.querySelector(
                        `.${styles.hiddenDateInput}`
                      ) as HTMLInputElement;
                      if (hiddenInput) hiddenInput.showPicker();
                    }}
                  />
                </div>
              </div>
              <button className={styles.manageButton}>
                <img
                  src={cogOutline.src}
                  alt="settings"
                  className={styles.cogIcon}
                />
                문진표 관리
              </button>
            </div>
          </div>

          {/* Patient Table */}
          <div className={styles.tableContainer}>
            <table className={styles.patientTable}>
              <thead>
                <tr>
                  <th>제출 시각</th>
                  <th>남은 조회 시간</th>
                  <th>주소</th>
                  <th>성별</th>
                  <th>나이</th>
                  <th>환자명</th>
                  <th>환자 연락처</th>
                  <th>복약 여부</th>
                  <th>알러지 유무</th>
                  <th>조회하기</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className={styles.loadingCell}>
                      로딩 중...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className={styles.errorCell}>
                      {error}
                    </td>
                  </tr>
                ) : filteredQrUrls.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={styles.emptyCell}>
                      현재 문진표가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredQrUrls.map((qrUrl, index) => {
                    // 남은 조회 시간 계산
                    const now = Date.now();
                    const expirationTime = qrUrl.expirationDate;

                    // 현재 시간을 한국 시간으로 조정
                    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
                    const nowInKorea = now + koreaTimeOffset;

                    const timeLeft = expirationTime - nowInKorea;
                    const isExpired = timeLeft <= 0;

                    // 나이 계산
                    const birthYear = new Date(qrUrl.birthDate).getFullYear();
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - birthYear;

                    // 성별 한글 변환
                    const genderText =
                      qrUrl.gender === "MALE"
                        ? "남"
                        : qrUrl.gender === "FEMALE"
                        ? "여"
                        : "-";

                    // 제출 시각 포맷팅
                    const createDate = new Date(qrUrl.createDate);
                    const formattedDate = `${createDate.getFullYear()}/${String(
                      createDate.getMonth() + 1
                    ).padStart(2, "0")}/${String(createDate.getDate()).padStart(
                      2,
                      "0"
                    )} ${String(createDate.getHours()).padStart(
                      2,
                      "0"
                    )}:${String(createDate.getMinutes()).padStart(2, "0")}`;

                    return (
                      <tr key={index}>
                        <td>{formattedDate}</td>
                        <td>
                          {isExpired
                            ? "-"
                            : `${Math.floor(timeLeft / (1000 * 60))}분`}
                        </td>
                        <td>{isExpired ? "-" : qrUrl.address || "-"}</td>
                        <td>{isExpired ? "-" : genderText}</td>
                        <td>{isExpired ? "-" : `${age}세`}</td>
                        <td>{qrUrl.realName}</td>
                        <td>{isExpired ? "-" : qrUrl.phoneNumber || "-"}</td>
                        <td>
                          {isExpired ? "-" : qrUrl.isMedication ? "유" : "무"}
                        </td>
                        <td>
                          {isExpired ? "-" : qrUrl.isAllergy ? "유" : "무"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleQRUrlClick(qrUrl.qrUrl)}
                            className={
                              !isExpired
                                ? styles.viewButton
                                : styles.requestButton
                            }
                          >
                            {!isExpired ? "조회하기" : "재요청하기"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
