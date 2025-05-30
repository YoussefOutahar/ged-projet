import * as Yup from 'yup';
  

const stepPresetDtoSchema = Yup.object().shape({
    
    title: Yup.string().required('step title is required').max(100,'max 100 letters'),
    level: Yup.number().min(1, 'Level must be at least 1').required('Level is required').max(1000,'level must be <1000'),

});

export { stepPresetDtoSchema };
