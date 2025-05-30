import axiosInstance from "app/axiosInterceptor";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const LicenceList = () => {

    const [visible, setVisible] = useState(false);
    const [licences, setLicences] = useState([]);

    const fetchLicences = async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/licences`);
            setLicences(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLicences();
    }, []);


    return (
        <>
            <Button
                raised 
                icon='pi pi-align-justify'
                className="m-2"
                onClick={() => {
                    setVisible(true);
                }}
            />
            <Dialog
                header="Licence History"
                visible={visible}
                style={{ width: "50vw" }}
                modal
                onHide={() => {
                    setVisible(false);
                }}
            >
                <div>
                    {licences.length === 0 && <div>No licences found</div>}

                    {licences.map((licence: any) => (
                        <div key={licence.id}>
                            <div>{licence.licenceKey}</div>
                            <div>{licence.createdAt}</div>
                        </div>
                    ))}
                </div>
            </Dialog>
        </>
    );
};

export default LicenceList;