import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

export class ArchiveDto extends BaseDto {

    public reference: string;
    public referenceGed: string;
    public uploadDate: Date;
    public createdOn: Date;
    public snapshot: string;
    public ligne : number;
    public colonne : number;
    public numBoite : number;



    constructor() {
        super();
        this.reference = '';
        this.referenceGed = '';
        this.uploadDate = new Date();
        this.createdOn = new Date();
        this.snapshot = '';
        this.ligne = 0;
        this.colonne = 0;
        this.numBoite = 0;
      
    }

}
