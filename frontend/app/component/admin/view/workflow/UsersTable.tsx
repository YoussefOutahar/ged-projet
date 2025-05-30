import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { Column } from 'primereact/column';
import { UserDestinataireDTO } from 'app/controller/model/workflow/userDestinataireDTO';

type Props = {
    onStepPresetChange: (newDestinataire: UserDestinataireDTO) => void;
    utilisateurs : UtilisateurDto[];
};

export default function UsersTable({ onStepPresetChange , utilisateurs}: Props) {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

 

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  const header = (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
      </span>
    </div>
  );

  return (
    <div className="card max-w-80">
      <DataTable 
        value={utilisateurs}
        paginator
        rows={5}
        dataKey="id"
        globalFilterFields={['email','nom', 'prenom', 'roles.label']}
        header={header}
        emptyMessage="No customers found."
        globalFilter={globalFilterValue}
        selectionMode='single'
        onRowClick={(e) =>{
            const destinataire: UserDestinataireDTO = {
                id: 1,
                utilisateur: e.data as UtilisateurDto,
                stepId: 1, //TODO: get stepId from parent component
                poids: 1,
                shouldSign: false,
            };
            onStepPresetChange(destinataire);
        } }
      >
        <Column field="email" header="Email" />
        <Column field="nom" header="Nom" />
        <Column field="prenom" header="Prenom" />
      </DataTable>
    </div>
  );
}
