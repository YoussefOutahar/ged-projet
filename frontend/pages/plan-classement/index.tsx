import React, { useEffect, useRef, useState } from 'react'
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/confirmdialog';
import axios from 'app/axiosInterceptor';
import TreeNode from 'primereact/treenode';
import { Button } from 'primereact/button';
import AddPlanDialog from 'app/component/admin/view/organigramme/plan-classement/create/AddPlanDialog';
import { Toast } from 'primereact/toast';
import DocumentsList from "app/component/admin/view/doc/document/list/document-list-admin.component";
import EditPlanDialog from 'app/component/admin/view/organigramme/plan-classement/edit/EditPlanDialog';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'app/axiosInterceptor';
import usePlanClassementStore from 'Stores/PlanClassementStore';
import { useDebounce } from "react-use";
import { queryClient } from 'pages/_app';

interface Node {
  key: string;
  label: string;
  children?: Node[];
  archive?: boolean;
}
type SeverityType = 'success' | 'info' | 'warn' | 'error';

const PlanClassement = () => {
  const [clickedNode, setClickedNode] = useState<Node | null>(null);
  const [idRefresh, setidRefresh] = useState<Number>();
  const [plans, setPlans] = useState<Node[]>([]);

  const [isDialogVisibleAdd, setDialogVisibleAdd] = useState(false);
  const [isDialogVisibleEdit, setDialogVisibleEdit] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationVisibleArchive, setConfirmationVisibleArchive] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<TreeNode | null>(null);
  const [nodeToArchiver, setNodeToArchiver] = useState<TreeNode | null>(null);
  const toastRef = useRef<Toast>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState('');
  const [selectedParentPlanKey, setSelectedParentPlanKey] = useState('');
  const [dataSize, SetDataSize] = useState<Number>(0);
  const { t } = useTranslation();

  const showToast = (severity: SeverityType, summary: string) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, life: 4000 });
    }
  };

  const {planClassementsTree, fetchPlanClassementsChildren, loading: loadingPlans, setLoading: setLoadingPlans} = usePlanClassementStore();
  useEffect(() => {
      const filteredPlans = planClassementsTree.map(convertToTreeNode).filter((node): node is Node => node !== null);
      setPlans(filteredPlans);
  }, [planClassementsTree]);

  const fetchDataForNode = async (id: Number) => {
    try {
      const requestBody = {
        planClassement: { id }, maxResults: onRows
      };

      fetchPlanClassementsChildren(id as number);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody);

      // Utilisation des fonctions de mise à jour d'état
      setSelectedNodeData(response.data.list);
      SetDataSize(response.data.dataSize);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const [start, setStart] = useState(0);
  const [onRows, setOnRows] = useState(5);
  const nextPage = async (event: PaginatorPageChangeEvent) => {
    const id = idRefresh;
    if (id) {
      const updatedCriteria = {
        planClassement: { id },
        maxResults: event.rows,
        page: event.page,
      };

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, updatedCriteria);
        setSelectedNodeData(response.data.list);
        SetDataSize(response.data.dataSize);

        setStart(event.first);
        setOnRows(event.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };
  const convertToTreeNode = (data: any): Node | null => {
    if (data.archive === true) {
      return null; // Ignorer les nœuds avec archive à true
    }
    const treeNode: Node = {
      key: data.id.toString(),
      label: data.libelle,
      archive: data.archive,
    };

    if (data.children && data.children.length > 0) {
      //treeNode.children = data.children.map(convertToTreeNode);
      treeNode.children = data.children.map(convertToTreeNode).filter((node: any): node is Node => node !== null);
    }

    return treeNode;
  };
  const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
    const isClickedNode = clickedNode && clickedNode.key === node.key;

    return (
      <div className='cursor-pointer '>
        <i
          className="pi pi-folder"
          style={{ marginRight: '0.5rem', color: '#98c34d', }} />
        <span style={{ color: '#49509f', fontWeight: 'normal', marginRight: '0.8rem', marginBottom: '1rem' }}  >{node.label}</span>
        {isClickedNode && (
          <div style={{ float: 'right', marginTop: '4px' }}>
            <Button icon="pi pi-plus" onClick={handleAddPlanClick} className="p-button-success" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
            <Button icon="pi pi-pencil" onClick={() => handleEdit(node)} className="p-button-warning" style={{ borderRadius: '5rem', marginRight: '0.5rem', width: '27px', height: '27px' }} />
            <Button icon="pi pi-trash" onClick={() => handleDelete(node)} className="p-button-danger" style={{ borderRadius: '5rem', width: '27px', height: '27px', marginRight: '0.5rem' }} />
            <Button raised icon="pi pi-box" onClick={() => handleArchiver(node)} className="mr-1" style={{ backgroundColor: '#4361EE', border: '#4361EE', borderRadius: '5rem', width: '27px', height: '27px' }} />
          </div>
        )}
      </div>
    );
  };

  const handleEdit = (node: TreeNode) => {
    setDialogVisibleEdit(true);
  };

  const handleArchiver = (node: TreeNode) => {
    setNodeToArchiver(node);
    setConfirmationVisibleArchive(true);
  };

  const handleDelete = (node: TreeNode) => {
    setNodeToDelete(node);
    setConfirmationVisible(true);
  };

  const confirmArchive = () => {
    if (nodeToArchiver) {
      const id = Number(nodeToArchiver.key);
      axios.put(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/archiver/${id}`)
        .then(response => {
          refreshPlans(id);
          setConfirmationVisibleArchive(false);
          showToast('success', t('success.documentsArchiveSuccess'));
        })
        .catch(error => {
          console.error('Error archive item', error);
          setConfirmationVisibleArchive(false);
          showToast('error', t('error.canNotDeleteClassificationPlan'));
        });
    }
    setNodeToArchiver(null);
    setConfirmationVisibleArchive(false);
  };

  const confirmDelete = () => {
    if (nodeToDelete) {
      const id = Number(nodeToDelete.key);
      axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/${id}`)
        .then(response => {
          refreshPlans(id);
          setConfirmationVisible(false);
          showToast('success', t('success.classificationPlanDeleted'));
        })
        .catch(error => {
          console.error('Error deleting item', error);
          setConfirmationVisible(false);
          showToast('error', t('error.canNotDeleteClassificationPlan'));
        });
    }

    const parentId = Number(findParentNodeId(plans, String(nodeToDelete?.key)));

    refreshPlans(parentId);
    setNodeToDelete(null);
    setConfirmationVisible(false);
  };

  const cancelDelete = () => {
    setNodeToDelete(null);
    setConfirmationVisible(false);
  };

  const cancelArchive = () => {
    setNodeToArchiver(null);
    setConfirmationVisibleArchive(false);
  };

  const [plan, setPlan] = useState<any>([]);
  const [disablTableArchive, setDisablTableArchive] = useState<boolean>(false);
  const handleNodeClick = (node: TreeNode) => {
    // setClickedNode((prevClickedNode) => (prevClickedNode && prevClickedNode.key === node.key ? null : node as Node));
    setStart(0);
    setDisablTableArchive(false); // Switch to the normal documents table
    setClickedNode((prevClickedNode) => {
      if (prevClickedNode && prevClickedNode.key === node.key) {
        return null;
      } else {
        return node as Node;
      }
      

    });
    
    setSelectedPlanKey(String(node.key) || 'vide');
    setSelectedParentPlanKey(findParentNodeId(plans, String(node.key)) || 'vide');

    setidRefresh(Number(node.key));
    const fetchData = async () => {
      const id = Number(node.key); // Utiliser directement la clé du nœud actuel
      await fetchDataForNode(id);
    };
    axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/id/${node.key}`)
      .then(response => setPlan(response.data))
      .catch(error => console.error('Error loading plans', error));
    fetchData();
  };

  function findParentNodeId(nodes: Node[], targetKey: string, parentKey: string | null = null): string | null {
    for (const node of nodes) {
      if (node.children) {
        for (const child of node.children) {
          if (child.key === targetKey) {
            return node.key;
          } else {
            const foundParentKey = findParentNodeId(node.children, targetKey, node.key);
            if (foundParentKey) return foundParentKey; 
          }
        }
      }
    }
    return null;
  }

  const handleAddPlanClick = () => {
    setDialogVisibleAdd(true);
  };

  const handleDialogClose = () => {
    setDialogVisibleAdd(false);
    setDialogVisibleEdit(false);

    refreshPlans(Number(selectedPlanKey));
  };

  const refreshPlans = (selectedPlanClassementId: number) => {

    queryClient.invalidateQueries({queryKey: ['planClassementsChildren', selectedPlanClassementId]});
    queryClient.refetchQueries({queryKey: ['planClassementsChildren', selectedPlanClassementId]});
    fetchPlanClassementsChildren(selectedPlanClassementId);
  };

  const refreshTable = () => {
    fetchDataForNode(idRefresh ?? 1);
  };


  const [searchPlanClassment, setSearchPlanClassment] = useState<string>('');
  const [searchPlanClassmentResults, setSearchPlanClassmentResults] = useState<any[]>([]);
  const handleSearchByLibelle = async () => {
    setLoadingPlans(true);
    axios.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/search/${searchPlanClassment}`)
      .then(response => {
        const filteredPlans = response.data.map(convertToTreeNode).filter((node): node is Node => node !== null);
        setSearchPlanClassmentResults(filteredPlans);
      }).catch(error => console.error('Erreur lors du chargement des plans', error)).finally(() => setLoadingPlans(false));
  };
  useDebounce(() => {
    if (searchPlanClassment.length > 0) {
      handleSearchByLibelle();
    }
  }, 1000, [searchPlanClassment]);

  return (
    <div>
      <div className='flex flex-row'>
        <h2 className='mr-8'>{t("document.classificationPlan")}</h2>
      </div>
      <div className='flex flex-row'>
        <Tree
          value={searchPlanClassment.length > 0 ? searchPlanClassmentResults : plans}
          // header={headerTree()}
          filter filterMode="strict" filterPlaceholder="Recherche par libellé"
          filterValue={searchPlanClassment}
          onFilterValueChange={async (e) => {
            setSearchPlanClassment(e.value);
          }}
          nodeTemplate={nodeTemplate}
          className='tree-container '
          onNodeClick={(e) => handleNodeClick(e.node) }
          loading={loadingPlans}
        />
        <DocumentsList
          selectedNodeData={selectedNodeData}
          size={dataSize}
          displaybutton={true}
          refreshTable={refreshTable}
          nextPage={nextPage}
          start={start}
          onRows={onRows}
          plan={plan}
          disablTableArchiveG={disablTableArchive}
        />

      </div>
      {isDialogVisibleAdd && <AddPlanDialog  selectedPlanKey={selectedPlanKey} refreshPlans={refreshPlans} visible={isDialogVisibleAdd} onClose={handleDialogClose} showToast={showToast} />}
      {isDialogVisibleEdit && <EditPlanDialog selectedPlanKey={selectedPlanKey} parentPlanKey={selectedParentPlanKey} refreshPlans={refreshPlans} visible={isDialogVisibleEdit} onClose={handleDialogClose} showToast={showToast} />}
      <Toast ref={toastRef} />
      <ConfirmDialog
        visible={confirmationVisible}
        onHide={cancelDelete}
        message={t('success.suppressionConfirmationMessage')}
        header={t('success.suppressionConfirmation')}
        icon="pi pi-exclamation-triangle"
        acceptLabel={t('yes')}
        rejectLabel={t('no')}
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary"
        accept={confirmDelete}
        reject={cancelDelete}
      />
      <ConfirmDialog
        visible={confirmationVisibleArchive}
        onHide={cancelArchive}
        message={t('document.archiveConfirmationMessage')}
        header={t('document.archiveConfirmation')}
        icon="pi pi-exclamation-triangle"
        acceptLabel={t('yes')}
        rejectLabel={t('no')}
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary"
        accept={confirmArchive}
        reject={cancelArchive}
      />
    </div>
  )
}

export default PlanClassement
