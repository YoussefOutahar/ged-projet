import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useQuery } from '@tanstack/react-query';
import { DocumentDto } from 'app/controller/model/Document.model';
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { WorkflowDTO } from "app/controller/model/workflow/workflowDTO";
import { getParapheursForDocument, getWorkflowForDocument } from './api';
import WorkflowSteps from './WorkflowSteps';
import { Card } from 'primereact/card';
import ParapheurCard from './ParapheurCard';
import { Timeline } from 'primereact/timeline';
import { PlanClassementDto } from 'app/controller/model/PlanClassement.model';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';

interface DocumentDetailsDialogProps {
  visible: boolean;
  onHide: () => void;
  document: DocumentDto | null;
}

const DocumentDetailsDialog: React.FC<DocumentDetailsDialogProps> = ({
  visible,
  onHide,
  document
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: workflows,
    isLoading: isLoadingWorkflow
  } = useQuery<WorkflowDTO[], Error>({
    queryKey: ['workflow', document?.id],
    queryFn: () => getWorkflowForDocument(document!.id),
    enabled: !!document,
  });

  const {
    data: parapheurs,
    isLoading: isLoadingParapheurs
  } = useQuery<ParapheurDto[], Error>({
    queryKey: ['parapheurs', document?.id],
    queryFn: () => getParapheursForDocument(document!.id),
    enabled: !!document,
  });

  const getStatusTag = (status: Boolean, label: string, icon: string) => (
    <Tag 
      value={status ? label : `Not ${label}`} 
      severity={status ? "success" : "danger"}
      icon={`pi ${icon}`}
      className="mr-2 mb-2"
    />
  );

  // const renderPlanClassement = (planClassement: PlanClassementDto) => (
  //   <Timeline
  //     value={[
  //       { label: 'Code', icon: 'pi pi-code', content: planClassement.code },
  //       { label: 'Description', icon: 'pi pi-info-circle', content: planClassement.description },
  //       { label: 'Libelle', icon: 'pi pi-tag', content: planClassement.libelle },
  //       { label: 'Archive Type', icon: 'pi pi-folder', content: planClassement.archiveType },
  //       { label: 'Intermediate Archive Duration', icon: 'pi pi-calendar', content: `${planClassement.archiveIntermidiaireDuree || 'N/A'} days` },
  //       { label: 'Final Archive Duration', icon: 'pi pi-calendar-times', content: `${planClassement.archiveFinalDuree || 'N/A'} days` },
  //     ]}
  //     content={(item) => (
  //       <small className="text-color-secondary">{item.content}</small>
  //     )}
  //   />
  // );

  const renderCardHeader = (title: string, icon: string) => (
    <div className="bg-primary p-3 mb-3" style={{ borderRadius: '6px 6px 0 0' }}>
      <div className="flex align-items-center">
        <i className={`${icon} mr-2 text-xl text-white`}></i>
        <span className="font-bold text-xl text-white">{title}</span>
      </div>
    </div>
  );

  const renderDocumentDetails = () => (
    <>
      <Card 
      className="mb-4"
      header={renderCardHeader("Document Information", "pi pi-file")}
      >
        <div className="flex align-items-center mb-4">
          <i className="pi pi-file-pdf text-4xl text-primary mr-3"></i>
          <div>
            <h2 className="m-0 text-lg font-bold">{document?.reference}</h2>
            <p className="text-500 mb-0">{document?.referenceGed}</p>
          </div>
        </div>
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex align-items-center mb-3">
              <i className="pi pi-calendar mr-2 text-500"></i>
              <span>Uploaded on {new Date(document?.uploadDate || '').toLocaleDateString()}</span>
            </div>
            <div className="flex align-items-center mb-3">
              <i className="pi pi-file mr-2 text-500"></i>
              <span>Size: {document?.size ? `${(document.size / 1024).toFixed(2)} KB` : 'N/A'}</span>
            </div>
            <div className="flex align-items-center">
              <i className="pi pi-info-circle mr-2 text-500"></i>
              <span>{document?.description || 'No description'}</span>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <h3 className="mb-3">Document Status</h3>
            <div className="flex flex-wrap">
              {getStatusTag(document?.signed || false, "Signed", "pi-check-circle")}
              {getStatusTag(document?.archive || false, "Archived", "pi-inbox")}
              {getStatusTag(document?.versionne || false, "Versioned", "pi-copy")}
              {getStatusTag(document?.ocr || false, "OCR", "pi-file-edit")}
              {getStatusTag(document?.locked || false, "Locked", "pi-lock")}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid">
        <div className="col-12 md:col-4">
          <Card className="h-full" header={renderCardHeader("Type & Category", "pi pi-tag")}>
            <div className="mb-3">
              <label className="block text-500 mb-1">Document Type</label>
              <Chip label={document?.documentType?.libelle || 'N/A'} icon="pi pi-file" />
            </div>
            <div className="mb-3">
              <label className="block text-500 mb-1">Category</label>
              <Chip label={document?.documentCategorie?.libelle || 'N/A'} icon="pi pi-folder" />
            </div>
            <div>
              <label className="block text-500 mb-1">State</label>
              <Chip label={document?.documentState?.libelle || 'N/A'} icon="pi pi-info-circle" />
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-4">
          <Card className="h-full" header={renderCardHeader("Administrative Entity", "pi pi-building")}>
            <div className="mb-3">
              <label className="block text-500 mb-1">Name</label>
              <span>{document?.entiteAdministrative?.libelle || 'N/A'}</span>
            </div>
            <div>
              <label className="block text-500 mb-1">Code</label>
              <span>{document?.entiteAdministrative?.code || 'N/A'}</span>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-4">
          <Card className="h-full" header={renderCardHeader("User Information", "pi pi-user")}>
            <div className="flex align-items-center mb-3">
              <Avatar 
                label={document?.utilisateur?.nom?.charAt(0) || '?'} 
                size="large" 
                shape="circle" 
                className="mr-2"
              />
              <span>{document?.utilisateur?.nom || 'N/A'}</span>
            </div>
            <div>
              <label className="block text-500 mb-1">Email</label>
              <span>{document?.utilisateur?.email || 'N/A'}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* <Card className="mt-4" header={renderCardHeader("Plan Classement", "pi pi-sitemap")}>
        {document?.planClassement ? renderPlanClassement(document.planClassement) : 'No plan classement available'}
      </Card> */}
    </>
  );

  const renderWorkflows = () => (
    <div>
      {isLoadingWorkflow ? (
        <div className="flex justify-content-center">
          <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
      ) : workflows && workflows.length > 0 ? (
        <WorkflowSteps workflow={workflows} />
      ) : (
        <p>Ce Document n'a pas de Workflow associé.</p>
      )}
    </div>
  );

  const renderParapheurs = () => (
    <div>
      {isLoadingParapheurs ? (
        <div className="flex justify-content-center">
          <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
      ) : parapheurs && parapheurs.length > 0 ? (
        <ul className="list-none p-0 m-0">
          {parapheurs.map((parapheur: ParapheurDto) => (
            <li key={parapheur.id} className="mb-3">
              <ParapheurCard parapheur={parapheur} />
            </li>
          ))}
        </ul>
      ) : (
        <p>This document has no associated parapheurs.</p>
      )}
    </div>
  );

  return (
    <Dialog header="Document Details" visible={visible} onHide={onHide} style={{ width: '80vw' }} maximizable>
      {document && (
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header="Document Details" leftIcon="pi pi-file mr-2">
            {renderDocumentDetails()}
          </TabPanel>
          <TabPanel header="Workflows" leftIcon="pi pi-sitemap mr-2">
            {renderWorkflows()}
          </TabPanel>
          <TabPanel header="Parapheurs" leftIcon="pi pi-file-edit mr-2">
            {renderParapheurs()}
          </TabPanel>
        </TabView>
      )}
    </Dialog>
  );
};

export default DocumentDetailsDialog;