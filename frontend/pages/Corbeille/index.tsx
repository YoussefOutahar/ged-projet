import React, { useEffect, useState } from 'react'
import DocumentsList from "app/component/admin/view/doc/document/list/document-list-admin.component";
import axiosInstance from 'app/axiosInterceptor';
import { PaginatorPageChangeEvent } from 'primereact/paginator';


const Corbeille = () => {
    const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
    const [dataSize,setDataSize] = useState<Number>(0);

    const fetchDataForNode = async () => {
        try {
          const requestBody = {};  
          const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria/deleted`, requestBody);
          
          setSelectedNodeData(response.data.list);
          setDataSize(response.data.dataSize);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchDataForNode();
      }, []); 
      
    const [start, setStart] = useState(0);
    const [onRows, setOnRows] = useState(10);

    const nextPage = async (event: PaginatorPageChangeEvent) => { 
      const updatedCriteria = {
        maxResults: event.rows,
        page: event.page,
      };

      try {
        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_ADMIN_URL}document/find-paginated-by-criteria/deleted`, updatedCriteria);
        setSelectedNodeData(response.data.list);
        setDataSize(response.data.dataSize);

        setStart(event.first);
        setOnRows(event.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  return (
    <div><DocumentsList selectedNodeData={selectedNodeData} size={dataSize} displaybutton={false} refreshTable={fetchDataForNode} nextPage={nextPage}
      start={start}
      onRows={onRows}/>
    </div>
  )
}

export default Corbeille