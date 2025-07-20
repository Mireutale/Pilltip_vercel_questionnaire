"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import pilltipLogo from "@/public/Pilltip.svg";
import styles from "./page.module.css";

interface TokenFormProps {
  accessToken: string;
  onTokenChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

function TokenForm({
  accessToken,
  onTokenChange,
  onSubmit,
  loading,
  error,
}: TokenFormProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={pilltipLogo.src} alt="logo" />
      </div>

      <div className={styles.centerContent}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="식별 코드 입력"
              value={accessToken}
              onChange={(e) => onTokenChange(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.iconButton}
              disabled={loading}
            >
              →
            </button>
          </div>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        <a href="#" className={styles.footer}>
          사용에 문제가 있으신가요?
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken.trim()) {
      setError("병원 식별코드를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 환자 리스트 페이지로 이동하면서 토큰을 쿼리 파라미터로 전달
      router.push(`/patients?token=${encodeURIComponent(accessToken)}`);
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <TokenForm
        accessToken={accessToken}
        onTokenChange={setAccessToken}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
