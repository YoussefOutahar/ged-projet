import { BaseDto } from "./BaseDto.model";

export class RoleDto extends BaseDto {
  authority!: string;
  label!: string;
  updatedAt!: Date;
  createdAt!: Date;
  permissions!: number[];

  getClassName() {
    return "Role";
  }
}
