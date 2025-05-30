import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { WorkflowPresetDTO } from 'app/controller/model/workflow/workflowPresetDTO';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { OverlayPanel } from 'primereact/overlaypanel';

type Props = {
    workflowPreset: WorkflowPresetDTO;
};

type Level = {
    label: number;
    expanded?: boolean;
    type?: string;
    data: StepPresetDTO[];
    children: Level[];
};

const StepPresetsHierarchy = ({ workflowPreset }: Props) => {
    const [visible, setVisible] = useState(false);
    const [tree, setTree] = useState<any[]>([]);

    const [descriptionDialogVisible, setDescriptionDialogVisible] = useState(false);
    const [currentDescription, setCurrentDescription] = useState("");

    const truncateDescription = (description: string, length = 100) => {
        if (description.length > length) {
            return `${description.substring(0, length)}`;
        }
        return description;
    };




    const defineLevels = (stepPresets: StepPresetDTO[]): Level[] => {
        let levels: Level[] = [];

        stepPresets.forEach((stepPreset) => {

            if (typeof stepPreset.level !== 'number') {
                console.error('StepPreset level is undefined or not a number', stepPreset);
                return;
            }

            const foundLevel = levels.find(level => level.label === stepPreset.level);
            if (foundLevel) {
                foundLevel.data.push(stepPreset);
            } else {
                levels.push({
                    expanded: true,
                    label: stepPreset.level, // stepPreset.level is confirmed to be a number here
                    data: [stepPreset],
                    children: [],
                });
            }
        });

        // Optionally, sort levels by label if needed
        levels.sort((a, b) => a.label - b.label);

        return levels;
    };

    const constructTree = (levels: Level[]): Level[] => {
        if (levels.length === 0) return [];
        const rootLevels = [levels[0]]; // Assuming the first level is always the root
        levels.slice(1).forEach(currentLevel => {
            let parentFound = false;
            for (let i = 0; i < rootLevels.length; i++) {
                const parentLevel = findParentLevel(rootLevels[i], currentLevel);
                if (parentLevel) {
                    parentLevel.children.push(currentLevel);
                    parentFound = true;
                    break;
                }
            }
            if (!parentFound) {
                // In case there's no logical parent, it gets added at the root level.
                // This shouldn't happen in a well-structured hierarchy but is here as a fallback.
                rootLevels.push(currentLevel);
            }
        });

        function findParentLevel(root: Level, currentLevel: Level): Level | null {
            if (root.label === currentLevel.label - 1) return root;
            for (const child of root.children) {
                const potentialParent = findParentLevel(child, currentLevel);
                if (potentialParent) return potentialParent;
            }
            return null;
        }

        return rootLevels;
    };
    const op = useRef<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const toggleOverlayPanel = (e: any) => {
        setIsVisible(prev => !prev);
        if (!isVisible) {
            op.current?.toggle(e);
        }
    };

    useEffect(() => {
        if (workflowPreset && workflowPreset.stepPresets) {
            const levels = defineLevels(workflowPreset.stepPresets);
            const tree = constructTree(levels.sort((a, b) => a.label - b.label)); // Ensure levels are sorted by label
            setTree(tree);
        }
    }, [workflowPreset]);

    const nodeTemplate = (node: any) => {
        return (
            <div>
                <div className="node-content flex flex-wrap gap-4 justify-content-center">
                    {node.data.map((stepPreset: StepPresetDTO, index: number) => (
                        <Card key={index} title={stepPreset.title} className="node-child w-23rem flex flex-column gap-1">
                            <div className='flex mb-3'>
                                <span className='flex text-500'>Description:</span>
                                <span className=' flex'>
                                    {truncateDescription(stepPreset.description ?? '', 20)}
                                    {stepPreset.description && stepPreset.description.length > 100 && (
                                        <Button label="..." className=" ml-2 p-0 p-button-text p-button-rounded" onClick={() => {
                                            setCurrentDescription(stepPreset.description ?? '');
                                            setDescriptionDialogVisible(true);
                                        }} />
                                    )}
                                </span>
                            </div>
                            <div className='grid'>
                                <span className='col-3 text-500'>Actions:</span>
                                <div className='col'>
                                    {stepPreset.actions?.map((action, actionIndex) => (
                                        <Tag key={actionIndex} value={action} className='mx-2'></Tag>
                                    ))}
                                </div>
                            </div>
                            <div className='col'>
                                {stepPreset.destinataires && stepPreset.destinataires.length > 0 && (
                                    <>
                                        <Chip className='text-xs' label={`${stepPreset.destinataires[0].utilisateur.nom} ${stepPreset.destinataires[0].utilisateur.prenom}`} icon="pi pi-user" />
                                        {stepPreset.destinataires.length > 1 && (


                                            <Button icon="pi pi-users" className="  h-2rem w-2rem  p-button-rounded p-button-outlined p-button-secondary ml-2" onClick={toggleOverlayPanel} />


                                        )}
                                    </>
                                )}
                            </div>

                            <OverlayPanel ref={op} dismissable>
                                {stepPreset.destinataires?.slice(1).map((destinataire, index) => (
                                    <Chip key={index} className='text-xs mt-2' label={`${destinataire.utilisateur.nom} ${destinataire.utilisateur.prenom}`} icon="pi pi-user" />
                                ))}
                            </OverlayPanel>
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Button className='ml-auto py-2 px-1 rounded m-auto' icon="pi pi-sitemap" onClick={() => setVisible(true)} />
            <Dialog header={workflowPreset.title} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <OrganizationChart value={tree} nodeTemplate={nodeTemplate} />
                <Dialog header="Description Complète" visible={descriptionDialogVisible} style={{ width: '50vw' }} onHide={() => setDescriptionDialogVisible(false)} modal>
                    <p>{currentDescription}</p>
                </Dialog>
            </Dialog>
        </>
    );
};

export default StepPresetsHierarchy;
