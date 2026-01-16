export type ExamStatus = "draft" | "published" | "archived";

export interface ExamProps {
  id?: string;
  title: string;
  description?: string | null;
  userId: string;
  status?: ExamStatus;
  duration?: number;
  passingScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Exam {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly userId: string;
  public readonly status: ExamStatus;
  public readonly duration: number;
  public readonly passingScore: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ExamProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.title = props.title;
    this.description = props.description ?? null;
    this.userId = props.userId;
    this.status = props.status ?? "draft";
    this.duration = props.duration ?? 60;
    this.passingScore = props.passingScore ?? 70;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (this.title.trim().length < 3) {
      throw new Error("Exam title must be at least 3 characters");
    }
    if (this.duration < 1 || this.duration > 480) {
      throw new Error("Exam duration must be between 1 and 480 minutes");
    }
    if (this.passingScore < 0 || this.passingScore > 100) {
      throw new Error("Passing score must be between 0 and 100");
    }
  }

  canBePublished(): boolean {
    return this.status === "draft";
  }

  canBeArchived(): boolean {
    return this.status === "published";
  }

  publish(): Exam {
    if (!this.canBePublished()) {
      throw new Error("Only draft exams can be published");
    }
    return new Exam({
      ...this.toProps(),
      status: "published",
      updatedAt: new Date(),
    });
  }

  archive(): Exam {
    if (!this.canBeArchived()) {
      throw new Error("Only published exams can be archived");
    }
    return new Exam({
      ...this.toProps(),
      status: "archived",
      updatedAt: new Date(),
    });
  }

  private toProps(): ExamProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      userId: this.userId,
      status: this.status,
      duration: this.duration,
      passingScore: this.passingScore,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
