export interface CreateUserInputDTO {
  email: string;
  name?: string;
}

export interface CreateUserOutputDTO {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
