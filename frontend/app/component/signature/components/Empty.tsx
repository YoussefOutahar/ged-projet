import React from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

interface Props {
  loading: boolean;
  uploadPdf: () => void;
}
export const Empty: React.FC<Props> = ({ loading, uploadPdf }) => (
 
    <Button 
      label="Load PDF"
      icon="pi pi-upload"
      onClick={uploadPdf}
      className="p-button-primary"
    />

);

