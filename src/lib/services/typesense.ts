import Typesense from "typesense";
import { logger } from "@/lib/logger";

const typesenseClient = process.env.TYPESENSE_API_KEY
  ? new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST || "localhost",
          port: Number(process.env.TYPESENSE_PORT) || 8108,
          protocol: process.env.TYPESENSE_PROTOCOL || "http",
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    })
  : null;

export async function searchPapers(query: string, page: number = 1) {
  if (!typesenseClient) {
    return { papers: [], total: 0, page, totalPages: 0 };
  }

  try {
    const perPage = 20;
    const result = await typesenseClient.collections("papers").documents().search({
      q: query || "*",
      query_by: "title,abstract,keywords",
      page,
      per_page: perPage,
    });

    return {
      papers: result.hits?.map((hit) => hit.document) || [],
      total: result.found || 0,
      page,
      totalPages: Math.ceil((result.found || 0) / perPage),
    };
  } catch (error) {
    logger.error("Failed to search papers", { error: error instanceof Error ? error.message : String(error) });
    return { papers: [], total: 0, page, totalPages: 0 };
  }
}

export async function indexPaper(paper: {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  keywords: string;
  authorName?: string;
  categoryName?: string;
}) {
  if (!typesenseClient) return;
  try {
    await typesenseClient.collections("papers").documents().upsert(paper);
  } catch (error) {
    logger.error("Failed to index paper", { error: error instanceof Error ? error.message : String(error) });
  }
}

export async function removePaperIndex(paperId: string) {
  if (!typesenseClient) return;
  try {
    await typesenseClient.collections("papers").documents(paperId).delete();
  } catch {
    // Document may not exist
  }
}

export default typesenseClient;
