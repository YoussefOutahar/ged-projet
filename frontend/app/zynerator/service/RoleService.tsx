import { AxiosResponse } from "axios";
import axios from 'app/axiosInterceptor';
import { RoleDto } from "../dto/RoleDto.model";
const ROLES_URL = process.env.NEXT_PUBLIC_ROLES_URL as string;

class RoleService {

    getList(): Promise<AxiosResponse<RoleDto[]>> {
        return axios.get(ROLES_URL);
    }
}

export default RoleService;
