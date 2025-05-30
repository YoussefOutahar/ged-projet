import { t } from 'i18next';
import { LetterText } from 'lucide-react';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import React from 'react';

type Props = {};

const DraggableText = ({ }: Props) => {
    const [fieldLabed, setFieldLabel] = React.useState<string>('');
    const [draggAttempt, setDragAttempt] = React.useState<boolean>(false);
    const [color, setColor] = React.useState({ r: 0, g: 0, b: 0 });
    const [fontSize, setFontSize] = React.useState<number>(20);
    const [angle, setAngle] = React.useState<number>(0);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (!fieldLabed) {
            event.preventDefault();
            setDragAttempt(true);
            return;
        }
        setDragAttempt(false);
        const dragImage = document.createElement('div');
        dragImage.style.width = 'fit-content';
        dragImage.style.height = `${fontSize}px`;
        dragImage.style.backgroundColor = 'var(--primary-color)';
        dragImage.style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        dragImage.style.display = 'flex';
        dragImage.style.fontSize = `${fontSize}px`;
        dragImage.style.justifyContent = 'center';
        dragImage.style.alignItems = 'start';
        dragImage.textContent = fieldLabed;
        document.body.appendChild(dragImage);

        event.dataTransfer.setDragImage(dragImage, 0, fontSize);
        event.dataTransfer.setData('widget', 'Text');
        event.dataTransfer.setData('content', fieldLabed);
        event.dataTransfer.setData('color', JSON.stringify(color));
        event.dataTransfer.setData('fontSize', fontSize.toString());
        event.dataTransfer.setData('angle', angle.toString());
        setFieldLabel('');

        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    return (
        <div
            className="flex flex-column gap-2 p-3 cursor-move overflow-auto"
            draggable
            onDragStart={handleDragStart}
        >
            <div className="flex flex-row gap-1 align-items-center">
                <LetterText />
                <span className="font-bold">{t("templates.templatesBuilder.draggableText.draw_text_label")}</span>
            </div>
            <InputText
                value={fieldLabed}
                onChange={(e) => setFieldLabel(e.target.value)}
                className="p-inputtext-sm border-1 border-400 border-round"
                placeholder=""
                style={{
                    color: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    fontSize: `${fontSize * 0.7}px`,
                }}
            />
            <div className="flex gap-1 align-items-center">
                <span>{t("templates.templatesBuilder.draggableText.text_color_label")}</span>
                <ColorPicker value={color} format="rgb" onChange={(e: any) => setColor(e.value)} />
                <span className="ml-2">{t("templates.templatesBuilder.draggableText.text_size_label")}</span>
                <input
                    type="number"
                    min="1"
                    max="100"
                    style={{ width: '3rem' }}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
                <span className="ml-2">{t("templates.templatesBuilder.draggableText.text_angle_label")}</span>
                <input
                    type="number"
                    min="-360"
                    max="360"
                    style={{ width: '3rem' }}
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                />
            </div>
            {draggAttempt && !fieldLabed && (
                <span className="text-sm text-red-500">
                    {t("templates.templatesBuilder.draggableText.validation.field_name_required")}
                </span>
            )}
        </div>
    );
};

export default DraggableText;
