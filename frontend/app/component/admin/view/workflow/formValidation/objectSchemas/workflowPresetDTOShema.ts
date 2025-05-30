import * as Yup from 'yup';
import { stepPresetDtoSchema } from 'app/component/admin/view/workflow/formValidation/objectSchemas/stepPresetDtoShema';

const workflowPresetDtoSchema = Yup.object().shape({
    
    id: Yup.number().required('ID is required'),
    title: Yup.string().required('Titre du Workflow Preset est important').max(100,'max 100 letters'),
    description: Yup.string().required('Description du Workflow Preset est important').max(1000,'max 1000 letters'),
    stepPresets: Yup.array().of(stepPresetDtoSchema).min(1, 'At least one step is required'),

    createurId: Yup.number().required('Creator ID is required'),
});

export { workflowPresetDtoSchema };
