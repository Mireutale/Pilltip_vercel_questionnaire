"use client";

import styles from "./TokenForm.module.css";

interface TokenFormProps {
  accessToken: string;
  onTokenChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function TokenForm({
  accessToken,
  onTokenChange,
  onSubmit,
  loading,
  error,
}: TokenFormProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pilltip 문진표 시스템</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="accessToken" className={styles.label}>
            액세스 토큰
          </label>
          <input
            type="text"
            id="accessToken"
            value={accessToken}
            onChange={(e) => onTokenChange(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "조회 중..." : "문진표 목록 조회"}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
