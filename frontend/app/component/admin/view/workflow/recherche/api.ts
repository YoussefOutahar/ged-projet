import axiosInstance from "app/axiosInterceptor";

import { DocumentDto } from 'app/controller/model/Document.model';
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { WorkflowDTO } from "app/controller/model/workflow/workflowDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface SearchParams {
  keyword: string;
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface GroupedDocuments {
  [key: string]: PaginatedResponse<DocumentDto>;
}

export const searchDocuments = async (params: SearchParams): Promise<GroupedDocuments> => {
  try {
    const response = await axiosInstance.get<GroupedDocuments>(`${API_URL}/workflow-parapheur-kpi/search`, {
      params: {
        keyword: params.keyword,
        page: params.page,
        size: params.size,
        sort: 'createdOn,desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

export const getWorkflowForDocument = async (documentId: number): Promise<WorkflowDTO[]> => {
  try {
    const response = await axiosInstance.get<WorkflowDTO[]>(`${API_URL}/workflow-parapheur-kpi/${documentId}/workflow`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Workflow:', error);
    throw error;
  }
};

export const getParapheursForDocument = async (documentId: number): Promise<ParapheurDto[]> => {
  try {
    const response = await axiosInstance.get<ParapheurDto[]>(`${API_URL}/workflow-parapheur-kpi/${documentId}/parapheurs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parapheurs:', error);
    throw error;
  }
};
