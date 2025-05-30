import { degrees, PDFDocument, rgb } from 'pdf-lib'
import { useEffect, useRef, useState } from 'react'
import DraggableInputText from './draggableFormFields/DraggableInputText'
import DraggableCheckBoxes from './draggableFormFields/DraggableCheckBoxes'
import DraggableText from './draggableFormFields/DraggableText'
import DraggableImageField from './draggableFormFields/DraggableImageField'
import TemplatesViewer from '../TemplatesViewer/TemplatesViewer'
import { t } from 'i18next';

type Props = {
    file: File | null
    setFile: (file: File) => void
}


const TemplateBuilder = ({ file, setFile }: Props) => {


    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pdfViewerRef = useRef<any>(null)

    const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)

    const loadPdfFromFile = async (file: File) => {
        const pdfDoc = await PDFDocument.load(await file.arrayBuffer())
        setPdfDoc(pdfDoc)
    }
    useEffect(() => {
        if (file) {
            loadPdfFromFile(file)
        }
    }, [file])

    const supportedFields = ['Text', 'InputText', 'Checkbox','Image',  'RadioGroup', 'Dropdown', 'Signature']

    const addTextFieldToFile = (fieldName: string, xpos: number, ypos: number, currentPage: number) => {

        if (pdfDoc) {
            const page = pdfDoc.getPage(currentPage)
            const form = pdfDoc.getForm()


            const textField = form.createTextField(fieldName)
            // textField.enableReadOnly()
            // textField.enableRequired()
            // textField.setText("Enter your text here")
            textField.addToPage(page, { x: xpos, y: ypos, width: 100, height: 20 })
            pdfDoc.save().then((blob) => {
                const newFile = new File([blob], file?.name || "file", { type: 'application/pdf' })
                setFile(newFile)
            })
        }
    }

    const addCheckBoxesToFile = (checkBoxes: string , checkBoxGroup: string, x: number, y: number, currentPage: number) => {
        
        if (pdfDoc) {
            const page = pdfDoc.getPage(currentPage)
            const form = pdfDoc.getForm()
            const checkBoxesArray = checkBoxes.split(',')
            page.drawText(checkBoxGroup, {x, y: y + (checkBoxesArray.length * 20) + 10, size: 15} )
            checkBoxesArray.forEach((checkBox, index) => {
                const newCheckBox = form.createCheckBox(`${checkBoxGroup}.${checkBox}`)
                newCheckBox.addToPage(page, { x, y: y + (index * 20), width: 15, height: 15 })
                page.drawText(checkBox, {x: x+30 , y: y + (index * 20) + 5 , size: 15})
            })
            pdfDoc.save().then((blob) => {
                const newFile = new File([blob], file?.name || "file", { type: 'application/pdf' })
                setFile(newFile)
            })
        }

            
    }

    const drawTextInFile = (text: string, x: number, y: number, color : string, size: number, angle:number, currentPage: number) => {
        if (pdfDoc) {

            const page = pdfDoc.getPage(currentPage)
            const colors : {r:number, g:number, b:number} = JSON.parse(color)
            console.log('color', colors)
            page.drawText(text, {x, y, color: rgb(colors.r /255, colors.g/255, colors.b/255), rotate: degrees(angle) , size})
            pdfDoc.save().then((blob) => {
                const newFile = new File([blob], file?.name || "file", { type: 'application/pdf' })
                setFile(newFile)
            })
        }
    }

    const addImageButtonToFile = (x: number, y: number, currentPage: number, height: number, width: number, imageLabel: string) => {

        if (pdfDoc) {
            const page = pdfDoc.getPage(currentPage)
            const form = pdfDoc.getForm()
            const ImageButton = form.createButton(imageLabel)
            ImageButton.addToPage('', page, {
                x: x,
                y: y,
                width: width,
                height: height,
                borderWidth: 1,
              })
            pdfDoc.save().then((blob) => {
                const newFile = new File([blob], file?.name || "file", { type: 'application/pdf' })
                setFile(newFile)
            })
        }
    }


    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.getData('widget')) {
            const rect = canvasRef.current?.getBoundingClientRect()
            const x = event.clientX - rect!.left
            const y = rect!.bottom - event.clientY
            const pageHeight = event.currentTarget.clientHeight
            const pageWidth = event.currentTarget.clientWidth
            if (!x || !y || x < 0 || y < 0 || y > pageHeight || x > pageWidth) return

            const currentPage = pdfViewerRef.current.getCurrentState().pageNumber - 1
            const widget = event.dataTransfer.getData('widget')
            if (widget === 'inputText') {
                const fieldName = event.dataTransfer.getData('fieldName') || 'Text Field'
                addTextFieldToFile(fieldName, x, y, currentPage)
            }else if(widget === 'CheckBox') {
                const checkBoxes = event.dataTransfer.getData('checkBoxes') 
                const checkBoxGroup = event.dataTransfer.getData('checkBoxGroup') 
                addCheckBoxesToFile(checkBoxes, checkBoxGroup, x, y, currentPage)
            }else if(widget === 'Text') {
                const text = event.dataTransfer.getData('content') || 'Text'
                const color = event.dataTransfer.getData('color') || JSON.stringify({r: 0, g: 0, b: 0})
                const size = event.dataTransfer.getData('fontSize') 
                const angle = event.dataTransfer.getData('angle') || '0'
                drawTextInFile(text, x, y, color, parseInt(size), Number.parseInt(angle), currentPage)
            }else if (widget === 'ImageButton') {
                const imageLabel = event.dataTransfer.getData('imageFieldName') 
                addImageButtonToFile(x, y, currentPage, 50, 50, imageLabel)
            }


            console.log(`Dropped ${widget} at X: ${x}, Y: ${y} on page ${currentPage} data ${event.dataTransfer.getData('fieldddName')}  height diff ${pageHeight - y}`)
        }
    }

    const fieldTemplate = (field: string) => {
        switch (field) {
            case 'Text':
                return (
                    <DraggableText />
                )
            case 'InputText':
                return (
                    <DraggableInputText />
                )
            case 'Checkbox':
                return <DraggableCheckBoxes />
            case 'Image':
                return <DraggableImageField />
            // case 'RadioGroup':
            //     return <ArrowBigRight />
            // case 'Dropdown':
            //     return <TextCursorInput />
            // case 'Signature':
            //     return <Signature />
            default:
                return <></>
        }
    }

    return (
        <div className='flex flex-row gap-5 fadein animation-duration-500' style={{ width: "100%" }}>
            <div className='shadow-2 bg-white flex flex-column border-round' style={{ minHeight: "100%", minWidth: "25%" }}>
                <div className='flex flex-row justify-content-between align-items-center  p-4 border-bottom-1 surface-border'>
                    <span className='font-bold  ' >{t("templates.templatesBuilder.addField")} </span>
                    {/* <Button label='' icon="pi pi-pencil text-2xl text-900" text raised rounded /> */}
                </div>
                <div className='p-3'>
                    {
                        supportedFields.map(field => {
                            return (
                                <div className='w-full  border-dashed border-400 border-round mb-2'>
                                    {fieldTemplate(field)}
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className='w-full shadow-2'
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={e => handleOnDrop(e)}
            >
                <TemplatesViewer
                    ref={pdfViewerRef}
                    pageRef={canvasRef}
                    file={file}
                    templateBuilder
                    enableForms
                />
            </div>


        </div>
    )
}

export default TemplateBuilder