// prisma/seed-batch2.ts

import { PrismaClient, PdfCategory } from "@prisma/client";

const prisma = new PrismaClient();




//   title        String
//   description  String
//   courseCode   String
//   level        String
//   price        Float       @default(0.0)
//   fileKey      String
//   uploadedById String
//   category     PdfCategory
//   isFree       Boolean     @default(false)


//  "ARA421" "ARA422" "ARA424" "ARA425" "ARA426" 


const adminId = "1823d607-1ae1-46a9-a671-4ff13ba3cace";

// const data = [
//     {
//     title: "ARA421",
//     description:  `Course material for ARA421`,
//     courseCode:  "ARA421",
//     level:    "400",
//     fileKey: "course-materials/ARA421.pdf",
//     uploadedById: adminId,
//     category: PdfCategory.COURSE_MATERIAL,
//     isFree: true
//     },
//      {
//     title: "ARA422",
//     description:  `Course material for ARA422`,
//     courseCode:  "ARA422",
//     level:    "400",
//     fileKey: "course-materials/ARA422.pdf",
//     uploadedById: adminId,
//     category: PdfCategory.COURSE_MATERIAL,
//     isFree: true
//     },
//      {
//     title: "ARA424",
//     description:  `Course material for ARA424`,
//     courseCode:  "ARA424",
//     level:    "400",
//     fileKey: "course-materials/ARA424.pdf",
//     uploadedById: adminId,
//     category: PdfCategory.COURSE_MATERIAL,
//     isFree: true
//     },
//      {
//     title: "ARA425",
//     description:  `Course material for ARA425`,
//     courseCode:  "ARA425",
//     level:    "400",
//     fileKey: "course-materials/ARA425.pdf",
//     uploadedById: adminId,
//     category: PdfCategory.COURSE_MATERIAL,
//     isFree: true
//     },
//     {
//     title: "ARA426",
//     description:  `Course material for ARA426`,
//     courseCode:  "ARA426",
//     level:    "400",
//     fileKey: "course-materials/ARA426.pdf",
//     uploadedById: adminId,
//     category: PdfCategory.COURSE_MATERIAL,
//     isFree: true
//     }
// ]

async function main() {
//  try {
//     await prisma.pDF.createMany({
//         data: data
//     })
//  } catch (error) {
//     console.log(error)
//     throw error
//  }  

try {

     await prisma.$transaction(async(tx) => {
        let findPdf = await tx.pDF.findFirst({
            where: {
                title: "AEA303"
            }
        })


     return  await tx.pDF.delete({where: {
            id: findPdf?.id
        }})

    })

    return "deleted successfully"

} catch (error) {
    throw error;
}
}

main().then((x) => {
    console.log(x);
}).catch((error) => {
    throw error;
})
