import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre';
import * as Yup from 'yup';

export const etablissementValidationSchema = (etablissements: EtablissementBureauOrdre[])=>{
  etablissements = etablissements || [];    
  return Yup.object().shape({
  nom: Yup.string().required('Required').notOneOf(etablissements?.map(e => e.nom), 'ce nom est déjà utilisé'),
  statut: Yup.string().required('Required'),
  secteur: Yup.string(),
  adresse: Yup.string(),
  ville: Yup.string(),
  pays: Yup.string(),
  telephone: Yup.string().matches(/^(\+)?\d{1,14}$/, 'Invalid phone number'),
  gsm: Yup.string(),
  fax: Yup.string(),
})};

