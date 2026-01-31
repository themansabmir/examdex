export interface CreateUserInputDTO {
  email: string;
  name?: string;
}

export interface UserOutputDTO {
  id: string;
  email: string;
  name: string | null;
}
