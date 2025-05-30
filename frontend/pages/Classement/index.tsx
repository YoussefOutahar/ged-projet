import React, { useState } from 'react'
import { Carousel } from 'primereact/carousel';
import { OrganizationChart } from 'primereact/organizationchart';
import axios from 'axios';
import { EntiteAdministrativeAdminService } from 'app/controller/service/admin/EntiteAdministrativeAdminService.service';
import { DocumentCategorieAdminService } from 'app/controller/service/admin/DocumentCategorieAdminService.service';
import { DocumentTypeAdminService } from 'app/controller/service/admin/DocumentTypeAdminService.service';

interface Node {
    title: string;
    children?: Node[] | null;
}
const index = () => {
    const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '600px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const [organigrammeData, setOrganigrammeData] = useState([]);
  const items = [
    {index: 0, title:"plan Normal"},
    {index: 1, title:"plan Alphabetique"},
    {index: 2, title:"plan Categorie"},
    {index: 3, title:"plan Entité"},
    {index: 4, title:"plan Année"},
    {index: 5, title:"plan Type"}
    ]
    const [selectedCard, setSelectedCard] = useState(null);
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
    const sortNodes = (data: any[]): any[] => {
      return data.sort((a, b) => {
          if (a.libelle < b.libelle) return -1;
          if (a.libelle > b.libelle) return 1;
          return 0;
      }).map(node => {
          if (node.children) {
              node.children = sortNodes(node.children);
          }
          return node;
      });
    };
    const getPlanClassementNormal = ( ) => {
        axios.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement`)
          .then(response => {
            const formattedData = expandAllNodes(response.data);
            setOrganigrammeData(formattedData);
          })
          .catch(error => {
            console.error('Erreur lors du chargement des données :', error);
          });
    }
    const getPlanClassementSort = ( ) => {
      axios.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement`)
          .then(response => {
            const sortedData = sortNodes(response.data);
            const formattedData = expandAllNodes(sortedData);
            setOrganigrammeData(formattedData);
          })
          .catch(error => {
            console.error('Erreur lors du chargement des données :', error);
          });
    }
    const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
    const getPlanClassementEntite = ( ) => {
        entiteAdministrativeAdminService.getOrganigrame().then(({ data }) => {
            if (data) {
              const modifiedData = expandAllNodes([data]);
              setOrganigrammeData(modifiedData)
            }
          }).catch(error => console.log(error));
    }
    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const addDefaultParentNode = (data : any, parent : String) => {
      const parentNode = {
          id: 'default_parent_id',
          code: 'default_parent_code',
          libelle: parent ,
          description: 'Default Parent Node',
          children: data
      };
      return [parentNode];
  };
    const getPlanClassementCategorie = ( ) => {
        documentCategorieAdminService.getList().then(({ data }) => {
            if (data) {
              const treeList = addDefaultParentNode(data, 'Categories');
              const modifiedData = expandAllNodes(treeList);
              setOrganigrammeData(modifiedData)
            }
          }).catch(error => console.log(error));

    }
    const getPlanClassementYear = ( ) => {
      axios.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/plan-years`)
        .then(response => {
          const treeList = addDefaultParentNode(response.data, 'Years');
          const formattedData = expandAllNodes(treeList);
          setOrganigrammeData(formattedData);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données :', error);
        });
  }
  const documentTypeAdminService = new DocumentTypeAdminService();
  const getPlanClassementType = ( ) => {
    documentTypeAdminService.getList().then(({ data }) => {
        if (data) {
          const treeList = addDefaultParentNode(data, 'Types');
          const modifiedData = expandAllNodes(treeList);
          setOrganigrammeData(modifiedData)
        }
      }).catch(error => console.log(error));

}

    const getDataOrganigramme = (index: any) => {
        switch (index) {
            case 0:
              getPlanClassementNormal();
              break;
            case 1:
              getPlanClassementSort();
              break;
            case 2:
              getPlanClassementCategorie();
              break;
            case 3:
              getPlanClassementEntite();
              break;
            case 4:
              getPlanClassementYear();
              break;
            case 5:
              getPlanClassementType();
              break;
        }
        
    }
    const itemTemplate = (item: any) => {
        const isSelected = selectedCard === item.index;
        return (
          <div className={`card mb-0 mr-2 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`} onClick={(e) => {setSelectedCard(item.index),getDataOrganigramme(item.index);}} onDoubleClick={(e) => setSelectedCard(null)}>
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 text-blue-500 font-medium mb-3">{item.title}</span>
                <div className="text-900 font-medium text-xl">{(item.index)+1}/{items.length}</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                <i className="pi pi-sitemap text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-green-500 font-medium">Suggestion</span>
            <span className="text-500">{' '}Classement des documents</span>
          </div>
        );
    };
    const nodeTemplate = (node: any) => {
        return (
          <div style={{ borderRadius: "10px" }} className="flex flex-column border-round-xs">
            <div className="flex flex-column align-items-center border-round-lg">
              <span className="font-bold mb-3">{node.libelle}</span>
            </div>
          </div>
        );
    };
    return(
    <div className="carousel-container">
        <Carousel
        value={items}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={itemTemplate}
        circular
        //   autoplayInterval={3000}
        className="carousel-inner"
        />
        <div className="card overflow-x-auto">
            {organigrammeData.length !== 0 &&<OrganizationChart value={organigrammeData} nodeTemplate={nodeTemplate}/>}
        </div>
  </div>)
}
export default index