export interface ChapterProps {
  id: string;
  subjectId: string;
  chapterCode: string;
  chapterName: string;
  classId: string | null;
  isActive: boolean;
}

export class Chapter {
  readonly id: string;
  readonly subjectId: string;
  readonly chapterCode: string;
  readonly chapterName: string;
  readonly classId: string | null;
  readonly isActive: boolean;

  constructor(props: ChapterProps) {
    this.id = props.id;
    this.subjectId = props.subjectId;
    this.chapterCode = props.chapterCode;
    this.chapterName = props.chapterName;
    this.classId = props.classId;
    this.isActive = props.isActive;
  }
}
