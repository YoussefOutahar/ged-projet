import { t } from 'i18next';
import { TextCursorInput } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import React from 'react';

type Props = {};

const DraggableInputText = ({ }: Props) => {
    const [fieldLabed, setFieldLabel] = React.useState<string>('');
    const [draggAttempt, setDragAttempt] = React.useState<boolean>(false);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (!fieldLabed) {
            event.preventDefault();
            setDragAttempt(true);
            return;
        }
        setDragAttempt(false);
        const dragImage = document.createElement('div');
        dragImage.style.width = `${fieldLabed.length * 10}px`;
        dragImage.style.height = '20px';
        dragImage.style.backgroundColor = 'var(--primary-color)';
        dragImage.style.color = 'white';
        dragImage.style.display = 'flex';
        dragImage.style.justifyContent = 'center';
        dragImage.style.alignItems = 'start';
        dragImage.textContent = fieldLabed;
        document.body.appendChild(dragImage);

        // Set the custom drag image
        event.dataTransfer.setDragImage(dragImage, 0, 20);
        event.dataTransfer.setData('widget', 'inputText');
        event.dataTransfer.setData('fieldName', fieldLabed);
        setFieldLabel('');
        // Clean up the drag image
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    return (
        <div
            className='flex flex-column gap-2 p-3 cursor-move overflow-auto'
            draggable
            onDragStart={handleDragStart}
        >
            <div className='flex flex-row gap-1 align-items-center'>
                <TextCursorInput />
                <span className='font-bold'>{t("templates.templatesBuilder.draggableInputText.text_field_label")}</span>
            </div>
            <div className='flex flex-row gap-1 align-items-center'>
                <span>{t("templates.templatesBuilder.draggableInputText.field_name_label")}</span>
                <InputText
                    value={fieldLabed}
                    onChange={(e) => setFieldLabel(e.target.value)}
                    className="p-inputtext-sm border-1 border-400 border-round"
                    placeholder={t("templates.templatesBuilder.draggableInputText.field_name_placeholder")}
                />
            </div>
            {draggAttempt && !fieldLabed && (
                <span className='text-sm text-red-500'>
                    {t("templates.templatesBuilder.draggableInputText.validation.field_name_required")}
                </span>
            )}
        </div>
    );
};

export default DraggableInputText;
