import { PDFButton, PDFDocument, PDFImage } from 'pdf-lib'
import { Button } from 'primereact/button'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type Props = {
    imageButton: PDFButton
    // pdfDoc: PDFDocument
}

const ImageButtonField = forwardRef(({ imageButton }: Props, ref) => {
    const uploadRef = useRef<FileUpload>(null)

    const [uploadedFileName, setUploadedFileName] = useState<string>('Upload Image')

    const handleChanges = (e: FileUploadHandlerEvent) => {
        const file = e.files[0]
        setUploadedFileName(file.name)
        // imageButton.setImage(file.arrayBuffer())

    }

    useImperativeHandle(ref, ()=>({
        onClear :()=>{
            setUploadedFileName('Upload Image')
        }
    }))

    return (
        <div className='col-12 md:col-12 lg:col-12 flex flex-column gap-1  '>
            <span className='font-bold'>{imageButton.getName()}</span>

            <div className='flex flex-row'>
                <FileUpload
                    ref={uploadRef}
                    accept='image/*'
                    mode='basic'
                    chooseLabel={uploadedFileName}
                    chooseOptions={{ icon: 'pi pi-fw pi-image', iconOnly: false, className: 'p-button-rounded p-button-outlined hover:bg-primary' }}
                    auto
                    customUpload
                    uploadHandler={handleChanges}
                    onClear={() => setUploadedFileName('Upload Image')}
                />
                {
                    uploadedFileName != 'Upload Image' &&
                    <Button text rounded icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => uploadRef.current?.clear()} />
                }
            </div>
        </div>
    )
})

export default ImageButtonField