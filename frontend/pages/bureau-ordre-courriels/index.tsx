import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';

import { CourrielsProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsProvider';
import CourrielToolBarAdmin from 'app/component/admin/view/bureau-ordre/BO_courriels/ToolBars/ToolBarAdmin';
import { RegistreProvider } from 'app/component/admin/view/bureau-ordre/Providers/RegistreProvider';
import { EtablissementProvider } from 'app/component/admin/view/bureau-ordre/Providers/EtablissementProvider';
import { CourrielSelectionProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsSelectionProvider';
import { CourrielCreationProvider } from 'app/component/admin/view/bureau-ordre/Providers/CourrielsCreationProvider';
import { AnnotationProvider } from 'app/component/admin/view/bureau-ordre/Providers/AnnotationProvider';
import CourrielsList from 'app/component/admin/view/bureau-ordre/BO_courriels/CourrielsList';
import CreateCourrielsBureauOrdre from 'app/component/admin/view/bureau-ordre/BO_courriels/creationForm/CreateCourrielsBO';

type SeverityType = 'success' | 'info' | 'warn' | 'error';

const index = () => {
  const { t } = useTranslation();

  const toast = useRef<Toast>(null);
  const showToast = (severity: SeverityType, summary: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, life: 4000 });
    }
  };

  return (
    <CourrielsProvider useAllCourriels={true}>
      <AnnotationProvider>
        <EtablissementProvider>
          <RegistreProvider>
            <CourrielSelectionProvider>
              <CourrielCreationProvider>
                <h1 className="text-2xl font-bold text-blue-800">{t('bo.title')}</h1>
                <Toast ref={toast} />
                <CourrielToolBarAdmin t={t} toastRef={toast} />
                <CourrielsList t={t} showToast={showToast} toastRef={toast} />
                <CreateCourrielsBureauOrdre showToast={showToast} />
              </CourrielCreationProvider>
            </CourrielSelectionProvider>
          </RegistreProvider>
        </EtablissementProvider>
      </AnnotationProvider>
    </CourrielsProvider>
  )
}

export default index