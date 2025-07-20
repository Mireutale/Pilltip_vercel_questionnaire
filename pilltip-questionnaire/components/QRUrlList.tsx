"use client";

import { QRUrlData } from "@/types/api";
import styles from "./QRUrlList.module.css";

interface QRUrlListProps {
  qrUrls: QRUrlData[];
  onQRUrlClick: (qrUrl: string) => void;
}

export default function QRUrlList({ qrUrls, onQRUrlClick }: QRUrlListProps) {
  if (qrUrls.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>문진표 목록 ({qrUrls.length}개)</h2>

      <div className={styles.list}>
        {qrUrls.map((item, index) => (
          <div
            key={index}
            className={styles.item}
            onClick={() => onQRUrlClick(item.qrUrl)}
          >
            <div className={styles.itemContent}>
              <div className={styles.itemInfo}>
                <h3 className={styles.patientName}>{item.realName}</h3>
                <p className={styles.linkText}>문진표 링크</p>
              </div>
              <div className={styles.arrowIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
