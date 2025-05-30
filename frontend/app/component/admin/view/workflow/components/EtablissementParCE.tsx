import { DocumentDto } from 'app/controller/model/Document.model'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { useEtablissementsBOContext } from '../../bureau-ordre/Providers/EtablissementProvider'
import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre'
import { DocumentIndexElementDto } from 'app/controller/model/DocumentIndexElement.model'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import FileChip from '../../bureau-ordre/BO_courriels/Intervention/FileChip'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { useCourrielCreationContext } from '../../bureau-ordre/Providers/CourrielsCreationProvider'
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO'
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore'
import { VoieEnvoi } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'
import { useRegistresContext } from '../../bureau-ordre/Providers/RegistreProvider'
import axiosInstance from 'app/axiosInterceptor'
import { PlanClassementBO } from 'app/controller/model/BureauOrdre/PlanClassementBo'
import { StepDTO } from 'app/controller/model/workflow/stepDTO'
import { stepService } from 'app/controller/service/workflow/stepService'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const indexeNomEtablissement = process.env.NEXT_PUBLIC_INDEXE_NOM_ETABLISSEMENT || "nom"
const registre_des_certificats = process.env.NEXT_PUBLIC_REGISTRE_CE 
const planClassement_certificats = process.env.NEXT_PUBLIC_PLANCLASSEMENT_BO_CE

type Props = {
    visible: boolean
    setVisible: (visible: boolean) => void
    workflow: WorkflowDTO
    markStepAsDone: () => void
    step : StepDTO
}

type certifsParEtablissment = {
    etablissement: EtablissementBureauOrdre,
    certifs: DocumentDto[]
}

