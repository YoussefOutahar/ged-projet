import { useRouter } from "next/router";
import LicenceList from "./licence-list";
import AddLicenceDialogue from "./add-licence";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

type LicencePageProps = {
    toast: React.LegacyRef<Toast>;
};

const LicencePage = (
    props: LicencePageProps
) => {
    const router = useRouter();

    const backToAuth = () => {
        router.replace('/auth');
    }

    const backHome = () => {
        router.replace('/');
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: "56px",
                        padding: "0.3rem",
                        background:
                            "linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)",
                    }}
                >
                    <div
                        className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                        style={{ borderRadius: "53px" }}
                    >
                        <h1 className="text-900 font-bold text-5xl mb-2">Licence Terminer</h1>
                        <div className="text-600 mb-5">
                            Votre licence a expiré, veuillez contacter l'administrateur
                        </div>
                        <div>
                            {/* <LicenceList /> */}
                            <Button
                                raised
                                icon='pi pi-home'
                                className="m-2"
                                onClick={() => {
                                    backHome();
                                }}
                            />
                            <Button
                                raised
                                icon='pi pi-lock'
                                className="m-2"
                                severity="warning"
                                onClick={() => {
                                    backToAuth();
                                }}
                            />
                            <AddLicenceDialogue toast={props.toast} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicencePage;