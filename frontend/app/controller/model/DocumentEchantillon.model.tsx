import { BaseDto } from "app/zynerator/dto/BaseDto.model";
import { DocumentDto } from "./Document.model";

export class EchantillonDto extends BaseDto {
    public nomEchantillon: string;
    public echantillonState: string;
    public note: string;
    public documentsId: Array<number>;
    public documents: Array<DocumentDto>;
    
    constructor() {
        super();
        this. nomEchantillon='';
        this.echantillonState='';
        this.note='';
        this.documentsId = new Array<number>();
        this.documents = new Array<DocumentDto>();
    }
    
}