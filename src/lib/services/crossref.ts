interface PaperForDOI {
  paperId: string
  title: string
  authorName: string
  publicationDate: Date
}

export async function registerDOI(paper: PaperForDOI) {
  const depositorEmail = process.env.CROSSREF_EMAIL
  const prefix = process.env.DOI_PREFIX || "xxxx"

  if (!depositorEmail) {
    console.warn("Crossref email not configured — DOI registration skipped")
    return null
  }

  const doi = `10.${prefix}/paperas-${paper.paperId.toLowerCase()}`
  const url = process.env.CROSSREF_API_URL || "https://api.crossref.org"

  const payload = {
    doi,
    type: "journal-article",
    title: paper.title,
    author: [
      {
        name: paper.authorName,
        sequence: "first",
      },
    ],
    published: {
      date_parts: [[paper.publicationDate.getFullYear(), paper.publicationDate.getMonth() + 1, paper.publicationDate.getDate()]],
    },
  }

  const apiUser = process.env.CROSSREF_API_USER
  const apiPassword = process.env.CROSSREF_API_PASSWORD

  const authHeader = apiUser && apiPassword
    ? "Basic " + Buffer.from(`${apiUser}:${apiPassword}`).toString("base64")
    : undefined

  try {
    const response = await fetch(`${url}/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(payload),
    })
    return { success: response.ok, doi }
  } catch (error) {
    console.error("DOI registration failed:", error)
    return { success: false, doi }
  }
}
