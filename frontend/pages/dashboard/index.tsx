import { useContext, useEffect, useRef, useState } from "react";

import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { DocumentAdminService } from "app/controller/service/admin/DocumentAdminService.service";
import { EntiteAdministrativeAdminService } from "app/controller/service/admin/EntiteAdministrativeAdminService.service";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { LayoutContext } from "layout/context/layoutcontext";
import { Chart } from "primereact/chart";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { format } from "date-fns";
import { MessageService } from "app/zynerator/service/MessageService";
import { Toast } from "primereact/toast";
import useUtilisateurStore from "Stores/Users/UtilsateursStore";
import useEntiteAdministrativesStore from "Stores/EntiteAdministrativesStore";
import TasksAlert from "app/component/admin/view/alerts/TasksAlert";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import { on } from "process";
import ParapheurKPIGeneral from "app/component/admin/view/doc/parapheur/KPI/ParapheurKPIGeneral";
import usePlanClassementStore from "Stores/PlanClassementStore";
import ParapheurKpiSpec from "app/component/admin/view/doc/parapheur/KPI/ParapheurKpiSpec";
import { InputText } from "primereact/inputtext";

const Dashboard = () => {
  const { t } = useTranslation();
  const { connectedUser } = useConnectedUserStore();
  const DOCUMENTS_BY_USER_CHART_INITIAL_DATA = {
    labels: [t('mois.january'),
    t('mois.february'),
    t('mois.march'),
    t('mois.april'),
    t('mois.may'),
    t('mois.june'),
    t('mois.july'),
    t('mois.august'),
    t('mois.september'),
    t('mois.october'),
    t('mois.november'),
    t('mois.december'),],
    datasets: [
      {
        label: t("document.documentScannesParUtilisateur"),
        backgroundColor: "#123C69",
        borderColor: "#123C69",
        data: [null, null, null, null, null, null, null, null, null, null, null, null]
      },
    ]
  };
  const DOCUMENTS_BY_ENTITE_ADMINISTRATIVE_CHART_INITIAL_DATA = {
    labels: [t('mois.january'),
    t('mois.february'),
    t('mois.march'),
    t('mois.april'),
    t('mois.may'),
    t('mois.june'),
    t('mois.july'),
    t('mois.august'),
    t('mois.september'),
    t('mois.october'),
    t('mois.november'),
    t('mois.december'),],
    datasets: [
      {
        label: t('document.documentScannesparEntiteAdministrative'),
        backgroundColor: "#AC3B61",
        borderColor: "#AC3B61",
        data: [null, null, null, null, null, null, null, null, null, null, null, null]
      },
    ]
  }

  const { layoutConfig } = useContext(LayoutContext);
  const  [searchInput, setSearchInput] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [documentByUserChartData, setDocumentByUserChartData] = useState(DOCUMENTS_BY_USER_CHART_INITIAL_DATA);
  const [documentByEntiteAdministrativeChartData, setDocumentByEntiteAdministrativeChartData] = useState(DOCUMENTS_BY_ENTITE_ADMINISTRATIVE_CHART_INITIAL_DATA);

  const [chartOptions, setChartOptions] = useState({});

  const {entites: entiteAdministratives} = useEntiteAdministrativesStore();
  const [entiteAdministrative, setEntiteAdministrative] = useState<EntiteAdministrativeDto>({} as EntiteAdministrativeDto);

  const {utilisateurs} = useUtilisateurStore();
  const [utilisateur, setUtilisateur] = useState<UtilisateurDto>({} as UtilisateurDto);

  const [utilisateurDashboard, setUtilisateurDashboard] = useState<any>(null)
  const [entiteAdministrativeDashboard, setEntiteAdministrativeDashboard] = useState<any>(null)
  const [documentCount, setDocumentCount] = useState<number | null>(null)
  const [planClassement, setplanClassement] = useState<number | null>(null)

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [documentPdf, setDocumentPdf] = useState<string | null>(null);
  const entiteAdministrativeAdminService = new EntiteAdministrativeAdminService();
  const utilisateurAdminService = new UtilisateurAdminService();
  const documentAdminService = new DocumentAdminService();
  const onTabChange = (e: { index: number }) => {
    setActiveIndex(e.index);
  };
  const toast = useRef<Toast>(null);

  const initChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          type: "linear",
          stacked: true,
          ticks: {
            stepSize: "2",
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    return options;
  }

  useEffect(() => {
    if(connectedUser){
      setUtilisateur(connectedUser);
      setEntiteAdministrative(connectedUser.entiteAdministrative);
      onDropdownChange({value: connectedUser} as DropdownChangeEvent, "utilisateur");
    }
  },[connectedUser])

  useEffect(() => {
    setChartOptions(initChartOptions)
    utilisateurAdminService.getDashboardKPI().then(({ data }) => setUtilisateurDashboard(data)).catch(error => console.log(error));
    entiteAdministrativeAdminService.getDashboardKPI().then(({ data }) => setEntiteAdministrativeDashboard(data)).catch(error => console.log(error));
    documentAdminService.getDashboardKPI().then(({ data }) => setDocumentCount(data.totalCount)).catch(error => console.log(error));
    documentAdminService.getPlanKpi().then((res) => setplanClassement(res.data)).catch(error => console.log(error));
  }, [layoutConfig.colorScheme]);

  const onDropdownChange = (e: DropdownChangeEvent, field: string) => {
    if (field === "utilisateur" && e.value) {
      setUtilisateur(e.value)
      setDocumentByUserChartData(DOCUMENTS_BY_USER_CHART_INITIAL_DATA);
      documentAdminService.getDocumenByUserName(e.value.username).then(({ data }) => {
        if (data && data.detail.length !== 0) {
          const monthlyStats = data.detail[0].monthlyStats;
          const datasets = [
            {
              label: t('document.documentScannesParUtilisateur'),
              backgroundColor: "#123C69",
              borderColor: "#123C69",
              data: [
                monthlyStats[1],
                monthlyStats[2],
                monthlyStats[3],
                monthlyStats[4],
                monthlyStats[5],
                monthlyStats[6],
                monthlyStats[7],
                monthlyStats[8],
                monthlyStats[9],
                monthlyStats[10],
                monthlyStats[11],
                monthlyStats[12],
              ]
            },
          ]
          setDocumentByUserChartData({ ...documentByUserChartData, datasets: datasets });
        }
      });
    }
    if (field === "entiteAdministrative" && e.value) {
      setDocumentByEntiteAdministrativeChartData(DOCUMENTS_BY_ENTITE_ADMINISTRATIVE_CHART_INITIAL_DATA);
      setEntiteAdministrative(e.value)
      documentAdminService.getDocumenByEntiteAdmunistrative(e.value.code).then(({ data }) => {
        if (data && data.detail.length !== 0) {
          const monthlyStats = data.detail[0].monthlyStats;

          const datasets = [
            {
              label: t("document.documentScannesparEntiteAdministrative"),
              backgroundColor: "#AC3B61",
              borderColor: "#AC3B61",
              data: [
                monthlyStats[1],
                monthlyStats[2],
                monthlyStats[3],
                monthlyStats[4],
                monthlyStats[5],
                monthlyStats[6],
                monthlyStats[7],
                monthlyStats[8],
                monthlyStats[9],
                monthlyStats[10],
                monthlyStats[11],
                monthlyStats[12],
              ]
            },
          ]

          setDocumentByEntiteAdministrativeChartData({ ...documentByEntiteAdministrativeChartData, datasets: datasets });
        }
      });
    }
  };

  return (
    <>
      <div className="grid">
        <div className="col-9">
          <ParapheurKPIGeneral />
          <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
            <TabPanel headerStyle={{ color: "red" }} className="justify-content-center" header={t("document.documentScannesParUtilisateur")}>
              <div className="col-12">
                <Dropdown className="w-full mb-5" showClear id="utilisateurDropdown" value={utilisateur} options={utilisateurs}
                  onChange={(e) => onDropdownChange(e, 'utilisateur')}
                  placeholder={t("document.utilisateurPlaceHolder")} filter
                  filterPlaceholder={t("document.utilisateurPlaceHolderFilter")} optionLabel="nom" />
                <Chart type="bar" data={documentByUserChartData} options={chartOptions} />
              </div>
            </TabPanel>
            <TabPanel header={t("document.documentScannesparEntiteAdministrative")} >
              <div className="col-12">
                <Dropdown className="w-full mb-5" showClear id="entiteAdministrativeDropdown" value={entiteAdministrative}
                  options={entiteAdministratives}
                  onChange={(e) => onDropdownChange(e, 'entiteAdministrative')}
                  placeholder={t("document.entiteAdministrativePlaceHolder")} filter
                  filterPlaceholder={t("document.entiteAdministrativePlaceHolderFilter")}
                  optionLabel="libelle" />
                <Chart type="bar" data={documentByEntiteAdministrativeChartData} options={chartOptions} />
              </div>
            </TabPanel>
            <TabPanel header={t("document.productionGlobaleDocuments")}>
              <div className="col-12">
                <div className="flex justify-end mb-3">
                  <div className="mr-3">

                    <Calendar id="startDate"
                      value={startDate}
                      onChange={(event) => setStartDate(event.value as Date | null)}
                      showIcon
                      placeholder={t("document.datedebut")}
                      dateFormat="yy-MM-dd"
                    />
                  </div>
                  <div className="mr-3">

                    <Calendar id="endDate"
                      value={endDate}
                      onChange={(event) => setEndDate(event.value as Date | null)}
                      showIcon
                      placeholder={t("document.datefin")}
                      dateFormat="yy-MM-dd"
                    />
                  </div>
                  <Button
                    label={t("document.resultatPrductionDocuments")}
                    icon="pi pi-refresh"
                    onClick={() => {
                      setDocumentPdf(null);
                      if (!startDate && !endDate) {
                        return MessageService.showError(toast, 'Error !', t("document.errorDateSelection"));
                      }
                      const formattedStartDate = startDate ? format(new Date(startDate as Date), 'yyyy-MM-dd') : '';
                      const formattedEndDate = endDate ? format(new Date(endDate as Date), 'yyyy-MM-dd') : '';

                      documentAdminService.getGlobaleProduction(formattedStartDate, formattedEndDate).then(({ data }) => {
                        // Handle the response data as needed
                        setDocumentPdf(data);
                      }).catch(Error => {
                        if (Error.response && Error.response.status === 500) {
                          MessageService.showError(toast, 'Error !', Error.response.data.message);
                        } else if (Error.response && Error.response.status === 400) {
                          // 409 Conflict: User already connected
                          MessageService.showError(toast, 'Error !', t("document.errorresultatintrouvable"));
                        } else {
                          MessageService.showError(toast, 'Error !', 'UNE ERREUR EST SURVENUE: Résultat introuvable');
                        }
                        // Handle errors

                      });

                    }}
                  />
                </div>

              </div>
              {documentPdf && <iframe
                title={t("document.viewDocument")}
                width="100%"
                height="600"
                src={`data:application/pdf;base64,${documentPdf}`}>
              </iframe>}
              <Toast ref={toast} />
            </TabPanel>

          </TabView>
          <div className="card mt-4">
            <h1 className='text-xl font-mono font-bold text-blue-900'>Parapheurs KPI Detaillés</h1>
            <InputText className="w-full mb-3" id="searchInput" value={searchInput} onChange={(e) => {
                setSearchInput(e.target.value);
            }} placeholder="Rechercher par parapheur" />
            <ParapheurKpiSpec title={searchInput} />
          </div>
        </div>

        <div className=" col-3">
        <div className="fixed overflow-y-auto" style={{width:"20%", height:"90%"}}>

          <div className="card mb-3">
            <div className="flex">
              <div className="flex  w-full align-items-center justify-content-center justify-content-between mb-3">
                <div className="block text-black-700 font-medium">{t("document.documentScannes")}</div>
                <div className="text-900 font-medium text-3xl">{documentCount}</div>
              </div>
            </div>
          </div>
          <div className="card mb-3">
            <div className="flex">
              <div className="flex  w-full align-items-center justify-content-center justify-content-between mb-3">
                <div className="block text-black-700 font-medium">Plan de Classemnt</div>
                <div className="text-900 font-medium text-3xl">{planClassement}</div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="flex">
              <div className="flex  w-full align-items-center justify-content-center justify-content-between mb-3">
                <div className="block text-black-700 font-medium">{t("document.entiteAdministrative")}</div>
                <div className="text-900 font-medium text-3xl">{entiteAdministrativeDashboard?.totalCount}</div>
              </div>
            </div>
            {entiteAdministrativeDashboard?.detail.sort((a: any, b: any) => a.count - b.count).map((detail: any, index: number) =>
              <div className="mb-2" key={index}>
                <span style={{ color: "#123C69" }} className="font-medium mr-2">{detail.count} - </span>
                <span style={{ color: "#AC3B61" }} className="">{detail.type}</span>
              </div>
            )}
          </div>

          <div className="card mb-3">
            <div className="flex">
              <div className="flex  w-full align-items-center justify-content-center justify-content-between mb-3">
                <div className="block text-700 font-medium">{t("document.utilisateurActifs")}</div>
                <div className="text-900 font-medium text-3xl">{utilisateurDashboard?.totalCount}</div>
              </div>
            </div>
            {utilisateurDashboard?.detail.sort((a: any, b: any) => a.count - b.count).map((detail: any, index: number) =>
              <div className="mb-2" key={index}>
                <span style={{ color: "#123C69" }} className="font-large mr-2">{detail.count} - </span>
                <span style={{ color: "#AC3B61" }} className="">{detail.role}</span>
              </div>
            )}
          </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;