import axiosInstance from 'app/axiosInterceptor'
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const Actions = () => {

    const toast = useRef<Toast>(null);

    const [actions, setActions] = useState<string[]>([]);
    const [loadingActions, setLoadingActions] = useState<boolean>(true);
    const [errorActions, setErrorActions] = useState<boolean>(false);

    const [ShowNewActionDiaglog, setShowNewActionDiaglog] = useState<boolean>(false);
    const [newAction, setNewAction] = useState<string>('');
    useEffect(() => {
        fetchActions();
    }, []);

    const fetchActions = async () => {
        setLoadingActions(true);
        let actionsHolder: string[] = [];
        return await axiosInstance.get(`${API_URL}/courriel/intervenants-courriel/actions`).then((res) => {
            res.data.forEach((action: any) => {
                actionsHolder.push(action.libelle);
            });
            setActions(actionsHolder);
            setLoadingActions(false);
        }).catch((err) => {
            setErrorActions(true);
            console.log('err:', err);
        }).finally(() => {
            setLoadingActions(false);

        });
    };

    const valideAction: boolean = newAction.trim().length > 0 && !actions.includes(newAction);
    const addAction = async () => {
        return await axiosInstance.post(`${API_URL}/courriel/intervenants-courriel/actions`,
            newAction,
            { headers: { 'Content-Type': 'text/plain' } }
        ).then((res) => {
            fetchActions();
            setNewAction('');
            setShowNewActionDiaglog(false);
            MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
        }).catch((err) => {
            console.log('err:', err);
            MessageService.showError(toast, t('error.error'), t("error.operation"));
        });
    }
    const deleteAction = async (action: string) => {
        return await axiosInstance.delete(`${API_URL}/courriel/intervenants-courriel/actions`, {
            data: action
        }).then((res) => {
            MessageService.showSuccess(toast, t('success.success'), t("success.operation"));
            fetchActions();
        }).catch((err) => {
            console.log('err:', err);
            MessageService.showError(toast, t('error.error'), t("error.operation"));
        });
    }

    const confirmDelete = (event: any, action: string) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteAction(action)
        });
    }

    return (
        <>
            <h1>Actions</h1>
            <Toolbar className="mb-4"
                style={{ opacity: loadingActions || errorActions ? 0.5 : 1, pointerEvents: loadingActions || errorActions ? 'none' : 'auto' }}
                start={() => {
                    return (
                        <React.Fragment>
                            <Button className='mr-2' label="Nouvelle Action" icon="pi pi-plus"
                                onClick={() => setShowNewActionDiaglog(true)}
                            />
                        </React.Fragment>
                    )
                }}
            >
            </Toolbar>

            {loadingActions && <div className="flex justify-content-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>}
            {errorActions && <div className="flex justify-content-center">
                <i className="pi pi-exclamation-circle" style={{ fontSize: '2em', color: 'red', display: 'block', textAlign: 'center' }}></i>
            </div>}

            <div className='flex flex-wrap gap-4 mt-10'>
                {!loadingActions && !errorActions && (
                    actions?.map((action, index) => {
                        return (
                            <div key={index} className='card w-fit relative h-6rem'>
                                <Button className='absolute top-0 right-0' icon='pi pi-trash' severity='danger' text rounded
                                    onClick={(e) => confirmDelete(e, action)}
                                />
                                <span className='text-2xl font-bold'>{action}</span>
                            </div>
                        )
                    })
                )}

            </div>
            <Dialog
                visible={ShowNewActionDiaglog}
                onHide={() => { setShowNewActionDiaglog(false) }}
                header="Nouvelle Action"
                modal
                style={{ width: '50vw' }}
                footer={<div>
                    <Button label="Annuler" className="p-button-text" onClick={() => { setNewAction(''); setShowNewActionDiaglog(false) }} />
                    <Button disabled={!valideAction} label="Enregistrer" className="p-button-primary" onClick={() => addAction()} />
                </div>}
            >
                <div>
                    <input type="text" value={newAction} onChange={(e) => setNewAction(e.target.value)} className="p-inputtext p-component w-full" placeholder="Entrez le nom de l'action" />
                    {!valideAction && <small className="ml-2 text-red-500">Action invalide</small>}
                </div>
            </Dialog>
            <ConfirmPopup />
            <Toast ref={toast} />
        </>
    )
}

export default Actions