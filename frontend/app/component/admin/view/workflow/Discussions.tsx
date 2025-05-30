import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { StepDTO } from 'app/controller/model/workflow/stepDTO';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { InputTextarea } from 'primereact/inputtextarea';
import { CommentaireDTO } from 'app/controller/model/workflow/commentaireDTO';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { AuthService } from 'app/zynerator/security/Auth.service';
import { UtilisateurAdminService } from 'app/controller/service/admin/UtilisateurAdminService.service';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { stepService } from 'app/controller/service/workflow/stepService';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';

type Props = {
    step: StepDTO;
};

interface FormValues {
    nouveauMessage: string;
}


const Discussions = ({ step }: Props) => {
    const [visibleWFDes, setVisibleWFDes] = React.useState(false);

    const openWFDescriptionDialog = () => setVisibleWFDes(true);
    const hideWFDescriptionDialog = () => setVisibleWFDes(false);
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const authService = new AuthService();
    const utilisateurService = new UtilisateurAdminService();
    const op = useRef(null);

    
    const[commentaire , setCommentaire] = useState<CommentaireDTO>({
        id:0,
        stepId:step.id,
        utilisateur:connectedUser,
      })

   

      useEffect(() => {
        const connectedUserName = authService.getUsername();
        if (connectedUserName) {
          const utilisateurCriteria = new UtilisateurCriteria();
          utilisateurCriteria.username = connectedUserName;
          utilisateurService.findPaginatedByCriteria(utilisateurCriteria).then(({ data }) => {
            const user = data?.list[0];
            if (user) {
              setConnectedUser(user);
            }
          });
        }
      }, []);

       
      const validationSchema = Yup.object().shape({
        rejectReason: Yup.string().trim().required("Le message ne peut pas être vide.").min(1, "Le message ne peut pas être vide."),
    });
      const initialValues = {
      rejectReason: ''
      };


      const onSubmit = (values: typeof initialValues, { resetForm }: FormikHelpers<typeof initialValues>) => {
        if (values.rejectReason.trim().length > 0) { // Vérifie si le message n'est pas vide
            commentaire.message = values.rejectReason.trim();
            commentaire.utilisateur = connectedUser;
            stepService.addCommentaireToStep(step.id, commentaire).then(() => {
                // Traitement après l'envoi du message, si nécessaire
            });
    
            resetForm();
        } else {
            // Afficher un message d'erreur ou une notification pour informer l'utilisateur que le message est vide
            console.log("Le message ne peut pas être vide.");
        }
    };
    return (
        <div>
            <button type="button" className="p-link layout-topbar-button"  onClick={(e :any) => (op.current as any)?.toggle(e)}  style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '2rem', zIndex: '1' }}>
                <i className="pi pi-comment  p-overlay-badge text-4xl"><Badge severity="danger"></Badge></i>
            </button>

            <OverlayPanel ref={op} className='py-0'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {step.discussions?.map((message, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <div style={{ backgroundColor: '#ECECEC', padding: '8px', borderRadius: '10px' }}>
                                <p style={{ margin: '0' }}>{message.message}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#757575' }}>
                                    {`${message.utilisateur?.nom} ${message.utilisateur?.prenom}`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
           
            </OverlayPanel>
             
         
        </div>
    );
};

export default Discussions;
