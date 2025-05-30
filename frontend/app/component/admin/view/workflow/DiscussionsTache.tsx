import React, { useEffect, useState } from 'react';
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

type Props = {
    step: StepDTO;
};

interface FormValues {
    nouveauMessage: string;
}


const DiscussionsTache = ({ step }: Props) => {
    const [visibleWFDes, setVisibleWFDes] = React.useState(false);

    const openWFDescriptionDialog = () => setVisibleWFDes(true);
    const hideWFDescriptionDialog = () => setVisibleWFDes(false);
    const [connectedUser, setConnectedUser] = useState<UtilisateurDto>(new UtilisateurDto());
    const authService = new AuthService();
    const utilisateurService = new UtilisateurAdminService();
    
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
                 
                  <Button label="Message" severity="info" text raised onClick={openWFDescriptionDialog} className='h-1' 
                  icon  />
                            

            <Dialog
                header="Discussion"
                visible={visibleWFDes}
                style={{ width: '30vw' }}
                onHide={hideWFDescriptionDialog}
            >
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(formik) => (
                           <Form style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <ErrorMessage name="rejectReason" component="small" className="p-error" />
                            <br></br>
                            <Field name="rejectReason" as={InputText}  style={{ width: 'calc(100% - 120px)', padding: '10px' }}
                              placeholder="Écrire un message..." />
                           <Button
                               type="submit"
                               label="Envoyer"
                               style={{ width: '110px' }}
                               className="p-button-success"
                           /> 
                                       
                       </Form>
                    )}
                </Formik>
              
            </Dialog>
        </div>
    );
};

export default DiscussionsTache;
