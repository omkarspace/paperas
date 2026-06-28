import { PrismaClient, PaperStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    email: "admin@paperas.in",
    password: "Admin@123",
    name: "Dr. Admin User",
    role: "ADMIN" as const,
    institution: "Paperas",
    bio: "System administrator for Paperas journal platform.",
  },
  {
    email: "author@paperas.in",
    password: "Author@123",
    name: "Dr. Priya Sharma",
    role: "AUTHOR" as const,
    institution: "IIT Delhi",
    bio: "Associate Professor specializing in machine learning and agricultural AI.",
    orcid: "0000-0001-2345-6789",
  },
  {
    email: "reviewer@paperas.in",
    password: "Reviewer@123",
    name: "Dr. Rajesh Kumar",
    role: "REVIEWER" as const,
    institution: "IISc Bangalore",
    bio: "Professor of Environmental Science with expertise in water resource management.",
    orcid: "0000-0002-3456-7890",
  },
  {
    email: "editor@paperas.in",
    password: "Editor@123",
    name: "Dr. Ananya Patel",
    role: "EDITOR" as const,
    institution: "University of Mumbai",
    bio: "Managing Editor at Paperas, specializing in pharmacology.",
    orcid: "0000-0003-4567-8901",
  },
  {
    email: "author2@paperas.in",
    password: "Author@123",
    name: "Dr. Amit Verma",
    role: "AUTHOR" as const,
    institution: "IIT Bombay",
    bio: "Researcher in sustainable water resource management and IoT systems.",
  },
  {
    email: "author3@paperas.in",
    password: "Author@123",
    name: "Dr. Sneha Reddy",
    role: "AUTHOR" as const,
    institution: "University of Hyderabad",
    bio: "Pharmacologist studying traditional Indian medicine formulations.",
  },
];

const categories = [
  { name: "Computer Science" },
  { name: "Environmental Science" },
  { name: "Pharmacology" },
  { name: "Engineering" },
  { name: "Social Sciences" },
  { name: "Biotechnology" },
  { name: "Mathematics" },
  { name: "Physics" },
];

