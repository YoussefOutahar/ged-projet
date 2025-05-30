import axiosInstance from 'app/axiosInterceptor';
import { RegistreDto } from 'app/controller/model/BureauOrdre/Registre'
import { MessageService } from 'app/zynerator/service/MessageService';
import { t } from 'i18next';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import React from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
    registres: RegistreDto[];
    toast: React.Ref<Toast>;
    refetchRegistres: () => void;
}

function Registre({registres, toast,refetchRegistres}: Props) {

    const deleteRegistre = async (registre: RegistreDto) => {
        axiosInstance.delete(`${API_URL}/courriel/registre/${registre.id}`).then((res) => {
            MessageService.showSuccess(toast, t('success.success'),t("success.operation"));
            refetchRegistres();
        }).catch((err) => {
            MessageService.showError(toast, t('error.error'),t("error.operation"));
        });
    }

    const confirmDeletePopup = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,registre:RegistreDto) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure you want to delete the selected courrier?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteRegistre(registre),
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-secondary'
        });
    }

  return (
        <>
        <div className='flex gap-5 ' style={{overflowWrap:'break-word'}}>
            {registres?.map((registre, index) => (
            <div className="flex flex-column justify-items-center m-2 " key={registre.id}>
                <div className="flex flex-column justify-items-center hover:shadow-6  " style={{width: '10rem', backgroundColor: '#994e32', borderRadius: '10px 0 0 8px', borderLeft: '#994e32 solid 4px',borderBottom: '#994e32 solid 4px'}}>
                <div className='relative'>
                    <Button icon="pi pi-trash" className="text-white" text rounded style={{position: 'absolute', right: '0rem', top: '0rem'}} onClick={(e)=>confirmDeletePopup(e,registre)}/>
                    <div className=" flex flex-column  pl-1" style={{backgroundColor: '#bb7451', width: '10.1rem', height: '10rem', borderTopLeftRadius: '10px', border: '#994e32 solid 4px'}}>
                        <span className='hover:text-100' style={{fontWeight: 'bolder',letterSpacing:"1px", color: '#e0d1b2', fontSize: '16px',alignContent:'center',textAlign:'center',flex:'3'}}>{registre.libelle}</span>
                        <span className='hover:text-100' style={{fontWeight: 'normal', color: '#e0d1b2', fontSize: '16px',flex:'1'}}>taille : {registre.size}</span>
                        {/* <span style={{fontWeight: 'normal', color: '#333', fontSize: '14px',flex:'1'}}>{registre.numero}</span> */}
                    </div>

                    <div className="flex flex-column justify-content-between overflow-hidden " style={{backgroundColor: '#e0d1b2', borderBottom: '#bb7451 solid 3px', borderLeft: '#bb7451 solid 4px', width: '9.5rem', height: '2rem', borderRadius: '8px 0 8px 8px'}}>
                        {
                            new Array(10).fill('').map((_,index) =><div key={index}  style={{ borderBottom: 'grey solid 1px'}}> </div>)
                        }
                    </div>
                </div>
                </div>
                <div className="text-center mt-3" style={{fontSize: '.9em', color: '#283149',width:'10rem'}}>{registre.numero}</div>
            </div>
            )
            )}
        </div>
        <ConfirmPopup />
        </>

  )
}

export default Registre