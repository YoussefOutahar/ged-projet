import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import UsersTable from 'app/component/admin/view/workflow/UsersTable';
import { Divider } from 'primereact/divider';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { t } from 'i18next';
import { ACTION, StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';
import { InputSwitch } from 'primereact/inputswitch';

type Props = {
    stepPreset: StepPresetDTO;
    utilisateurs: UtilisateurDto[];
    onStepPresetChange: (updatedStepPreset: Partial<StepPresetDTO>) => void;
    onRemoveStepPreset: () => void;
    editable: boolean; // Ajouter la prop editable
    setIsFormValid: (isFormValid: boolean) => void;
    editVisible?: boolean;

};

function StepPresetCreateForm({ onRemoveStepPreset, utilisateurs, stepPreset, onStepPresetChange, editable, setIsFormValid, editVisible }: Props) {
    const overlayPanel = useRef(null);
    const overlayPanelDestinataire = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(true);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onStepPresetChange({ [name]: value });
    };

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onStepPresetChange({ [name]: parseInt(value, 10) || undefined });
    };

    const checkFormValidity = () => {
        const isTitleValid = stepPreset.title?.trim() !== '' || false;
        const isLevelValid = stepPreset.level !== undefined || false;
        const isDescriptionValid = stepPreset.description?.trim() !== '' || false;
        const isActionsValid = stepPreset.actions && stepPreset.actions.length > 0 || false;
        const isDestinatairesValid = stepPreset.destinataires && stepPreset.destinataires.length > 0 || false;

        setIsFormValid(isTitleValid && isLevelValid && isDescriptionValid && isActionsValid && isDestinatairesValid);
    };

    useEffect(() => {
        checkFormValidity();
    }, [stepPreset]);

    return (
        <Fieldset
            legend={
                <>
                    {stepPreset.title} <Tag value={`Level: ${stepPreset.level}`} className="ml-2" />
                </>
            }
            style={{ marginBottom: "1rem" }}
            toggleable
            collapsed={isCollapsed}
            onToggle={(e) => setIsCollapsed(e.value)} >
            <div className='flex flex-column gap-2'>
                <div className='flex gap-3'>
                    <div className="flex flex-column ">
                        <label htmlFor="title">{t("workflow.titre")}</label>
                        <InputText id="title" name="title" value={stepPreset.title} onChange={handleInputChange} disabled={!editable} />
                    </div>
                    <div className="flex flex-column " >
                        <label htmlFor="level">{t("workflow.Level")}</label>
                        <InputText
                            id="level"
                            name="level"
                            type="number"
                            min={1}
                            value={stepPreset.level?.toString()}
                            onChange={handleNumberInputChange}
                            disabled={!editable || editVisible}
                        />
                    </div>
                    <div className="flex flex-column">
                        <label htmlFor="duration">{t("workflow.duration")}</label>
                        <InputText
                            id="duration"
                            name="duration"
                            type="number"
                            min={0}
                            value={stepPreset.duration?.toString()}
                            onChange={handleNumberInputChange}
                            disabled={!editable}
                        />
                    </div>
                    <div>
                        <label htmlFor="addPV">Pièces Jointes</label>
                        <InputSwitch checked={stepPreset.addPV ?? false} 
                            onChange={(e) => onStepPresetChange({ addPV: e.value ?? false })} 
                            disabled={!editable} className="mt-3"
                        />
                    </div>
                </div>
                <div className="p-fluid">
                    <label htmlFor="description">{t("workflow.Description")}</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={stepPreset.description}
                        rows={3}
                        maxLength={500}
                        autoResize
                        onChange={handleInputChange}
                        disabled={!editable}
                    />
                </div>
                <div className='flex flex-column '>
                    <label htmlFor="actions" className='my-2'>{t("workflow.Action")}</label>
                    <div className="flex flex-col  gap-2  ">
                        {stepPreset.actions?.length === 0
                            ? <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="No actions"></Tag>
                            : stepPreset.actions?.map((action, index) => (
                                <Tag key={action} style={{ height: "fit-content", marginTop: "auto", marginBottom: "auto" }}>
                                    <div className="flex align-items-center font-sm gap-2">
                                        <span className='  text-sm'>{action}</span>
                                        {editable && (
                                            <i className="pi pi-times-circle " onClick={() => onStepPresetChange({ actions: stepPreset.actions?.filter((_, i) => i !== index) })}></i>
                                        )}
                                    </div>
                                </Tag>
                            ))}
                        {editable && (
                            <Button icon="pi pi-plus" rounded text raised severity="secondary"
                                onClick={(e) => (overlayPanel.current as OverlayPanel | null)?.toggle(e)} disabled={editVisible} />
                        )}
                        {editable && (
                            <OverlayPanel ref={overlayPanel} >
                                <ListBox
                                    name='addAction'
                                    onChange={(e: ListBoxChangeEvent) => onStepPresetChange({ actions: [...(stepPreset.actions || []), e.value] })}
                                    options={[ACTION.SIGN, ACTION.APPROVE, ACTION.PARAPHER, ACTION.PRESIGNER, ACTION.ENVOI_COURRIER].filter((option) => !stepPreset.actions?.includes(option))}
                                    className="w-full md:w-14rem" />
                            </OverlayPanel>
                        )}
                    </div>
                </div>
                <div className='flex flex-column '>
                    <label htmlFor="destinataires">{t("workflow.Destinataire")}</label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {stepPreset.destinataires?.length === 0
                            ? <Tag className="mt-auto mb-auto h-fit mr-2" icon="pi pi-info-circle" severity="warning" value="No destinataires"></Tag>
                            : stepPreset.destinataires?.map((destinataire, index) => (
                                <Tag key={destinataire.utilisateur?.id} style={{ height: "fit-content", marginTop: "auto", marginBottom: "auto" }} >
                                    <div className="flex align-items-center font-sm gap-2">
                                        <div className='flex flex-column pl-1 '>
                                            <span className='text-sm'>{destinataire.utilisateur?.nom} {destinataire.utilisateur?.prenom}</span>
                                            <span className='text-xs'>{destinataire.utilisateur?.email}</span>
                                        </div>
                                        <Divider layout="vertical" className='max-h-0' />
                                        <div className='flex flex-row mr-1 '>
                                            <div className='flex flex-column pr-1 -ml-4'>
                                                <i className="pi pi-angle-up " onClick={() => onStepPresetChange({ destinataires: stepPreset.destinataires?.map((d, i) => i === index ? { ...d, poids: (d.poids ?? 0) + 1 } : d) })} />
                                                <i className="pi pi-angle-down" onClick={() => onStepPresetChange({ destinataires: stepPreset.destinataires?.map((d, i) => i === index ? { ...d, poids: (d.poids ?? 0) <= 1 ? 1 : ((d.poids ?? 0) - 1) } : d) })} />
                                            </div>
                                            <span className='text-sm my-auto'>poids: {destinataire.poids ?? 0}</span>
                                        </div>
                                        <Divider layout="vertical" className='max-h-0' />
                                        {editable ? (
                                            <InputSwitch
                                                checked={destinataire.shouldSign ?? false}
                                                onChange={(e) => onStepPresetChange({ destinataires: stepPreset.destinataires?.map((d, i) => i === index ? { ...d, shouldSign: e.value ?? false } : d) })}
                                                className="border-2 border-white"
                                                style={{
                                                    boxShadow: '0 0 0 2px white',
                                                    borderRadius: '15px'
                                                }}
                                            />
                                        ) : (
                                            <i className={`pi ${destinataire.shouldSign ? 'pi-check-circle' : 'pi-times-circle'}`}
                                                style={{ color: 'white', fontSize: '1.2rem' }} />
                                        )}
                                        <span style={{ color: 'white', fontSize: '0.875rem' }}>signataire</span>
                                        {editable && (
                                            <i className="pi pi-times-circle" onClick={() => onStepPresetChange({ destinataires: stepPreset.destinataires?.filter((_, i) => i !== index) })} />
                                        )}
                                    </div>
                                </Tag>
                            ))}
                        {editable && (
                            <Button icon="pi pi-plus" rounded text raised severity="secondary" onClick={(e) => (overlayPanelDestinataire.current as OverlayPanel | null)?.toggle(e)} />
                        )}
                        {editable && (
                            <OverlayPanel ref={overlayPanelDestinataire} >
                                <UsersTable utilisateurs={utilisateurs.filter((u) => !stepPreset.destinataires?.some(d => d.utilisateur?.id == u.id))}
                                    onStepPresetChange={(newDestinataire) => onStepPresetChange({ destinataires: [...(stepPreset.destinataires || []), newDestinataire] })} />
                            </OverlayPanel>
                        )}
                    </div>
                </div>
                {editable && (
                    <div className='flex flex-row-reverse justify-items-end gap-2'>
                        <Button
                            className="w-fit"
                            label="Remove"
                            severity='danger'
                            icon="pi pi-trash"
                            onClick={
                                (e) => {
                                    confirmPopup({
                                        target: e.currentTarget,
                                        message: "Are you sure you want to remove this step?",
                                        icon: "pi pi-exclamation-triangle",
                                        accept: () => onRemoveStepPreset()
                                    });
                                }}
                            outlined
                        />
                    </div>
                )}
                <ConfirmPopup />
            </div>
        </Fieldset>
    );
}

export default StepPresetCreateForm;
