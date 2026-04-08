import { Request, Response, NextFunction } from "express";
import { StudentService } from "./student.service";
import { studentOnBoardingSchema } from "./student.schema";

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ✅ Student Onboarding API
  onboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate request body
      const parsedData = studentOnBoardingSchema.parse({ ...req.body, ...req.user }); // merge req.user for email if needed

      if (!parsedData.email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const onboardingInput = {
        ...parsedData,
        email: parsedData.email,
      };

      // 2. Call service
      const result = await this.studentService.onboarding(onboardingInput);

      // 3. Send response
      return res.status(200).json({
        success: true,
        message: "Student onboarded successfully",
        data: result,
      });
    } catch (error) {
      next(error); // pass to global error handler
    }
  };
}
