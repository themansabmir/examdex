export interface CreateClassInputDTO {
  classCode: string;
  className: string;
  displayOrder?: number;
}

export interface UpdateClassInputDTO {
  className?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ClassOutputDTO {
  id: string;
  classCode: string;
  className: string;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
