import { db } from "../db";

export async function incrementPaperView(paperId: string) {
  const existing = await db.paperAnalytics.findUnique({
    where: { paperId },
  });

  if (existing) {
    return db.paperAnalytics.update({
      where: { paperId },
      data: { views: { increment: 1 } },
    });
  }

  return db.paperAnalytics.create({
    data: { paperId, views: 1 },
  });
}

export async function incrementPaperDownload(paperId: string) {
  const existing = await db.paperAnalytics.findUnique({
    where: { paperId },
  });

  if (existing) {
    return db.paperAnalytics.update({
      where: { paperId },
      data: { downloads: { increment: 1 } },
    });
  }

  return db.paperAnalytics.create({
    data: { paperId, downloads: 1 },
  });
}

export async function getPaperAnalytics(paperId: string) {
  return db.paperAnalytics.findUnique({
    where: { paperId },
  });
}

export async function getAllAnalytics() {
  const [totalViews, totalDownloads] = await Promise.all([
    db.paperAnalytics.aggregate({ _sum: { views: true } }),
    db.paperAnalytics.aggregate({ _sum: { downloads: true } }),
  ]);

  return {
    totalViews: totalViews._sum.views || 0,
    totalDownloads: totalDownloads._sum.downloads || 0,
  };
}
