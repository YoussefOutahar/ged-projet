import { BaseDto } from "app/zynerator/dto/BaseDto.model";

export class DocumentCommentaireDto extends BaseDto{
    public documentId: number;
    public contenu: string;
    public valide: boolean;

    constructor() {
        super();
        this.documentId = 0;
        this.contenu = '';
        this.valide = false;
    }
}

