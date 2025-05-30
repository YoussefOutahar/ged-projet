import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';
import { DocumentStateDto } from 'app/controller/model/DocumentState.model';
import { t } from 'i18next';
import { Toast } from 'primereact/toast';

interface StatusDocDropdownProps {
  rowData: any;
  documentStates: DocumentStateDto[];
  refresh: () => void;
  onStatusChange: (isClotureSuccess: boolean) => void;  // New prop
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';


const StatusDocDropdown: React.FC<StatusDocDropdownProps> = ({ rowData, documentStates, refresh, onStatusChange }) => {
  const [documentStatesD, setDocumentStatesD] = useState<{ label: string, severity: string }[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(rowData.documentState?.libelle);
  const [currentSeverity, setCurrentSeverity] = useState(rowData.documentState?.style);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toastRef = useRef<Toast>(null);
  const showToast = (severity: SeverityType, summary: string) => {
    if (toastRef.current) {
        toastRef.current.show({ severity, summary, life: 4000 });
    }
};

  useEffect(() => {
    const formattedData = documentStates.map(state => ({
      label: state.libelle,
      severity: state.style
    }));
    setDocumentStatesD(formattedData);
  }, [documentStates]);

  const handleStatusChange = async (e: { value: string }) => {
    const selectedState = documentStatesD.find(state => state.label === e.value);
    if (e.value === 'cloture') {
      setShowConfirmDialog(true);
    } else {
      selectedState && updateDocumentStatus(e.value, selectedState.severity);
    }
    refresh();
  };

  const updateDocumentStatus = async (status: string, severity: string) => {
    setIsDropdownVisible(false);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/editDocumentStatus/${rowData.id}/status?status=${status}`);
      if (response.status === 200) {
        setCurrentLabel(status);
        setCurrentSeverity(severity);
        if (status === 'cloture') {
          onStatusChange(true);  
          showToast('success', t(' documents desarchive avec Success'));

        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut du document', error);
      if (status === 'cloture') {
        onStatusChange(false); 
      }
    }
  };

  const renderFooter = () => (
    <div>
      <Button label="No" icon="pi pi-times" onClick={() => setShowConfirmDialog(false)} className="p-button-text" />
      <Button label="Yes" icon="pi pi-check" onClick={() => {
        const clotureState = documentStatesD.find(state => state.label === 'cloture');
        if (clotureState) {
          updateDocumentStatus('cloture', clotureState.severity);
          setShowConfirmDialog(false);
        }
      }} autoFocus />
    </div>
  );

  return (
    <div>
                  <Toast ref={toastRef} />

      {isDropdownVisible ? (
        <Dropdown
          value={currentLabel}
          options={documentStatesD.map(state => ({ label: state.label, value: state.label }))}
          onChange={handleStatusChange}
          autoFocus
        />
      ) : (
        <Tag
          value={currentLabel}
          severity={currentSeverity}
          onClick={() => setIsDropdownVisible(true)}
        />
      )}
      <Dialog
        header="Confirmation"
        visible={showConfirmDialog}
        style={{ width: '350px' }}
        footer={renderFooter()}
        onHide={() => setShowConfirmDialog(false)}
      >
        <p>Êtes-vous sûr de vouloir clôturer ce document ?</p>
      </Dialog>
    </div>
  );
};

export default StatusDocDropdown;