const EtablissementParCE = ({ step, visible, setVisible, workflow, markStepAsDone }: Props) => {

    const { EtablissementsBO: etablissementsBO } = useEtablissementsBOContext();

    const [certifsParEtablissmentState, setCertifsParEtablissmentState] = useState<certifsParEtablissment[]>([]);
    const [nonAssociatedCertifsState, setNonAssociatedCertifsState] = useState<DocumentDto[]>([] as DocumentDto[]);

    const [previousStepDone, setPreviousStepDone] = useState<boolean>(false);
    useEffect(() => {
        if (workflow.stepDTOList) {
            const index = workflow.stepDTOList.findIndex((stepDTO) => stepDTO.id === step.id);
            if (index > 0) {
                setPreviousStepDone(workflow.stepDTOList[index - 1].status === 'DONE');
            }
        }
    }, [workflow]);

    let certifsParEtablissment = [] as certifsParEtablissment[];
    let nonAssociatedCertifs = [] as DocumentDto[];

    const guessEtablissementFromIndex = (index: DocumentIndexElementDto) => {
        const foundEtablissement = etablissementsBO.find(etablissement =>
            index.value.toLowerCase().includes(etablissement.nom.toLowerCase())
        );
        return foundEtablissement || null;
    };

    const guessEtablissementFromIndexList = (indexes: DocumentIndexElementDto[]) => {
        if (!indexes || indexes.length === 0) return null;

        let etablissement = null;
        for (const index of indexes) {
            etablissement = guessEtablissementFromIndex(index);
            if (etablissement) {
                return etablissement;  // This will break the loop and return the result
            }
        }
        return etablissement;  // Return null if no match is found
    };

    const addCertifToEtablissement = (certif: DocumentDto, etablissement: EtablissementBureauOrdre | null) => {
        if (etablissement !== null) {
            const index = certifsParEtablissment.findIndex(certifParEtablissement => certifParEtablissement.etablissement.id === etablissement.id);
            if (index !== -1) {
                certifsParEtablissment[index].certifs.push(certif);
            } else {
                certifsParEtablissment.push({ etablissement: etablissement, certifs: [certif] });
            }
        } else {
            nonAssociatedCertifs.push(certif);
        }
    }

    const handleNonAssociatedCertifs = (nonAssociatedCertifs: DocumentDto[]) => {
        const fakeEtablissement = new EtablissementBureauOrdre();
        fakeEtablissement.id = -1;
        fakeEtablissement.nom = "- Non associé -";
        certifsParEtablissment.push({ etablissement: fakeEtablissement, certifs: nonAssociatedCertifs });
    }

    const groupCertifsByEtablissement = () => {
        certifsParEtablissment = [];
        nonAssociatedCertifs = [];
        step.documents?.forEach(certif => {
            const indexesContainingName = certif?.documentIndexElements?.filter(element => element?.indexElement?.libelle?.replaceAll(" ", "").toLowerCase().includes(indexeNomEtablissement));
            const etablissemant = guessEtablissementFromIndexList(indexesContainingName);
            addCertifToEtablissement(certif, etablissemant);
        });

        handleNonAssociatedCertifs(nonAssociatedCertifs);
        setCertifsParEtablissmentState([...certifsParEtablissment]);
        setNonAssociatedCertifsState(nonAssociatedCertifs);
    }

    useEffect(() => {
        if (step.documents && step.documents.length > 0 && etablissementsBO && etablissementsBO.length > 0) {
            groupCertifsByEtablissement();
        }
    }, [step]);


    const { connectedUser } = useConnectedUserStore();
    const {registres} = useRegistresContext();
    const {
        setShowCreateCourriel,
        showCreateCourriel,
        setLaunchAfterCreateSuccess,
        setSelectedDocument,
        selectedDocuments,
        setEntiteExterne,
        entiteExterne,
        setEntiteInterne,
        setVoieEnvoi,
        setNumeroRegistre,
        setPlanClassementCourriel,
    } = useCourrielCreationContext();

    const autoFillPlanClassementCourriers = async () => {
        return await axiosInstance.get(`${API_URL}/plan-classement-bo`).then((res) => {
            const plans = res.data;
            if (plans.length > 0) {
                setPlanClassementCourriel(plans.find((plan: PlanClassementBO) => plan.libelle?.toLowerCase() === planClassement_certificats));
            }
        }).catch((err) => {
            console.log('err:', err);
        });
    };

    const handleEnvoiCourrier = (CEParEtablissment: certifsParEtablissment) => {
        localStorage.setItem('workflow', JSON.stringify(workflow));
        setSelectedDocument(CEParEtablissment.certifs);
        setVoieEnvoi(VoieEnvoi.EMAIL);
        autoFillPlanClassementCourriers();
        if (CEParEtablissment.etablissement.id !== -1) setEntiteExterne(CEParEtablissment.etablissement);
        setEntiteInterne(connectedUser?.entiteAdministrative || null);
        setNumeroRegistre(registres.find(registre => registre.libelle.toLowerCase() === registre_des_certificats)?.numero || "");
        setShowCreateCourriel(true);        
    }

    const handleEnvoiCourrierAction = (docs: any) => {
        stepService.envoiCourrierAction(step.id, docs).then((res) => {
            step.documents = step.documents?.filter((doc) => !docs.includes(doc));
            groupCertifsByEtablissement();            
        }).catch((err) => {
            console.log('err:', err);
        });
    }

    //remove documents from step after creation of courrier
    useEffect(() => {
        if(visible){
            setLaunchAfterCreateSuccess(() => () =>handleEnvoiCourrierAction(selectedDocuments));
        }
    }, [selectedDocuments, visible]);

    return (
        <>
            <ConfirmPopup />
            <Dialog
                header={<h3>Liste des certificats par établissemant</h3>}
                visible={visible}
                style={{ width: '70vw', minHeight: '50vh' }}
                modal={true}
                dismissableMask={true}
                onHide={() => { setVisible(false) }}
                footer={
                    <div className='flex justify-content-end'>
                        {previousStepDone &&
                            <Button icon="pi pi-check" label={t("Marquer la tache comme faite")}
                                onClick={(e) => confirmPopup({
                                    target: e.currentTarget,
                                    message: 'Voulez-vous vraiment marquer cette tache comme faite?',
                                    icon: 'pi pi-exclamation-triangle',
                                    accept: markStepAsDone,
                                    acceptClassName: 'p-button-success',
                                    rejectClassName: 'p-button-secondary'
                                })}
                            />
                        }
                    </div>
                }
            >
                <div className="flex flex-column">
                    <div>
                        <DataTable
                            value={certifsParEtablissmentState}
                            dataKey='etablissement.id'
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                        >
                            <Column field="etablissement.nom" header="Etablissement" />
                            <Column header="Certificats" body={(rowData: certifsParEtablissment) => {
                                return <div className='flex flex-wrap'>
                                    {
                                        rowData.certifs.map((certif: DocumentDto) => <FileChip key={certif?.id} document={certif} />)
                                    }
                                </div>
                            }} />
                            <Column header={t("stepActions.envoyerCourrier")} body={(rowData: certifsParEtablissment) => {
                                return <Button icon="pi pi-envelope" raised rounded onClick={() => handleEnvoiCourrier(rowData)} />
                            }} />
                        </DataTable>
                    </div>
                </div>
            </Dialog >
        </>
    )
}

export default EtablissementParCE