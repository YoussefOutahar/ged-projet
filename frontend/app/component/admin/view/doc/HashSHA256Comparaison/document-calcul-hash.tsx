import CryptoJS from 'crypto-js';

export class PdfHashSHA256 {
    async calculerHashSHA256(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(reader.result);
                    const hash = CryptoJS.SHA256(wordArray);
                    resolve(hash.toString(CryptoJS.enc.Hex));
                } else {
                    reject(new Error('Erreur lors de la lecture du blob'));
                }
            };

            reader.onerror = () => {
                reject(reader.error);
            };

            // Lecture du blob en tant qu'array buffer
            reader.readAsArrayBuffer(blob);
        });
    }

    async comparerBlobsPDF(blob1: Blob, blob2: Blob): Promise<boolean> {
        try {
            const hash1 = await this.calculerHashSHA256(blob1);
            const hash2 = await this.calculerHashSHA256(blob2);
            return hash1 === hash2;
        } catch (err) {
            console.error('Erreur lors de la comparaison des blobs PDF :', err);
            return false;
        }
    }
}
