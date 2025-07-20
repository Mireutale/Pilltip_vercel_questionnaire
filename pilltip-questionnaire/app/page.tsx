"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TokenForm from "@/components/TokenForm";
import QRUrlList from "@/components/QRUrlList";
import { useQRUrls } from "@/hooks/useQRUrls";
import { convertToRelativePath } from "@/utils/navigation";
import styles from "./page.module.css";

export default function HomePage() {
  const [accessToken, setAccessToken] = useState("");
  const { qrUrls, loading, error, fetchQRUrlsByToken } = useQRUrls();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchQRUrlsByToken(accessToken);
  };

  const handleQRUrlClick = (qrUrl: string) => {
    const relativePath = convertToRelativePath(qrUrl);
    router.push(relativePath);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <TokenForm
          accessToken={accessToken}
          onTokenChange={setAccessToken}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <QRUrlList qrUrls={qrUrls} onQRUrlClick={handleQRUrlClick} />
      </div>
    </div>
  );
}
