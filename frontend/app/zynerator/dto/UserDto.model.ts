import { BaseDto } from "./BaseDto.model";
import { RoleDto } from "./RoleDto.model";

export class UserDto extends BaseDto {
  roles!: Array<RoleDto>;

  getClassName() {
    return "User";
  }
}
