import React, { useEffect, useRef, useState } from 'react'
import { Toolbar } from 'primereact/toolbar';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import ParapheurList from 'app/component/admin/view/doc/parapheur/ParapheurList';
import UpdateParapheur from 'app/component/admin/view/doc/parapheur/UpdateParapheur';
import DeleteParapheur from 'app/component/admin/view/doc/parapheur/DeleteParapheur';
import { useDebounce } from 'primereact/hooks';

import axiosInstance from 'app/axiosInterceptor';
import { ParapheurDto } from 'app/controller/model/parapheur/parapheurDto.model';
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;


type Props = {}

const index = (props: Props) => {
  const { t } = useTranslation();
  const [loadingParapheurs, setLoadingParapheurs] = useState<boolean>(true);
  const [errorParapheur, setErrorParapheurs] = useState<boolean>(false);

  const [selectedParapheur, setSelectedParapheur] = useState<ParapheurDto[]>([]);



  const toast = useRef<Toast>(null);

  const [filteredParapheurs, setFilteredParapheurs] = useState<Page<ParapheurDto>>();
  const [selectedSignStatus, setSelectedSignStatus] = useState('unsigned');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchKeyword, debouncedSearchKeyword, setSearchKeyword] = useDebounce('', 1000);

  // this is to prevent fetching data multiple times when the component is mounted
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);  

  const fetchFiltredParapheurs = async (pageP:number)  => {
    setFilteredParapheurs(undefined);
    setErrorParapheurs(false);
    setLoadingParapheurs(true);
      return await axiosInstance.get(`${API_URL}/parapheurs/getPaginatedParapheurs/`, {
          params: {
              page : pageP,
              size :size ,
              filter: selectedSignStatus,
              searchKeyWord: debouncedSearchKeyword
          }
      }).then((res) => {
          setFilteredParapheurs(res.data);
      }).catch((err) => {
          console.log("Error getting parapheurs tasks :", err)
          setErrorParapheurs(true);
      }).finally(() => {
          setLoadingParapheurs(false);
          setInitiallyLoaded(true);
      });
  }

  

  useEffect(() => {
    if (initiallyLoaded) {
      fetchFiltredParapheurs(page);
    }
  }, [page]);

  useEffect(() => {
    if (initiallyLoaded) {
      if (page !== 0) {
        setPage(0);
      } else {
        fetchFiltredParapheurs(0);
      }
    }
  }, [selectedSignStatus, debouncedSearchKeyword]);


  useEffect(() => {
    fetchFiltredParapheurs(0);
  }, []);



  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-4"
        style={{ opacity: loadingParapheurs || errorParapheur ? 0.5 : 1, pointerEvents: loadingParapheurs || errorParapheur ? 'none' : 'auto' }}
        start={() => {
          return (
            <React.Fragment>
              <UpdateParapheur disabled={selectedParapheur.length !== 1} t={t} showToast={toast} refetchParapheur={()=>fetchFiltredParapheurs(page)} selectedParapheur={selectedParapheur[0]} />
              <DeleteParapheur t={t} showToast={toast} refetchParapheur={()=>fetchFiltredParapheurs(page)} selectedParapheur={selectedParapheur} setSelectedParapheur={setSelectedParapheur} />
            </React.Fragment>
          )
        }}>
      </Toolbar>
      <ParapheurList t={t} page={page} setPage={setPage} setSearchKeyword={setSearchKeyword} size={size} selectedSignStatus={selectedSignStatus} setSelectedSignStatus={setSelectedSignStatus} refetchFiltredParapheurs={()=>fetchFiltredParapheurs(page)} filteredParapheurs={filteredParapheurs } selectedParapheur={selectedParapheur} setSelectedParapheur={setSelectedParapheur}  errorParapheur={errorParapheur} loadingParapheurs={loadingParapheurs} showToast={toast} />
    </div>

  )
}

export default index
