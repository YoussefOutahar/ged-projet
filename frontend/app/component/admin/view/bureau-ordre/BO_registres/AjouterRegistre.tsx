import axiosInstance from 'app/axiosInterceptor'
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre'
import { MessageService } from 'app/zynerator/service/MessageService'
import { set } from 'date-fns'
import { t } from 'i18next'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import React, { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    refetchRegistres: () => void;
    toast : React.Ref<Toast>;
}

const AjouterRegistre = ({refetchRegistres, toast}: Props) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [libelle, setLibelle] = useState<string>('');
    const [numeroRegistre, setNumeroRegistre] = useState<string>('');

  
    useEffect(() => {
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        setNumeroRegistre(`${libelle}-${month}/${year}`);
    }, [libelle]);

    const addRegistre = async () => {
        let registre = new RegistreDto();
        registre.libelle = libelle;
        registre.numero = numeroRegistre;
        return await axiosInstance.post(`${API_URL}/courriel/registre`,registre)
            .then((res) => {
                refetchRegistres();
                closeDialog();
                MessageService.showSuccess(toast,t('success.success'),t("success.operation"));
            }).catch((err) => {
                console.log('err:', err);
                MessageService.showError(toast,t('error.error'),t("error.operation"));
            });
        }

        
        const closeDialog = () => {
            setVisible(false);

            // empty fields
            setLibelle('');
        }

  return (
    <>
    <Button label={t('bo.registre.ajouterRegistre')} icon="pi pi-plus"  onClick={()=>setVisible(true)} />
    <Dialog 
        header={t('bo.registre.ajouterRegistre')}
        visible={visible} 
        style={{ width: '50vw' }} 
        modal={true} 
        onHide={() => closeDialog()}
        footer={<div className='flex flex-row gap-3 justify-content-end'>
            <Button label={t('cancel')} className="p-button-text" onClick={() => closeDialog()} />
            <Button label={t('add')}  onClick={() => addRegistre()} disabled={libelle===''}/>
        </div>}
        >
        <div className='flex flex-row gap-3'>
            <div className='flex flex-column gap-1'>
                <label htmlFor='libelle'>{t('bo.registre.libelle')}</label>
                <InputText value={libelle} type="text" id="libelle"  onChange={(e)=>setLibelle(e.target.value)}/>
                {libelle==='' && <small className='text-red-500'>*{t('requiredField')}</small>}
            </div>
            <div className='flex flex-column gap-1'>
                <label htmlFor="numeroRegistre">{t('bo.registre.numero')}</label>
                <InputText value={numeroRegistre} type="text" id="numeroRegistre" disabled/>
            </div>
        </div>
        

      
    </Dialog>

    </>
    )
}

export default AjouterRegistre