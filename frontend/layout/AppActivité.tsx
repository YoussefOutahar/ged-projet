import axiosInstance from 'app/axiosInterceptor';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import React, { useEffect, useState } from 'react'
import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import useAuditStore from 'Stores/AuditStore';

const AppActivité = () => {
    const { t } = useTranslation();

    const {audits, alerts: alertAudits} = useAuditStore();
    const [visible, setVisible] = useState(true);

    const showPanel = () => {
        setVisible(true);
    };

    const hidePanel = () => {
        setVisible(false);
    };
    const today = new Date();
    const [auditsToday, setAuditsToday] = useState<number>(0); // Nombre d'audits pour aujourd'hui
    useEffect(() => {
        const today = new Date();
        const auditsForToday = Array.isArray(audits) ? audits.filter(audit => {
            const createdOn = new Date(audit.createdOn[0], audit.createdOn[1] - 1, audit.createdOn[2]);
            return createdOn.getDate() === today.getDate() && createdOn.getMonth() === today.getMonth() && createdOn.getFullYear() === today.getFullYear();
        }):[];
        setAuditsToday(auditsForToday.length);
    }, [audits]);
    const getTimeElapsed = (createdOn: any) => {
        const createdDate = new Date(createdOn[0], createdOn[1] - 1, createdOn[2], createdOn[3], createdOn[4]);
        const currentDate = new Date();
        const minutesDifference = differenceInMinutes(currentDate, createdDate);
    
        if (minutesDifference < 60) {
            return `il y a ${minutesDifference} minute${minutesDifference > 1 ? 's' : ''}`;
        } else {
            return format(new Date(createdOn[0], createdOn[1] - 1, createdOn[2], createdOn[3], createdOn[4]), "HH:mm");
        }
    };
    const sortedAudits = Array.isArray(audits) && audits.every(audit => typeof audit === 'object') ? audits.slice().sort((a, b) => {
        const dateA = new Date(a.createdOn[0], a.createdOn[1] - 1, a.createdOn[2], a.createdOn[3], a.createdOn[4]).getTime();
        const dateB = new Date(b.createdOn[0], b.createdOn[1] - 1, b.createdOn[2], b.createdOn[3], b.createdOn[4]).getTime();
        return dateB - dateA;
    }):[];
    const header2 = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Alert</span>
                <Badge value={alertAudits.length} severity='danger' />
            </div>
        )
    };
    const header1 = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Daily</span>
                <Badge value={auditsToday} severity='success' />
            </div>
        )
    };
  return (
    <>
        {/* <Button label={t('audit.activite')} onClick={showPanel} className='mb-2 w-full' style={{backgroundColor: '#2db629',borderColor: '#2db629'}}/> */}
        {visible && 
        <div className="sidebar-panel-content" style={{width:'full'}}>
            <Panel header={
                <div className="flex">
                    <h5 className='text-base mt-2 mr-1'>{t('audit.activite')}:</h5>
                    {/* <span
                        style={{
                            display: 'inline-block',
                            width: '2em',
                            height: '2em',
                            lineHeight: '2em',
                            textAlign: 'center',
                            backgroundColor: '#3df737',
                            color: '#fff',
                            borderRadius: '50%'
                        }}
                    >
                        {auditsToday}
                    </span> 
                    <Button className="p-button-text p-button-rounded ml-8" icon="pi pi-times" onClick={hidePanel} />*/}
                </div>
            }>
                <TabView>
                    <TabPanel headerTemplate={header1} headerClassName="flex align-items-center">
                        <div style={{width:'full', maxHeight: 'calc(83vh - 12rem)', overflowY: 'auto'}}>
                            <div className="flex mb-2">
                                <img alt="" src="/calendar.png" width='10%'height='5%' className='mx-2 mt-4'/>
                                <h3>{t('audit.day')}</h3>
                            </div>
                            {sortedAudits
                            .filter(audit => {
                                const createdOn = new Date(audit.createdOn[0], audit.createdOn[1] - 1, audit.createdOn[2]);
                                return createdOn.getDate() === today.getDate() && createdOn.getMonth() === today.getMonth() && createdOn.getFullYear() === today.getFullYear();
                            })
                            .map((audit, index) => (
                                <Card key={index} className='mb-1'>
                                    <div className="flex align-items-center gap-2">
                                        <img alt="" src="/user-avatar.png" width="32" />
                                        <span className='font-bold'>{audit.utilisateur ? audit.utilisateur.nom +' '+audit.utilisateur.prenom : 'Client exterene'} 
                                            <span>{' à '}</span> 
                                            <span className='font-bold text-blue-500'>{audit.action}</span>
                                        </span>
                                    </div>
                                    <div className='font-semibold'>{t("audit.document")} :<span className='font-semibold text-purple-500'>{audit.document.reference}</span></div>
                                    <div>
                                        <span className='font-semibold'>{t("audit.description")} :</span> action traité le 
                                        <span className='font-mono text-green-500'>{' '+format(new Date(audit.createdOn[0], audit.createdOn[1] - 1, audit.createdOn[2]), "dd/MM/yyyy")}</span>
                                        <span>{' par ' + (audit.utilisateur ? audit.utilisateur.username : 'Interface')}</span>
                                    </div>
                                    <div>
                                        <span className='text-blue-400'>{getTimeElapsed(audit.createdOn)}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel headerTemplate={header2} headerClassName="flex align-items-center">
                        {alertAudits.map((audit, index) => (
                            <Card key={index} className='mb-1'>
                                <div className="flex align-items-center gap-2">
                                        <img alt="" src="/user-avatar.png" width="32" />
                                        <span className='font-bold'>{audit.fullName} 
                                            <span>{' à '}</span> 
                                            <span className='font-bold text-blue-500'>Consulté</span>
                                        </span>
                                    </div>
                                    <div className='font-semibold'>{t("audit.document")} :<span className='font-semibold text-purple-500'>{audit.document}</span></div>
                                    <div>
                                        <span className='font-semibold'>{t("audit.description")} :</span> action traité
                                        <span>{' par ' + audit.user}</span>
                                    </div>
                                    <div>
                                    <span className='font-semibold'>Nombre de fois :</span> 
                                    <span className='font-bold text-red-600'>{audit.consultationCount}</span>
                                    </div>
                            </Card>
                        ))}
                    </TabPanel>
                </TabView>
            </Panel>
        </div>
        }
  </>
  )
}

export default AppActivité
