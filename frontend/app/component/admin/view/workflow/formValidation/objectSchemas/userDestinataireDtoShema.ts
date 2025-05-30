import * as Yup from 'yup';

const userDestinataireDtoSchema = Yup.object().shape({
  id: Yup.number().positive('ID must be a positive number'),
  poids: Yup.number().integer('Poids must be an integer').max(1000),
  stepId: Yup.number().positive('Step ID must be a positive number'),
});

export { userDestinataireDtoSchema };
