import axiosInstance from 'app/axiosInterceptor'

interface UploadConfig {
    file: File | Blob;
    documentDto: any;
    setProgress?: (progress: number) => void;
    onSuccess?: () => void;
    onError?: (err: any) => void;
    withVersioning?: boolean;
}

const BATCH_UPLOAD_SIZE = 5;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const chunkFile = (fileToChunk: File | Blob): Blob[] => {
    const chunks: Blob[] = [];
    let currentByte = 0;
    while (currentByte < fileToChunk.size) {
        chunks.push(fileToChunk.slice(currentByte, currentByte + CHUNK_SIZE));
        currentByte += CHUNK_SIZE;
    }
    return chunks;
};

const uploadChunk = async (fileChunk: Blob, index: number, totalChunks: number, dto: any, withVersioning: boolean): Promise<number> => {
    const form = new FormData();
    form.append('fileChunk', fileChunk);
    form.append('chunkIndex', index.toString());
    form.append('totalChunks', totalChunks.toString());
    form.append('documentDto', JSON.stringify(dto));

    let operation = withVersioning? 'update' : 'create';
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/${operation}/upload-chunk`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const uploadFileInChunks = async ({
    file,
    documentDto,
    setProgress = () => {},
    onSuccess = () => {},
    onError = (err : any) => {},
    withVersioning = false,
}: UploadConfig) => 
{
        const chunks = chunkFile(file);
        const totalChunks = chunks.length;
 
        let nextBatchIndex = -1;
        const chunksInBatches = chunks.reduce((acc, chunk, index) => {
            if(index % BATCH_UPLOAD_SIZE === 0) nextBatchIndex++;
            if (!acc[nextBatchIndex]) {
                acc[nextBatchIndex] = [];
            }
            acc[nextBatchIndex].push({chunk,index});
            return acc;
        }, [] as {chunk: Blob,index:number}[][]);
        
        let completedChunks = 0;
        let nextBatchUploadIndex = 0;
        const uploadBatches = () => {
            Promise.all(
                chunksInBatches[nextBatchUploadIndex].map((chunk) =>
                    uploadChunk(chunk.chunk, chunk.index, totalChunks, documentDto, withVersioning)
                        .then(() => {
                            completedChunks++;
                            setProgress((completedChunks / totalChunks) * 100);
                        })
                )
            ).then(() => {
                if (completedChunks === totalChunks) onSuccess();
                else {
                    nextBatchUploadIndex++;
                    if (nextBatchUploadIndex < chunksInBatches.length) {
                        uploadBatches();
                    }
                }
            }).catch((err) => {
                setProgress(0);
                onError(err);
                return false;
            });
        }

        uploadBatches();

};


