
export class PlanClassementBO {
    id: number | null;
    code: string | null;
    libelle: string | null;
    description: string | null;
    children: PlanClassementBO[] | null;
    parentId: number | null;

    constructor() {
        this.id = null;
        this.code = null;
        this.libelle = null;
        this.description = null;
        this.children = null;
        this.parentId = null;
    }
}