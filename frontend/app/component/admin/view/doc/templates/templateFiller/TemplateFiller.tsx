import { PDFDocument } from 'pdf-lib'
import { useEffect, useState } from 'react'
import AnnotationsFormOrganizer from './fieldsTemplates/AnnotationsFormOrganizer'
import TemplatesViewer from '../TemplatesViewer/TemplatesViewer'

type Props = {
    file: File | null
    setFile: (file: File) => void
}

const TemplateFiller = ({ file, setFile }: Props) => {
    const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)   

    const loadFileAsPdfDoc = async (file: File) => {
        file.arrayBuffer().then((buffer) => {PDFDocument.load(buffer).then((pdfDoc) => {setPdfDoc(pdfDoc)})})
    }
    useEffect(() => {
        if (file) {
            loadFileAsPdfDoc(file)
        }
    }, [file])

    const handleSave = async () => {
        await pdfDoc?.save().then((blob) => {
            const newFile = new File([blob], file?.name || "file", { type: 'application/pdf' })
            setFile(newFile)
        })

    }
     
    return (
        <div className='flex flex-row gap-5'>
            {
                pdfDoc && pdfDoc.getForm() && <AnnotationsFormOrganizer onSubmit={handleSave} pdfForm={pdfDoc?.getForm()} />
            }
            <div className='flex flex-row gap-5 ' style={{ width: "100%" }}>
                <div className='w-full shadow-2 bg-white'>
                    <TemplatesViewer
                        file={file}
                        enableForms
                    />
                </div>
            </div>
        </div>
    )
}
export default TemplateFiller