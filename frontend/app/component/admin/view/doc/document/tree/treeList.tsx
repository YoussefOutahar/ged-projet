// TreeComponent.tsx
import React, { useState, useEffect } from 'react';
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import TreeNode from 'primereact/treenode';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import axios from 'app/axiosInterceptor';
import DocumentsList from "app/component/admin/view/doc/document/list/document-list-admin.component";

interface Node {
  key: string;
  label: string;
  children?: Node[];
}

const TreeListOrg: React.FC = () => {
  const [organigrame, setOrganigrame] = useState<Node[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [rootNode, setRootNode] = useState<Node>();
  const [dataSize,SetDataSize] = useState<Number>(0);

  useEffect(() => {
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();

    entiteAdministrativeAdminService.getOrganigrame().then(({ data }) => {
      if (data) {
        const convertedData = convertBackendDataToNode(data);
        setOrganigrame([convertedData]);
        setFilteredNodes([convertedData]);
        setRootNode(prevRootNode => {
          const rootNode = findRootNode(convertedData);
          return rootNode;
        });
      }
    }).catch(error => console.log(error));
  }, []);

  const convertBackendDataToNode = (data: any): Node => {
    return {
      key: data.code,
      label: data.libelle,
      children: data.children?.map(convertBackendDataToNode) || [],
    };
  };
  function findRootNode(node: Node, parent: Node | null = null): Node {
    if (parent === null) {
      return node;
    }
  
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result = findRootNode(child, node);
        if (result) {
          return result;
        }
      }
    }
  
    return node;
  }
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const fetchDataForNode = async (code:string) => {
    try {
      const requestBody = {
        entiteAdministrative: { code }
      };  
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria`, requestBody);
      
      // Utilisation des fonctions de mise à jour d'état
      setSelectedNodeData(response.data.list);
      SetDataSize(response.data.dataSize);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (selectedNodeId) {
        await fetchDataForNode(selectedNodeId);
      } else if (rootNode) {
        await fetchDataForNode(rootNode.key);
      }
    };
  
    fetchData();
  }, [selectedNodeId, rootNode]);
    
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNodeId(node.key);
  };

  const filterNodes = (value: string) => {
    setSearchKeyword(value);

    if (!value) {
      setFilteredNodes(nodes);
    } else {
      const filtered = filterTree(nodes, value.toLowerCase());
      setFilteredNodes(filtered);
    }
  };

  const filterTree = (nodes: Node[], keyword: string): Node[] => {
    return nodes
      .filter((node) => {
        const isMatching = node.label.toLowerCase().includes(keyword);
        const hasChildren = node.children && node.children.length > 0;
  
        if (isMatching) {
          return true;
        }
  
        if (hasChildren) {
          const filteredChildren = filterTree(node.children!, keyword);
            return filteredChildren.length > 0;
        }
  
        return false;
      })
      .map((node) => {
        const hasChildren = node.children && node.children.length > 0;
  
        // Mettre à jour les nœuds enfants pour refléter le filtrage
        if (hasChildren) {
          const filteredChildren = filterTree(node.children!, keyword);
          return { ...node, children: filteredChildren };
        }
  
        return node;
      });
  };
  

  const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
    const typedNode = node as Node & { label?: string, children?: Node[] };
    const hasChildren = typedNode.children && typedNode.children.length > 0;

    return (
      <div className="p-d-flex p-ai-center" onClick={(e) => onNodeClick(e, typedNode)}>
        <i className={`pi ${hasChildren ? 'pi-folder-open' : 'pi-folder'}`} style={{ marginRight: '0.5rem' }}></i>
        <span>{typedNode.label}</span>
      </div>
    );
  };
  const Documents = () => <DocumentsList selectedNodeData={selectedNodeData} size={dataSize}/>;

  return (
    <div className="custom-tree mr-3">
      {/* <div className="p-d-flex p-ai-center p-mb-2">
        <InputText 
          value={searchKeyword} 
          onChange={(e) => filterNodes(e.target.value)} 
          placeholder="Rechercher ....." 
          style={{ width: '100%'}}
        />
      </div> */}
      <div className="flex flex-row-container" >
        <Tree value={filteredNodes} nodeTemplate={nodeTemplate} style={{width: '270px' , minHeight: '570px', marginRight: '10px', borderRadius: '15px',backgroundColor: '#f6f8fa', marginBottom: '1rem'}}/>
        <DocumentsList selectedNodeData={selectedNodeData} size={dataSize} />
      </div>
    </div>
  );
};

export default TreeListOrg;

