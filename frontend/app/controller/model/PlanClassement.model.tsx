import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { NULL } from 'sass';

export class PlanClassementDto extends BaseDto {

    public code: string;
    public description: string;
    public libelle: string;
    public parentId: number | null;
    public archive: boolean;
    public children!: PlanClassementDto;
    archiveIntermidiaireDuree: number | null; // new field
    archiveFinalDuree: number | null;  // new field
    archiveType: PlanClassementType.ArchivageType ; // new field


    constructor() {
        super();
        this.code = '';
        this.description = '';
        this.libelle = '';
        this.parentId = null;
        this.archive = false;
        this.children;
        this.archiveIntermidiaireDuree = null; 
        this.archiveFinalDuree = null; 
        this.archiveType = PlanClassementType.ArchivageType.FINALE;
    }

}
export  namespace PlanClassementType {

    export type ArchivageType  = 'FINALE' | 'DESTRUCTION';
    export const ArchivageType = {
        FINALE: 'FINALE' as ArchivageType,
        DESTRUCTION: 'DESTRUCTION' as ArchivageType
    };
}
