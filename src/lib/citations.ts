interface CitationPaper {
  title: string
  authors: { name: string }[]
  doi?: string | null
  publicationDate?: Date | null
  volume?: number | null
  issue?: number | null
  pages?: string
}

export function formatCitation(paper: CitationPaper, format: string): string {
  const year = paper.publicationDate?.getFullYear() || "n.d."
  const author = paper.authors[0]?.name || "Unknown"

  switch (format) {
    case "apa":
      return `${author} (${year}). ${paper.title}. Paperas, ${paper.volume || 1}(${paper.issue || 1}), ${paper.pages || "1-15"}.`

    case "mla":
      return `${author}. "${paper.title}." Paperas, vol. ${paper.volume || 1}, no. ${paper.issue || 1}, ${year}, pp. ${paper.pages || "1-15"}.`

    case "ieee":
      return `${author}, "${paper.title}," Paperas, vol. ${paper.volume || 1}, no. ${paper.issue || 1}, pp. ${paper.pages || "1-15"}, ${year}.`

    case "chicago":
      return `${author}. "${paper.title}." Paperas ${paper.volume || 1}, no. ${paper.issue || 1} (${year}): ${paper.pages || "1-15"}.`

    case "harvard":
      return `${author}, ${year}. ${paper.title}. Paperas, ${paper.volume || 1}(${paper.issue || 1}), pp. ${paper.pages || "1-15"}.`

    case "bibtex":
      return `@article{paperas_${year},
  author  = {${author}},
  title   = {${paper.title}},
  journal = {Paperas},
  year    = {${year}},
  volume  = {${paper.volume || 1}},
  number  = {${paper.issue || 1}},
  pages   = {${paper.pages || "1-15"}},
  doi     = {${paper.doi || ""}},
}`

    case "ris":
      return `TY  - JOUR
AU  - ${author}
TI  - ${paper.title}
JO  - Paperas
PY  - ${year}
VL  - ${paper.volume || 1}
IS  - ${paper.issue || 1}
SP  - ${paper.pages?.split("-")[0] || "1"}
EP  - ${paper.pages?.split("-")[1] || "15"}
DO  - ${paper.doi || ""}
ER  -`

    default:
      return `${author}. ${paper.title}. Paperas. ${year}.`
  }
}
