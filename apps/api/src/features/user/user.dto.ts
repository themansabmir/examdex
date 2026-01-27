export interface CreateUserInputDTO {
  mobileNumber: string;
  name?: string | null;
  role?: string;
}

export interface CreateUserOutputDTO {
  id: string;
  email: string | null;
  mobileNumber: string | null;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
