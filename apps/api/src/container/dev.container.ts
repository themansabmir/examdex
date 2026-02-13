import { DevController } from "../features/dev";
import { userService, userRepository } from "./user.container";

export const devController = new DevController(userService, userRepository);
