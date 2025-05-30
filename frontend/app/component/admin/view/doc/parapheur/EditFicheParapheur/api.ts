import axiosInstance from "app/axiosInterceptor";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const fetchCertificateData = async (parapheurId: number): Promise<ParapheurCertificateDataDTO[]> => {
    const { data } = await axiosInstance.get<ParapheurCertificateDataDTO[]>(`${API_URL}/fiche-parapheurs/${parapheurId}/certificat-data`);
    return data;
};

export const fetchSignersData = async (parapheurId: number): Promise<ParapheurSignersDataDTO[]> => {
    const { data } = await axiosInstance.get<ParapheurSignersDataDTO[]>(`${API_URL}/fiche-parapheurs/${parapheurId}/signers-data`);
    return data;
};

export const addCertificateData = async ({ parapheurId, certificateData }: { parapheurId: number, certificateData: Partial<ParapheurCertificateDataDTO> }): Promise<ParapheurCertificateDataDTO> => {
    const { data } = await axiosInstance.post<ParapheurCertificateDataDTO>(`${API_URL}/fiche-parapheurs/${parapheurId}/certificat-data`, certificateData);
    return data;
};

export const addSignersData = async ({ parapheurId, signersData }: { parapheurId: number, signersData: Partial<ParapheurSignersDataDTO> }): Promise<ParapheurSignersDataDTO> => {
    const { data } = await axiosInstance.post<ParapheurSignersDataDTO>(`${API_URL}/fiche-parapheurs/${parapheurId}/signers-data`, signersData);
    return data;
};

export const updateCertificateData = async ({ parapheurId, certificateData }: { parapheurId: number, certificateData: ParapheurCertificateDataDTO }): Promise<ParapheurCertificateDataDTO> => {
    const { data } = await axiosInstance.put<ParapheurCertificateDataDTO>(`${API_URL}/fiche-parapheurs/${parapheurId}/certificat-data/${certificateData.id}`, certificateData);
    return data;
};

export const updateSignersData = async ({ parapheurId, signersData }: { parapheurId: number, signersData: ParapheurSignersDataDTO }): Promise<ParapheurSignersDataDTO> => {
    const { data } = await axiosInstance.put<ParapheurSignersDataDTO>(`${API_URL}/fiche-parapheurs/${parapheurId}/signers-data/${signersData.id}`, signersData);
    return data;
};

export const deleteCertificateData = async ({ parapheurId, certificateDataId }: { parapheurId: number, certificateDataId: number }): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/fiche-parapheurs/${parapheurId}/certificat-data/${certificateDataId}`);
};

export const deleteSignersData = async ({ parapheurId, signersDataId }: { parapheurId: number, signersDataId: number }): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/fiche-parapheurs/${parapheurId}/signers-data/${signersDataId}`);
};

export const regenerateFicheParapheur = async (parapheurId: number, forceRegen: boolean): Promise<void> => {
    await axiosInstance.post(`${API_URL}/fiche-parapheurs/${parapheurId}/regen-fiche-parapheur`, null, {
        params: { forceRegen }
    });
};