import axiosInstance from 'app/axiosInterceptor';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import { useEffect, useState } from 'react';


const expandAllNodes = (data: any) => {
  return data.map((node: any) => {
    node.expanded = true;
    node.style = { borderRadius: '12px', backgroundColor: "#123C69" };
    node.className = 'text-white';

    if (node.children) {
      node.children = expandAllNodes(node.children);
    }
    return node;
  });
};

const nodeTemplate = (node: any) => {
  return (
    <div style={{ borderRadius: "10px" }} className="flex flex-column border-round-xs">
      <div className="flex flex-column align-items-center border-round-lg">
        <span className="font-bold mb-3">{node.libelle}</span>
        {node.utilisateurInfo && (
          <div style={{ borderBlock: "1px solid #dee2e6" }} className="flex p-2">
            <span className='pr-2'>Chef:</span>
            <span className='pr-2'>{node.utilisateurInfo.nom}</span>
            <span> {node.utilisateurInfo.prenom}</span>
          </div>
        )}
      </div>
    </div>
  );
};


const Organigrame: React.FC = () => {

  const [organigrame, setOrganigrame] = useState<any>([]);

  const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();

  useEffect(() => {
    entiteAdministrativeAdminService.getOrganigrame().then(({ data }) => {
      if (data) {
        const modifiedData = expandAllNodes([data]);
        setOrganigrame(modifiedData)
      }
    }).catch(error => console.log(error));
  }, [])

  const importPlans = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}entiteAdministrative/import`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          window.location.reload();
        }).catch(error => {
          console.error('Error during import:', error);
        });
      }
    };

    input.click();
  }
  const exportPlans = () => {
    axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}entiteAdministrative/export`, {
      responseType: 'json',
    }).then(response => {
      const jsonData = JSON.stringify(response.data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'entite-administrative.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error('Erreur lors de l\'export :', error);
    });
  }

  return (
    <div>
      <h2>Entité Administrative</h2>
      <Button
        label="Import"
        icon="pi pi-file-import"
        className="p-button-raised p-button-rounded p-button-info m-2"
        onClick={importPlans}
      />
      <Button
        label="Export"
        icon="pi pi-file-export"
        className="p-button-raised p-button-rounded p-button-info m-2"
        onClick={exportPlans}
      />
      <div className="card overflow-x-auto mt-2">
        {organigrame.length !== 0 && <OrganizationChart value={organigrame} nodeTemplate={nodeTemplate} />}
      </div>
    </div>
  );
};

export default Organigrame;
