import { Toast } from 'primereact/toast'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { CourrielsProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsProvider'
import { RegistreProvider } from 'app/component/admin/view/bureau-ordre/Providers/RegistreProvider'
import { EtablissementProvider } from 'app/component/admin/view/bureau-ordre/Providers/EtablissementProvider'
import CourrielToolBarUser from 'app/component/admin/view/bureau-ordre/BO_courriels/ToolBars/ToolBarUser'
import { CourrielSelectionProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider'
import { CourrielCreationProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsCreationProvider'
import { AnnotationProvider } from 'app/component/admin/view/bureau-ordre/Providers/AnnotationProvider'
import CreateCourrielsBureauOrdre from 'app/component/admin/view/bureau-ordre/BO_courriels/creationForm/CreateCourrielsBO'
import CourrielsTree from 'app/component/admin/view/bureau-ordre/BO_courriels/CourrielsList'

const mesCourriels = () => {

    const { t } = useTranslation();
    const toast = useRef<Toast>(null);
    const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string) => {
        if (toast.current) {
            toast.current.show({ severity, summary, life: 4000 });
        }
    };


    return (

        <CourrielsProvider useAllCourriels={false}>
            <AnnotationProvider>
                <EtablissementProvider>
                    <RegistreProvider>
                        <CourrielSelectionProvider>
                            <CourrielCreationProvider>
                                <h1 className="text-2xl font-bold text-blue-800">{t('bo.mesCourriels')}</h1>
                                <CourrielToolBarUser t={t} toastRef={toast} />
                                <CreateCourrielsBureauOrdre isResponsable={true} showToast={showToast} />

                                <CourrielsTree isResponsable={true} t={t} showToast={showToast} toastRef={toast} />
                                <Toast ref={toast} />

                            </CourrielCreationProvider>
                        </CourrielSelectionProvider>
                    </RegistreProvider>
                </EtablissementProvider>
            </AnnotationProvider>
        </CourrielsProvider>
    )
}

export default mesCourriels