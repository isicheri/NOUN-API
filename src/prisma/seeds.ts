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


//"ANP313" "ANP313_AEM783" "ANP314" "ANP401" "ANP403" "ANP407" "ANP501" "ANP502" "ANP503" "ANP504" "ANP505" "ANP506" "ANP507" "ANP508" "ANP509" "ANP510" "ANP511" "ANP512" "ANP513" "ANP514" 



const adminId = "1823d607-1ae1-46a9-a671-4ff13ba3cace";

const data = [
    {
    title: "ARA111",
    description:  `Course material for ARA111`,
    courseCode:  "ARA111",
    level:    "100",
    fileKey: "course-materials/ARA111.pdf",
    uploadedById: adminId,
    category: PdfCategory.COURSE_MATERIAL,
    isFree: true
    },
     {
    title: "ANP308",
    description:  `Course material for ANP308`,
    courseCode:  "ANP308",
    level:    "300",
    fileKey: "course-materials/ANP308.pdf",
    uploadedById: adminId,
    category: PdfCategory.COURSE_MATERIAL,
    isFree: true
    },
     {
    title: "ANP309",
    description:  `Course material for ANP309`,
    courseCode:  "ANP309",
    level:    "300",
    fileKey: "course-materials/ANP309.pdf",
    uploadedById: adminId,
    category: PdfCategory.COURSE_MATERIAL,
    isFree: true
    },
     {
    title: "ANP310",
    description:  `Course material for ANP310`,
    courseCode:  "ANP310",
    level:    "300",
    fileKey: "course-materials/ANP310.pdf",
    uploadedById: adminId,
    category: PdfCategory.COURSE_MATERIAL,
    isFree: true
    },
      {
    title: "ANP312",
    description:  `Course material for ANP312`,
    courseCode:  "ANP312",
    level:    "300",
    fileKey: "course-materials/ANP312.pdf",
    uploadedById: adminId,
    category: PdfCategory.COURSE_MATERIAL,
    isFree: true
    }
]

async function main() {
 try {
    await prisma.pDF.createMany({
        data: data
    })
 } catch (error) {
    console.log(error)
    throw error
 }  
}

main().then(() => {
    console.log("data successfully uploaded");
}).catch((error) => {
    throw error;
})
