import  { AxiosResponse } from "axios";
import axiosConf from 'app/axiosInterceptor';
import axios from 'axios';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL as string;

const ADMIN_MINIO_BACKEND_URL = process.env.NEXT_PUBLIC_MINIO_BACKEND_URL as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';
import { ArchiveDto } from "app/controller/model/DocumentArchive.model";
import { ArchiveCriteria } from "app/controller/criteria/ArchiveCriteria.model";

export class ArchiveAdminService extends AbstractService<ArchiveDto, ArchiveCriteria>{

    constructor() {
        super(ADMIN_URL, 'document/');
    }
    getArchiveBase64(documentId: number): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}document/viewarchive/${documentId}`);
    }
};