const papers = [
  {
    title: "Machine Learning Approaches for Agricultural Crop Prediction in Semi-Arid Regions",
    abstract: "This study presents a novel ensemble approach combining random forests and gradient boosting for crop yield prediction in semi-arid regions of India. Using satellite imagery, soil moisture data, and weather patterns collected over five years, we developed a model that predicts crop yields with 94% accuracy. Our approach outperforms existing methods by incorporating regional soil characteristics and monsoon variability. The model has been validated across three states covering 12,000 hectares of farmland, demonstrating its potential for precision agriculture in water-scarce regions.",
    keywords: "machine learning,crop prediction,precision agriculture,semi-arid,ensemble methods",
    status: "PUBLISHED" as PaperStatus,
    volume: 1,
    issue: 1,
    paperId: "RVJ-2026-0001",
    doi: "10.5555/RVJ-2026-0001",
    supplementaryUrls: "[]",
  },
  {
    title: "Sustainable Water Resource Management in Urban Indian Cities Using IoT",
    abstract: "An integrated framework for water resource management incorporating IoT sensors and predictive analytics is proposed for urban Indian cities. The system deploys low-cost water quality sensors across municipal distribution networks, coupled with machine learning models that predict contamination events 6 hours in advance with 89% accuracy. Pilot deployment in Pune demonstrates a 23% reduction in water wastage and a 40% improvement in quality compliance monitoring. The framework addresses the unique challenges of Indian municipal water systems including intermittent supply and aging infrastructure.",
    keywords: "water management,IoT,predictive analytics,urban infrastructure,sustainability",
    status: "PUBLISHED" as PaperStatus,
    volume: 1,
    issue: 1,
    paperId: "RVJ-2026-0002",
    doi: "10.5555/RVJ-2026-0002",
    supplementaryUrls: "[]",
  },
  {
    title: "Ayurvedic Formulations and Modern Pharmacology: A Systematic Review",
    abstract: "A comprehensive systematic review of Ayurvedic formulations with demonstrated pharmacological activity in modern preclinical and clinical studies. Following PRISMA guidelines, we analyzed 156 studies published between 2015-2025, covering formulations for anti-inflammatory, antioxidant, antimicrobial, and metabolic disorders. Results indicate that 67% of reviewed formulations showed statistically significant activity in validated models. Key herbs with strong evidence include Curcuma longa, Withania somnifera, and Tinospora cordifolia. This review bridges traditional knowledge with evidence-based pharmacology.",
    keywords: "Ayurveda,systematic review,pharmacology,traditional medicine,herbal formulations",
    status: "PUBLISHED" as PaperStatus,
    volume: 1,
    issue: 2,
    paperId: "RVJ-2026-0003",
    doi: "10.5555/RVJ-2026-0003",
    supplementaryUrls: "[]",
  },
  {
    title: "Impact of Climate Change on Himalayan Glacial Ecosystems",
    abstract: "This groundbreaking study provides the first comprehensive assessment of glacial retreat patterns across the Western Himalayas, combining satellite imagery with ground-truth measurements over a decade. Our analysis reveals an average retreat rate of 23 meters per year, significantly higher than previous estimates. The study documents cascading effects on downstream ecosystems, including changes in river flow patterns affecting 45 million people. We propose a multi-scale monitoring framework integrating remote sensing, in-situ measurements, and hydrological modeling for early warning systems.",
    keywords: "climate change,Himalayas,glacial retreat,remote sensing,ecosystems",
    status: "PUBLISHED" as PaperStatus,
    volume: 1,
    issue: 2,
    paperId: "RVJ-2026-0004",
    doi: "10.5555/RVJ-2026-0004",
    supplementaryUrls: "[]",
  },
  {
    title: "Blockchain-Based Land Registry System for Rural India",
    abstract: "An innovative application of distributed ledger technology to solve longstanding issues of land ownership disputes in Indian villages. The system uses a permissioned blockchain with smart contracts to record land transactions, verified by local authorities. A pilot study across 5 villages in Maharashtra demonstrates 99.7% accuracy in ownership records and a 78% reduction in dispute resolution time. The architecture addresses scalability concerns through a layered consensus mechanism and supports integration with existing revenue department systems.",
    keywords: "blockchain,land registry,rural India,smart contracts,governance",
    status: "SUBMITTED" as PaperStatus,
    paperId: "RVJ-2026-0005",
    supplementaryUrls: "[]",
  },
  {
    title: "Natural Language Processing for Low-Resource Indian Languages",
    abstract: "We present a multilingual transformer model fine-tuned for 12 low-resource Indian languages, achieving state-of-the-art results on sentiment analysis, named entity recognition, and text classification tasks. Using a novel transfer learning approach from high-resource languages combined with a curated corpus of 50 million tokens, our model outperforms existing baselines by 8-15% F1 score. The work addresses the critical gap in NLP tools for languages spoken by over 500 million people, with applications in digital governance and education.",
    keywords: "NLP,Indian languages,transformer models,low-resource,multilingual",
    status: "UNDER_REVIEW" as PaperStatus,
    paperId: "RVJ-2026-0006",
    supplementaryUrls: "[]",
  },
  {
    title: "Renewable Energy Microgrids for Remote Himalayan Communities",
    abstract: "Design and deployment of hybrid solar-wind microgrids for electrifying remote communities in Ladakh. The system integrates 50kW solar panels, 20kW wind turbines, and 200kWh battery storage, achieving 98.5% reliability over 18 months of operation. The microgrid design incorporates local weather patterns, terrain effects, and seasonal variations unique to high-altitude regions. Economic analysis shows 60% lower cost compared to grid extension, with a payback period of 4.2 years. The model is replicable across 1,200 similar un-electrified villages.",
    keywords: "microgrids,renewable energy,Ladakh,rural electrification,solar-wind hybrid",
    status: "REVISION_REQUESTED" as PaperStatus,
    paperId: "RVJ-2026-0007",
    supplementaryUrls: "[]",
  },
];

