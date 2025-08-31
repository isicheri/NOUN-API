// prisma/seed-batch2.ts

import { PrismaClient, PdfCategory } from "@prisma/client";

const prisma = new PrismaClient();

// async function main() {
//  // Batch 3 — with `level` added
// await prisma.pDF.createMany({
//   data: [
//     {
//       title: "AEM411",
//       description: "Course material for AEM411",
//       fileKey: "course-materials/AEM411.pdf",
//       courseCode: "AEM411",
//       level: "400",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM451",
//       description: "Course material for AEM451",
//       fileKey: "course-materials/AEM451.pdf",
//       courseCode: "AEM451",
//       level: "400",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM458",
//       description: "Course material for AEM458",
//       fileKey: "course-materials/AEM458.pdf",
//       courseCode: "AEM458",
//       level: "400",
//       category: "COURSE_MATERIAL",
//      isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM501",
//       description: "Course material for AEM501",
//       fileKey: "course-materials/AEM501.pdf",
//       courseCode: "AEM501",
//       level: "500",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM502",
//       description: "Course material for AEM502",
//       fileKey: "course-materials/AEM502.pdf",
//       courseCode: "AEM502",
//       level: "500",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM503",
//       description: "Course material for AEM503",
//       fileKey: "course-materials/AEM503.pdf",
//       courseCode: "AEM503",
//       level: "500",
//       category: "COURSE_MATERIAL",
//      isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM505",
//       description: "Course material for AEM505",
//       fileKey: "course-materials/AEM505.pdf",
//       courseCode: "AEM505",
//       level: "500",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM506",
//       description: "Course material for AEM506",
//       fileKey: "course-materials/AEM506.pdf",
//       courseCode: "AEM506",
//       level: "500",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM507",
//       description: "Course material for AEM507",
//       fileKey: "course-materials/AEM507.pdf",
//       courseCode: "AEM507",
//       level: "500",
//       category: "COURSE_MATERIAL",
//      isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     },
//     {
//       title: "AEM508",
//       description: "Course material for AEM508",
//       fileKey: "course-materials/AEM508.pdf",
//       courseCode: "AEM508",
//       level: "500",
//       category: "COURSE_MATERIAL",
//       isFree: true,
//       uploadedById: "1823d607-1ae1-46a9-a671-4ff13ba3cace"
//     }
//   ],
// });
//   console.log("✅ Batch 4 seeding complete!");
// }

async function main() {
await prisma.pDF.updateMany({where: {isFree : false},data: {
  isFree: true
}})
console.log("done updated")
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
