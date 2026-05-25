"use client";

export function DownloadButton({ pdfUrl, paperId }: { pdfUrl: string; paperId: string }) {
  function handleDownload() {
    fetch(`/api/analytics/${paperId}/download`, { method: "POST" }).catch(() => {});
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleDownload}
      className="text-primary hover:underline cursor-pointer"
    >
      Download PDF
    </button>
  );
}