const reviews = [
  {
    comments: "Excellent study with robust methodology. The ensemble approach is well-justified and the validation across multiple states strengthens the findings. Minor suggestion: consider adding computational complexity analysis.",
    recommendation: "ACCEPT" as const,
    rating: 4,
    originalityRating: 4,
    qualityRating: 5,
  },
  {
    comments: "Strong paper with practical IoT deployment. The predictive analytics component is impressive. However, the paper could benefit from more discussion on sensor calibration in Indian water conditions and comparison with international benchmarks.",
    recommendation: "ACCEPT" as const,
    rating: 4,
    originalityRating: 4,
    qualityRating: 4,
  },
  {
    comments: "Valuable systematic review following PRISMA guidelines. The evidence synthesis is thorough. Suggestion: include a meta-analysis if quantitative data is sufficient, and expand the discussion on formulation standardization challenges.",
    recommendation: "ACCEPT" as const,
    rating: 4,
    originalityRating: 3,
    qualityRating: 4,
  },
];

async function main() {
  console.log("=== Research Verse Database Seed ===\n");

  // --- Users ---
  console.log("1. Creating users...");
  const createdUsers: Record<string, string> = {};

  for (const userData of users) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log(`  [skip] ${userData.email} already exists`);
      createdUsers[userData.email] = existing.id;
      continue;
    }
    const hashed = await bcrypt.hash(userData.password, 12);
    const user = await prisma.user.create({
      data: { ...userData, password: hashed, emailVerified: new Date() },
    });
    createdUsers[user.email] = user.id;
    console.log(`  [create] ${user.name} (${user.role})`);
  }

  // --- Categories ---
  console.log("\n2. Creating categories...");
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } });
    if (existing) {
      console.log(`  [skip] ${cat.name}`);
      continue;
    }
    await prisma.category.create({ data: cat });
    console.log(`  [create] ${cat.name}`);
  }

  // --- Papers ---
  console.log("\n3. Creating papers...");
  const authorId = createdUsers["author@researchverse.in"];
  const author2Id = createdUsers["author2@researchverse.in"];
  const author3Id = createdUsers["author3@researchverse.in"];
  const reviewerId = createdUsers["reviewer@researchverse.in"];

  const authorIds = [authorId, author2Id, author3Id];

  for (let i = 0; i < papers.length; i++) {
    const paperData = papers[i];
    const existing = await prisma.paper.findUnique({ where: { paperId: paperData.paperId } });
    if (existing) {
      console.log(`  [skip] ${paperData.paperId}`);
      continue;
    }

    const catName = paperData.keywords.includes("machine learning") || paperData.keywords.includes("blockchain") || paperData.keywords.includes("NLP") || paperData.keywords.includes("transformer") ? "Computer Science"
      : paperData.keywords.includes("water") || paperData.keywords.includes("climate") ? "Environmental Science"
      : paperData.keywords.includes("Ayurveda") || paperData.keywords.includes("pharmacology") ? "Pharmacology"
      : paperData.keywords.includes("microgrids") || paperData.keywords.includes("renewable") ? "Engineering"
      : "Computer Science";

    const category = await prisma.category.findUnique({ where: { name: catName } });

    const paper = await prisma.paper.create({
      data: {
        ...paperData,
        authorId: authorIds[i % authorIds.length],
        categoryId: category?.id || null,
        submissionDate: new Date(Date.now() - (papers.length - i) * 7 * 24 * 60 * 60 * 1000),
        publicationDate: paperData.status === "PUBLISHED" ? new Date(Date.now() - (papers.length - i) * 3 * 24 * 60 * 60 * 1000) : null,
      },
    });
    console.log(`  [create] ${paper.paperId} — ${paper.title.slice(0, 60)}...`);

    // Create reviews for published papers
    if (paperData.status === "PUBLISHED" && i < reviews.length) {
      const reviewData = reviews[i];
      await prisma.review.create({
        data: {
          paperId: paper.id,
          reviewerId: reviewerId,
          ...reviewData,
        },
      });
      console.log(`    [review] Review by Dr. Rajesh Kumar (${reviewData.recommendation})`);
    }
  }

  console.log("\n=== Seed Complete ===");
  console.log("\nTest Credentials:");
  console.log("  Admin:    admin@paperas.in / Admin@123");
  console.log("  Author:   author@paperas.in / Author@123");
  console.log("  Reviewer: reviewer@paperas.in / Reviewer@123");
  console.log("  Editor:   editor@paperas.in / Editor@123");
  console.log("  Author 2: author2@paperas.in / Author@123");
  console.log("  Author 3: author3@paperas.in / Author@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
