import { t } from 'i18next';
import { Image } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import React from 'react';

type Props = {};

const DraggableImageField = ({ }: Props) => {
    const [fieldLabed, setFieldLabel] = React.useState<string>('');
    const [draggAttempt, setDragAttempt] = React.useState<boolean>(false);
    const [height, setHeight] = React.useState<string>('50');
    const [width, setWidth] = React.useState<string>('50');

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (!fieldLabed || width.trim().length === 0 || height.trim().length === 0) {
            event.preventDefault();
            setDragAttempt(true);
            return;
        }
        setDragAttempt(false);
        const dragImage = document.createElement('div');
        dragImage.style.width = `${width}px`;
        dragImage.style.height = `${height}px`;
        dragImage.style.backgroundColor = 'blue';
        dragImage.style.display = 'flex';
        dragImage.style.justifyContent = 'center';
        dragImage.style.alignItems = 'start';
        dragImage.textContent = fieldLabed;
        document.body.appendChild(dragImage);

        // Set the custom drag image
        event.dataTransfer.setDragImage(dragImage, 0, Number.parseInt(height));
        event.dataTransfer.setData('widget', 'ImageButton');
        event.dataTransfer.setData('imageFieldName', `image.${fieldLabed}`);
        setFieldLabel('');
        // Clean up the drag image
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    return (
        <div
            className='flex flex-column gap-3 p-3 cursor-move overflow-auto'
            draggable
            onDragStart={handleDragStart}
        >
            <div className='flex flex-row gap-1 align-items-center'>
                <Image />
                <span className='font-bold'>{t("templates.templatesBuilder.draggableImageField.image_field_label")}</span>
            </div>
            <InputText
                value={fieldLabed}
                onChange={(e) => setFieldLabel(e.target.value)}
                className="p-inputtext-sm border-1 border-400 border-round"
                placeholder={t("templates.templatesBuilder.draggableImageField.image_field_placeholder")}
                style={{ width: '100%', height: '2rem' }}
            />
            <div className='flex flex-row gap-1 align-items-center'>
                <span>{t("templates.templatesBuilder.draggableImageField.width_label")}</span>
                <InputText
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="p-inputtext-sm border-1 border-400 border-round"
                    style={{ width: '5rem', height: '2rem' }}
                    keyfilter="int"
                />
                <span>{t("templates.templatesBuilder.draggableImageField.height_label")}</span>
                <InputText
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="p-inputtext-sm border-1 border-400 border-round"
                    style={{ width: '5rem', height: '2rem' }}
                    keyfilter="int"
                />
            </div>
            {draggAttempt && !fieldLabed && (
                <span className='text-sm text-red-500'>{t("templates.templatesBuilder.draggableImageField.validation.field_name_required")}</span>
            )}
            {draggAttempt && width.trim().length === 0 && (
                <span className='text-sm text-red-500'>{t("templates.templatesBuilder.draggableImageField.validation.width_required")}</span>
            )}
            {draggAttempt && height.trim().length === 0 && (
                <span className='text-sm text-red-500'>{t("templates.templatesBuilder.draggableImageField.validation.height_required")}</span>
            )}
        </div>
    );
};

export default DraggableImageField;
