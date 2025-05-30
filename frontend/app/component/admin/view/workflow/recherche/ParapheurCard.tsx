import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Divider } from 'primereact/divider';
import { ParapheurDto } from 'app/controller/model/parapheur/parapheurDto.model';
import ParapheurViewer from 'app/component/admin/view/doc/document/preview/ParapheurViewer';
import ParapheurComments from 'app/component/admin/view/doc/parapheur/ParapheurComments';
import PreviewParapheurFilesButton from 'app/component/admin/view/doc/parapheur/PreviewParapheurlFilesButton';
import { parapheurService } from 'app/controller/service/parapheur/parapheurService.service';

interface ParapheurCardProps {
    parapheur: ParapheurDto;
}

const ParapheurCard: React.FC<ParapheurCardProps> = ({ parapheur }) => {
    const [showDocuments, setShowDocuments] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);

    const getStatusTag = (status: string) => {
        switch (status.toLowerCase()) {
            case 'en_attente':
                return <Tag value="En Attente" severity="info" />;
            case 'en_cours':
                return <Tag value="En Cours" severity="warning" />;
            case 'rejete':
                return <Tag value="Rejeté" severity="danger" />;
            case 'termine':
                return <Tag value="Terminé" severity="success" />;
            default:
                return <Tag value="Inconnu" severity="info" />;
        }
    };

    const handleViewDocuments = async () => {
        setShowDocuments(true);
        setLoadingDocuments(true);
        try {
            const res = await parapheurService.fetchDocumentsForParapheur(parapheur.id.toString());
            setDocuments(res.data);
        } catch (error) {
            console.error('Error loading documents', error);
        } finally {
            setLoadingDocuments(false);
        }
    };

    const renderHeader = () => (
        <div className="bg-primary p-3" style={{ borderRadius: '6px 6px 0 0' }}>
            <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <i className="pi pi-file-o text-3xl mr-3 text-white"></i>
                    <div>
                        <h2 className="text-2xl font-bold m-0 text-white">{parapheur.title || 'Sans titre'}</h2>
                    </div>
                </div>
                <div>
                    {getStatusTag(parapheur.parapheurEtat)}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Card className="mb-4 shadow-2" header={renderHeader}>
                <div className="flex flex-column">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <p className="m-0"><strong>Responsable:</strong> {parapheur.utilisateur?.nom || 'Non assigné'}</p>
                            <p className="m-0"><strong>Créé le:</strong> {parapheur.createdOn || 'Non spécifié'}</p>
                            <p className="m-0"><strong>Créé par:</strong> {parapheur.createdBy || 'Non spécifié'}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <p className="m-0"><strong>Dernière mise à jour:</strong> {parapheur.updatedOn || 'Non spécifié'}</p>
                            <p className="m-0"><strong>Mis à jour par:</strong> {parapheur.updatedBy || 'Non spécifié'}</p>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <p className="font-bold mb-2">Utilisateurs associés:</p>
                        {parapheur.utilisateurDtos && parapheur.utilisateurDtos.length > 0 ? (
                            <AvatarGroup>
                                {parapheur.utilisateurDtos.map((user, index) => (
                                    <Avatar 
                                        key={index}
                                        label={user.nom?.charAt(0) || '?'}
                                        shape="circle"
                                        size="large"
                                        style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
                                    />
                                ))}
                            </AvatarGroup>
                        ) : (
                            <p className="text-500 m-0">Aucun utilisateur associé</p>
                        )}
                    </div>
                    <div className="flex justify-content-end gap-2 mt-4">
                        <ParapheurViewer parapheur={parapheur} />
                        <Button
                            rounded
                            icon="pi pi-eye"
                            onClick={handleViewDocuments}
                        />
                        <ParapheurComments parapheur={parapheur} />
                    </div>
                </div>
            </Card>

            <Dialog
                header="Documents du Parapheur"
                visible={showDocuments}
                style={{ width: '70vw' }}
                onHide={() => setShowDocuments(false)}
                maximizable
            >
                {loadingDocuments ? (
                    <div className="flex justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>
                ) : (
                    <PreviewParapheurFilesButton 
                        documents={documents} 
                        loading={loadingDocuments} 
                        parapheurId={parapheur.id} 
                    />
                )}
            </Dialog>
        </>
    );
};

export default ParapheurCard;