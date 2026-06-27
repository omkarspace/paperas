import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    email: "admin@researchverse.in",
    password: "Admin@123",
    name: "Dr. Admin User",
    role: "ADMIN" as const,
    institution: "Research Verse",
    bio: "System administrator for Research Verse journal platform.",
  },
  {
    email: "author@researchverse.in",
    password: "Author@123",
    name: "Dr. Priya Sharma",
    role: "AUTHOR" as const,
    institution: "IIT Delhi",
    bio: "Associate Professor specializing in machine learning and agricultural AI.",
    orcid: "0000-0001-2345-6789",
  },
  {
    email: "reviewer@researchverse.in",
    password: "Reviewer@123",
    name: "Dr. Rajesh Kumar",
    role: "REVIEWER" as const,
    institution: "IISc Bangalore",
    bio: "Professor of Environmental Science with expertise in water resource management.",
    orcid: "0000-0002-3456-7890",
  },
  {
    email: "editor@researchverse.in",
    password: "Editor@123",
    name: "Dr. Ananya Patel",
    role: "EDITOR" as const,
    institution: "University of Mumbai",
    bio: "Managing Editor at Research Verse, specializing in pharmacology.",
    orcid: "0000-0003-4567-8901",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exists, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    console.log(`Created user: ${user.name} (${user.role}) - ${user.email}`);
  }

  console.log("\nSeeding complete!");
  console.log("\n--- Test Credentials ---");
  console.log("Admin:   admin@researchverse.in / Admin@123");
  console.log("Author:  author@researchverse.in / Author@123");
  console.log("Reviewer: reviewer@researchverse.in / Reviewer@123");
  console.log("Editor:  editor@researchverse.in / Editor@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
