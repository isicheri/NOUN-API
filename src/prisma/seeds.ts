import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
//   await prisma.academicEvent.create({
//     data: {
//       title: "Semester Exam Clearance",
//       target: new Date("2025-10-01T09:00:00Z"), // Example target
//     },
//   });

 const events = [
    { title: "2025_2 TMA Begins", target: new Date("2025-08-18T00:00:00Z") },
    { title: "2025_2 POP Exam Begins", target: new Date("2025-10-07T00:00:00Z") },
    { title: "2025_2 e-Exam Begins", target: new Date("2025-11-04T00:00:00Z") },
    { title: "Application for Admissions", target: new Date("2025-12-31T00:00:00Z") }
  ];

  await prisma.academicEvent.createMany({
    data: events,
    skipDuplicates: true, // Optional: prevents inserting duplicates if already exists
  });

  console.log("Events seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
