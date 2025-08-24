import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 const events = [
   { title: "Session", target: new Date("2026-01-20T23:59:59Z") },
    { title: "Semester", target: new Date("2025-11-30T23:59:59Z") },
    { title: "Registration (Semester, course and examination)", target: new Date("2025-09-28T23:59:59Z") },
    { title: "Dropping of course for exam", target: new Date("2025-09-28T23:59:59Z") },
    { title: "Requests for change...", target: new Date("2025-09-28T23:59:59Z") },
    { title: "Tutor Marked Assignment (TMA)", target: new Date("2025-09-28T23:59:59Z") },
    { title: "Examination", target: new Date("2025-11-27T23:59:59Z") },
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
