import axiosInstance from 'app/axiosInterceptor';
import { CourrielBureauOrdre, TypeCourriel } from 'app/controller/model/BureauOrdre/CourrielBureauOrdre';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import jsPDF from 'jspdf';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";
import useConnectedUserStore from 'Stores/Users/ConnectedUserStore';

type CourrielImpressionType = {
    all: boolean;
}
const CourrielImpression = ({ all }: CourrielImpressionType)  => {
    const { t } = useTranslation();
    const courrielTypes = [
        { label: 'Entrant', value: TypeCourriel.ENTRANT },
        { label: 'Sortant', value: TypeCourriel.SORTANT }
    ]
    const [type, setType] = useState(null);
    const [uploadDateFrom, setUploadDateFrom] = useState<Date | null>(null);
    const [uploadDateTo, setUploadDateTo] = useState<Date | null>(null);
    const [uploadDate, setUploadDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { connectedUser: currentUser } = useConnectedUserStore();

    const convertDate = (date: Date | null) => {
        return date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) : null;
    }
    const getData = () => {
        setLoading(true);
        axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/courriels/filter`, 
            { params: { 
                type: type, 
                all: all,
                dateDebut: convertDate(uploadDateFrom),
                dateFin: convertDate(uploadDateTo),
                today: convertDate(uploadDate) }
            })
        .then((res) => {
            generatePdf(res.data, currentUser!);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }
    const generatePdf = (data:any[], currentUser:UtilisateurDto) => {
        const doc = new jsPDF();

        const img = new Image();
        img.src = '/Images/logo-yandoc.png';
        img.onload = () => {
            doc.addImage(img, 'PNG', 15, 10, 30, 18);

            const margin = 20;
            const initialY = 40;
            doc.setFontSize(18);
            doc.text(`Liste des courriels de Bureau d'Ordre`, 115, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.text(`Demandé Par: ${currentUser.nom} ${currentUser.prenom}`, margin, initialY);
            doc.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, margin, initialY + 8);
            doc.text(`Département: ${currentUser.entiteAdministrative.libelle}`, margin, initialY + 16);
            
            doc.setFontSize(16);
            doc.text(`Resultat de Recherche:`, margin, initialY + 27);
            
            doc.setFontSize(12);
            doc.text(`Total: ${data.length}`, margin, initialY + 35);
            if (type) {
                doc.text(`Type de courriel: ${TypeCourriel[type]}`, margin, initialY + 40);
            }
            if (uploadDate) {
                doc.text(`Jour: ${format(uploadDate, "dd/MM/yyyy")}`, margin, initialY + 45);
            }
            if (uploadDateFrom) {
                doc.text(`Date Début: ${format(uploadDateFrom, "dd/MM/yyyy")}`, margin, initialY + 50);
            }
            if (uploadDateTo) {
                doc.text(`Date Fin: ${format(uploadDateTo, "dd/MM/yyyy")}`, margin, initialY + 55);
            }

            const tableData = data.map(item => [
                item.sujet,
                item.dateReception ? format(new Date(item.dateReception[0], item.dateReception[1] - 1, item.dateReception[2]), "dd/MM/yyyy"): 'N/A',
                item.dateEcheance ? format(new Date(item.dateEcheance[0], item.dateEcheance[1] - 1, item.dateEcheance[2]), "dd/MM/yyyy") : 'N/A',
                item.etatAvancement,
                item.numeroCourriel,
                item.numeroRegistre,
                item.voieEnvoi
            ]);
            doc.autoTable({
                head: [['Sujet', 'Date de Réception', 'Échéance', 'État d\'Avancement', 'N° Courriel', 'N° Registre', 'Type d\'Envoi']],
                body: tableData,
                startY: initialY + 65,
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [52, 73, 94] },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                didDrawPage: (data: any) => {
                    // Ajouter le pied de page
                    const pageCount = doc.getNumberOfPages();
                    doc.setFontSize(10);
                    const pageSize = doc.internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.text(`Page ${data.pageNumber} de ${pageCount}`, pageSize.width / 2, pageHeight - 10, { align: 'center' });
                }
            });
            doc.save('courriels_filtrés.pdf');
        };
    };
    const handleCancelCrtClick = () => {
        setType(null);
        setUploadDateFrom(null);
        setUploadDateTo(null);
        setUploadDate(null);
        setLoading(false);
    }
  return (
        <Card className="mb-5">
            <div className="grid">
                <div className="flex flex-column col-6">
                    <label className="mb-1" htmlFor="6">{t("document.documentTypePlaceHolder")}</label>
                    <Dropdown id="6" value={type} options={courrielTypes} onChange={(e) => setType(e.target.value)} optionLabel="label" filter showClear />
                </div>
                <div className="flex flex-column col-6">
                    <label className="mb-1" htmlFor="2">{t("document.uploadDate")}</label>
                    <Calendar
                        value={uploadDate}
                        onChange={(e) => {
                            if (e.value instanceof Date) {
                                setUploadDate(e.value);
                            }
                        }}
                        dateFormat="dd/mm/yy"
                        showIcon={true}
                        showButtonBar
                    />
                </div>
                <div className="flex flex-column col-6">
                    <label className="mb-1" htmlFor="2">Min {t("document.uploadDate")}</label>
                    <Calendar
                        value={uploadDateFrom}
                        onChange={(e) => {
                            if (e.value instanceof Date) {
                                setUploadDateFrom(e.value);}
                        }}
                        dateFormat="dd/mm/yy"
                        showIcon={true}
                        showButtonBar
                    />
                </div>
                <div className="flex flex-column col-6">
                    <label className="mb-1" htmlFor="2">Max {t("document.uploadDate")}</label>
                    <Calendar
                        value={uploadDateTo}
                        onChange={(e) => {
                            if (e.value instanceof Date) {
                                setUploadDateTo(e.value);
                            }
                        }}
                        dateFormat="dd/mm/yy"
                        showIcon={true}
                        showButtonBar
                    />
                </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }} >
                <Button raised label={t("validate")} icon="pi pi-sort-amount-down" className="p-button-info mr-2" onClick={getData} loading={loading} disabled={!type} />
                <Button raised label={t("cancel")} className="p-button-secondary mr-2" icon="pi pi-times" onClick={handleCancelCrtClick} />
            </div>
        </Card>
  )
}

export default CourrielImpression