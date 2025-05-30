import  { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from 'app/axiosInterceptor';

import { PaginatedList } from "../dto/PaginatedList.model";
import { BaseDto } from "../dto/BaseDto.model";
import { BaseCriteria } from "../criteria/BaseCriteria.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import {AuthService} from "../security/Auth.service";
import { ArchiveDto } from "app/controller/model/DocumentArchive.model";
import { queryClient } from "pages/_app";
const CHANGE_PASSWORD_URL = process.env.NEXT_PUBLIC_CHANGE_PASSWORD_URL as string;

class AbstractService<T extends BaseDto, C extends BaseCriteria> {
    protected _url: string
    private authService : AuthService

    constructor(private baseUrl: string, private beanName: string ) {
        this._url = baseUrl + beanName;
        this.authService = new AuthService();
    }

    getList(): Promise<AxiosResponse<T[]>> {
        return axios.get(this._url);
    }

    save(item: T): Promise<AxiosResponse<T>> {
        queryClient.invalidateQueries();
        return axios.post(this._url, item);
    }


    saveFormData(item: FormData): Promise<AxiosResponse<T>> {
        return axios.post(`${this._url}with-file`, item);
    }
    saveFormDataSummary(item: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.post(`${this._url}v2/with-file`, item, config);
    }
    saveFormsData(item: FormData): Promise<AxiosResponse<T>> {
        return axios.post(`${this._url}with-files`, item);
    }

    update(item: T): Promise<AxiosResponse<T>> {
        queryClient.invalidateQueries();
        return axios.put(this._url, item);
    }

    delete(id: number): Promise<AxiosResponse<T>> {
        queryClient.invalidateQueries();
        return axios.delete(this._url + 'id/' + id);
    }

    deleteList(items: T[]): Promise<AxiosResponse<string>> {
        return axios.post(this._url + 'multiple', items);
    }
    archiveList(items: T[]): Promise<AxiosResponse<ArchiveDto[]>> {
        return axios.post(this._url + 'move-to-archive', items);
    }

    desarchiveList(items: T[]): Promise<AxiosResponse<any>> {
        return axios.post(this._url + 'desarchive', items);
    }

    archivePhysiqueData(archivePhysiqueInfo: ArchiveDto[],line:number,colonne : number, boite: number): Promise<AxiosResponse<ArchiveDto>> {
        return axios.post(this._url + `archive-physique/${line}/${colonne}/${boite}`, archivePhysiqueInfo);
    }

    findPaginatedByCriteria(criteria: C): Promise<AxiosResponse<PaginatedList<T>>> {
        const config = {
            headers: { Authorization: `${this.authService.getToken()}` }
        };

        return axios.post<PaginatedList<T>>(this._url + 'find-paginated-by-criteria', criteria, config);
    }

    getListFromElastic(keyword: string, criteria: C): Promise<AxiosResponse<PaginatedList<T>>> {
        return axios.post(`${this._url}find-paginated-by-keyword?keyword=${keyword}`, criteria);
    }

    changePassword(username: string, password: string): Promise<AxiosResponse<any>> {
        let utilisateur = new UtilisateurDto();
        utilisateur.password = password;
        utilisateur.username = username;
        return axios.put(CHANGE_PASSWORD_URL, utilisateur);
    }

}

export default AbstractService;
