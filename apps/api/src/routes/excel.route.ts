import { Router } from "express";
import multer from "multer";
import { ExcelService } from "../lib";
import { examService, subjectService, chapterService } from "../container";
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
        ExcelService.validateHeaders(data, ["subjectId", "chapterCode", "chapterName"]);
        result = await chapterService.bulkCreateChapters(data);
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
