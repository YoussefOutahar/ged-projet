import { t } from 'i18next'
import { CopyCheck, Square } from 'lucide-react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React from 'react'

type Props = {}

const DraggableCheckBoxes = ({}: Props) => {

    // const [fieldLabed, setFieldLabel] = React.useState<string>('')
    const [checkBoxes, setCheckBoxes] = React.useState<string[]>([""])
    const [checkBoxGroup, setCheckBoxGroup] = React.useState<string>('')
    const [draggAttempt, setDragAttempt] = React.useState<boolean>(false)

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {

        if(checkBoxGroup.trim().length == 0 || checkBoxes.some(checkBox => checkBox.trim().length == 0)) {
            event.preventDefault();
            setDragAttempt(true)
            return
        }

        checkBoxes.forEach(checkBox => {
            if (checkBox.trim().length == 0) {
                setDragAttempt(true)
                event.preventDefault();
                return
            }
        })

        
       
        setDragAttempt(false)
        const dragImage = document.createElement('div');
        dragImage.style.width = `100px`;
        dragImage.style.height =  `${checkBoxes.length * 20}px`; 
        dragImage.style.backgroundColor = 'var(--primary-color)';
        dragImage.style.color = 'white';
        dragImage.style.display = 'flex';
        dragImage.style.justifyContent = 'center';
        dragImage.style.alignItems = 'start';
        // dragImage.textContent = fieldLabed;
        document.body.appendChild(dragImage);

        // Set the custom drag image
        event.dataTransfer.setDragImage(dragImage, 0, checkBoxes.length * 20);
        event.dataTransfer.setData('widget', 'CheckBox');
        event.dataTransfer.setData('checkBoxGroup', checkBoxGroup);
        event.dataTransfer.setData('checkBoxes', checkBoxes.join(','));
        setCheckBoxes([""])
        setCheckBoxGroup('')
        // Clean up the drag image
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    return (
        <div
            className='flex flex-column  p-3 cursor-move overflow-auto '
            draggable
            onDragStart={handleDragStart}
        >
            <div className='flex flex-row gap-1 align-items-center mb-2'>
                <CopyCheck />
                <span className='font-bold'>{t("templates.templatesBuilder.draggableCheckbox.checkbox_group_label")}</span>
                </div>
            <div className='flex flex-row gap-1 align-items-center my-2'>
            <span>{t("templates.templatesBuilder.draggableCheckbox.group_name_label")}</span>
            {draggAttempt && checkBoxGroup.trim().length == 0 && <span className='text-xl text-red-500'>* </span>}
                <InputText
                    value={checkBoxGroup}
                    onChange={(e) => setCheckBoxGroup(e.target.value)}
                    className="p-inputtext-sm py-1  border-1 border-400 border-round"
                    placeholder={t("templates.templatesBuilder.draggableCheckbox.group_name_placeholder")}
                    />
            </div>

            {
                checkBoxes.map((checkBox, index) => (
                    <div className=''>
                    <div className='mx-auto flex flex-row gap-2 align-items-center'>
                        <Square />
                        <InputText
                            value={checkBox}
                            onChange={(e) => setCheckBoxes([...checkBoxes.slice(0, index), e.target.value, ...checkBoxes.slice(index + 1)])}
                            className="p-inputtext-sm py-1"
                            placeholder={t("templates.templatesBuilder.draggableCheckbox.checkbox_placeholder")}
                            />
                        <Button icon="pi pi-trash text-red-600" className='p-button-rounded p-button-text p-button-sm' onClick={() => setCheckBoxes([...checkBoxes.slice(0, index), ...checkBoxes.slice(index + 1)])} />
                        </div>
                        {draggAttempt && checkBox.trim().length === 0 && (
                            <span className='text-sm text-red-500'>
                                {t("templates.templatesBuilder.draggableCheckbox.validation.checkbox_required")}
                            </span>
                        )}
                    </div>

                ))
            }
            <Button
                label={t("templates.templatesBuilder.draggableCheckbox.add_checkbox_button")}
                icon="pi pi-plus"
                className='w-fit mx-auto'
                rounded
                text
                size='small'
                onClick={() => setCheckBoxes([...checkBoxes, ""])}
            />
        </div>)
}

export default DraggableCheckBoxes