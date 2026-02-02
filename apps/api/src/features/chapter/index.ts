import { Chapter } from "./chapter.entity";
import type { ChapterProps } from "./chapter.entity";

import type { CreateChapterInputDTO, UpdateChapterInputDTO, ChapterOutputDTO } from "./chapter.dto";

import type { IChapterRepository } from "./chapter.repository";
import { PrismaChapterRepository } from "./chapter.repository";

import { ChapterService } from "./chapter.service";

import { ChapterController } from "./chapter.controller";

export * from "./chapter.schema";

export { Chapter, ChapterProps };
export type { CreateChapterInputDTO, UpdateChapterInputDTO, ChapterOutputDTO };
export type { IChapterRepository };
export { PrismaChapterRepository };
export { ChapterService };
export { ChapterController };
