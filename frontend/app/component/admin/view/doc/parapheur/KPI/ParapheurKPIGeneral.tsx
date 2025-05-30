import { parapheurService } from 'app/controller/service/parapheur/parapheurService.service'
import React, { useEffect, useState } from 'react'

type ParapheursKpiType = {
    nombreTotal : number,
    nombreParaphSigne: number,
    nombreParaphNonSigne: number,
    nombreParaphRejete: number,
    nombreParapheurHasWorkflow: number,
    nombreParapheurSansWorkflow: number,
    nombreInitiateurDistinct: number
}
const ParapheurKPIGeneral = () => {

    const [parapheursKpi, setParapheursKpi] = useState<ParapheursKpiType>();
    useEffect(() => {
        parapheurService.getAllKPIParapheurs().then(res => setParapheursKpi(res.data)).catch(err => console.error(err));
    },[]);

    const insightItem = (title: string, value: number, icon: string, bgColor: string, iconColor: string) => (
        <div className="col flex-grow-1" style={{ minWidth: '250px' }}>
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center ${bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`pi ${icon} ${iconColor}`}></i>
                    </div>
                </div>
            </div>
        </div>
    );

  return (
    <div className='card'>
        <h1 className='text-xl font-mono font-bold text-blue-900'>Parapheurs KPI</h1>
        {parapheursKpi && (
            <div className="grid">
                {insightItem("Parapheurs Totaux", parapheursKpi.nombreTotal, "pi-sitemap", "bg-blue-100", "text-blue-500")}
                {insightItem("Parapheurs Signés", parapheursKpi.nombreParaphSigne, "pi-check-circle", "bg-green-500", "text-white")}
                {insightItem("Parapheurs Non Signés", parapheursKpi.nombreParaphNonSigne, "pi-play", "bg-blue-100", "text-blue-500")}
                {insightItem("Parapheurs Rejetés", parapheursKpi.nombreParaphRejete, "pi-ban", "bg-red-100", "text-red-500")}
                {insightItem("Parapheur avec Workflow", parapheursKpi.nombreParapheurHasWorkflow, "pi-envelope", "bg-orange-100", "text-orange-500")}
                {insightItem("Parapheur sans Workflow", parapheursKpi.nombreParapheurSansWorkflow, "pi-video", "bg-purple-100", "text-purple-500")}
                {insightItem("Initiateurs", parapheursKpi.nombreInitiateurDistinct, "pi-user", "bg-pink-100", "text-pink-500")}
            </div>
        )}
    </div>
  )
}

export default ParapheurKPIGeneral
