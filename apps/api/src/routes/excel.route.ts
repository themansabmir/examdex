import { Router } from "express";
import multer from "multer";
import { ExcelService } from "../lib";
import {
  examService,
  subjectService,
  chapterService,
} from "../container";
import { BadRequestError, logger } from "../utils";
import { protect } from "../middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:moduleName", protect, upload.single("file"), async (req, res, next) => {
  try {
    const { moduleName } = req.params;
    const file = req.file;

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const data = ExcelService.parseExcel<any>(file.buffer);

    let result;
    switch (moduleName.toLowerCase()) {
      case "exam":
        ExcelService.validateHeaders(data, ["examCode", "examName"]);
        result = await examService.bulkCreateExams(data);
        break;
      case "subject":
        ExcelService.validateHeaders(data, ["subjectCode", "subjectName"]);
        result = await subjectService.bulkCreateSubjects(data);
        break;

      case "chapter":
        // Validate required headers
        ExcelService.validateHeaders(data, ["subjectCode", "chapterCode", "chapterName"]);

        // Group chapters by subjectCode
        const chaptersBySubject = new Map<string, any[]>();
        for (const row of data) {
          const subjectCode = row.subjectCode;
          if (!chaptersBySubject.has(subjectCode)) {
            chaptersBySubject.set(subjectCode, []);
          }
          chaptersBySubject.get(subjectCode)!.push({
            chapterCode: row.chapterCode,
            chapterName: row.chapterName,
            classId: row.classId,
          });
        }

        // Process each subject's chapters
        let totalCount = 0;
        for (const [subjectCode, chapters] of chaptersBySubject.entries()) {
          // Look up subject by code
          const subject = await subjectService.getSubjectByCode(subjectCode);
          if (!subject) {
            throw new BadRequestError(`Subject not found: ${subjectCode}`);
          }

          // Call bulk create with proper format
          const bulkResult = await chapterService.bulkCreateChapters({
            subjectId: subject.id,
            chapters,
          });
          totalCount += bulkResult.count;
        }

        result = { count: totalCount };
        break;
      default:
        throw new BadRequestError(`Invalid module name: ${moduleName}`);
    }

    res.status(201).json({
      success: true,
      data: result,
      message: `Successfully bulk inserted ${result.count} items into ${moduleName}`,
    });
  } catch (error) {
    logger.error("Bulk upload error:", error as Error);
    next(error);
  }
});

export { router as excelRoutes };
