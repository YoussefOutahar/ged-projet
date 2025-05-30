import usePlanClassementStore from 'Stores/PlanClassementStore';
import axiosInstance from 'app/axiosInterceptor';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import React, { useEffect, useState } from 'react'

const useForceUpdate = () => {
  const [, forceUpdate] = useState<number>(0);
  return () => forceUpdate((prev) => prev + 1);
};
const PlanOrganigrame = () => {
  const { planClassements,planClassementsTree,fetchPlanClassementsChildren } = usePlanClassementStore();
  const [organigrammeData, setOrganigrammeData] = useState([]);

  useEffect(() => {
    const formattedData = expandAllNodes(planClassementsTree);
    setOrganigrammeData(formattedData);
  }, [planClassementsTree]);

  const expandAllNodes = (data: any) => {
    return data.map((node: any) => {
      node.expanded = true;
      node.style = { borderRadius: '12px', backgroundColor: "#49509f" };
      node.className = 'text-white';
      node.dataSize = null;
      if (node.children) {
        node.children = expandAllNodes(node.children);
      }
      return node;
    });
  };
  const fetchDataForNode = async (id: number) => {
    try {
      const requestBody = {
        planClassement: { id }
      };
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody);
      return {
        dataSize: response.data.dataSize,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        dataSize: null,
      };
    }
  };
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const handleRedirectToPlan = () => {
    router.push('/plan-classement');
  };
  const nodeTemplate = (node: any) => {
    const handleClick = async () => {
      const { dataSize } = await fetchDataForNode(node.id);
      node.dataSize = dataSize;
      await fetchPlanClassementsChildren(node.id);
      forceUpdate();
    };
    return (
      <div style={{ borderRadius: "10px", width: '150px' }} className="flex flex-column border-round-xs cursor-pointer" onClick={handleClick}>
        <div className="flex flex-column align-items-center border-round-lg">
          <span className="font-bold mb-3">{node.libelle}</span>
          {node.dataSize !== null && (
            <div style={{ borderBlock: "1px solid #dee2e6" }} className="flex p-2">
              <span className='pr-2'>Documents:</span>
              <span className='pr-2'>{node.dataSize}</span>
              <Button icon="pi pi-eye" onClick={handleRedirectToPlan} className="p-button-info" style={{ borderRadius: '5rem', width: '27px', height: '27px' }} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const importPlans = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
        axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/import`, formData, {
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
    axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/export`, {
      responseType: 'json',
    }).then(response => {
      const jsonData = JSON.stringify(response.data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'plan_classement.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error('Erreur lors de l\'export :', error);
    });
  }

  return (
    <div>
      <h2>Plan de Classement</h2>
      <div >
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
      </div>
      <div className="card overflow-x-auto mt-2">
        {organigrammeData.length !== 0 && <OrganizationChart value={organigrammeData} nodeTemplate={nodeTemplate} />}
      </div>
    </div>
  )
}

export default PlanOrganigrame