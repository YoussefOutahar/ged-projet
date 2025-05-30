import axiosInstance from "app/axiosInterceptor";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { ScrollPanel } from 'primereact/scrollpanel';
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const LicenceCard = () => {
    const [licences, setLicences] = useState([]);
    const [isCurrentLicenceValid, setIsCurrentLicenceValid] = useState(false);

    const fetchLicences = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/licences`);
            setLicences(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateCurrentLicence = async (): Promise<boolean> => {
        try {
            const response = await axiosInstance.post(`${API_URL}/licences/validateCurrentLicence`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    useEffect(() => {
        fetchLicences();
        validateCurrentLicence().then((isValid) => {
            setIsCurrentLicenceValid(isValid);
        });
    }, []);

    return (
        <div style={{ display: 'flex', gap: '100px', margin: '20px' }}>
            <div>
                {isCurrentLicenceValid ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginLeft: '100px', }}>
                        <img src={`/icons/validation.png`} alt="Brightness Icon" style={{ width: '150px', height: '150px' }} />
                        <h2>Licence Valide</h2>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <img src={`/icons/cross.png`} alt="Brightness Icon" style={{ marginRight: '20px', width: '100px', height: '100px' }} />
                        <h2>Licence Terminer</h2>
                        <div>Votre licence a expiré, veuillez contacter l'administrateur</div>
                    </div>
                )}
            </div>
            <Divider layout="vertical" />
            <ul>
                <ScrollPanel>
                    {licences.map((licence: any) => {
                        const dateArgs = licence.createdOn as [number, number, number, number, number, number];
                        dateArgs[1] -= 1;
                        const licenceDate = new Date(...dateArgs);
                        const currentDate = new Date();
                        const isDue = licenceDate < currentDate;

                        return (
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px' }}>
                                        <div className="card-date">
                                            {licence.licenceKey}
                                        </div>
                                        <div className="card-icon">
                                            {isDue ? <img src={`/icons/validation.png`} alt="Brightness Icon" style={{ width: '24px', height: '24px' }} /> :
                                                <img src={`/icons/cross.png`} alt="Brightness Icon" style={{ width: '24px', height: '24px' }} />}
                                        </div>
                                    </div>
                                }
                                subTitle={
                                    <div style={{margin: '12px'}}>
                                        {licenceDate.toLocaleDateString("fr-FR", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </div>
                                }
                            >
                                
                            </Card>
                        );
                    })}
                </ScrollPanel>
            </ul>
        </div>
    );
};

export default LicenceCard;