import TextFieldTemplate from './TextFieldTemplate'
import { PDFButton, PDFCheckBox, PDFForm, PDFSignature, PDFTextField } from 'pdf-lib'
import { Button } from 'primereact/button'
import { useRef, useState } from 'react'
import ImageButtonField from './ImageButtonField'
import OneCheckBoxeTemplate from './OneCheckBoxeTemplate'
import { t } from 'i18next'

type Props = {
    pdfForm: PDFForm
    onSubmit: () => void
}

const AnnotationsFormOrganizer = ({ pdfForm, onSubmit }: Props) => {

    const fieldsRefs = pdfForm.getFields()
        .map(() => useRef<any>(null));

    const clearForm = () => {
        fieldsRefs.forEach(ref => {
            if (ref.current && ref.current.onClear) {
                ref.current.onClear()
            }
        })
    }

    return (
        <div className='scalein animation-duration-500 card p-0 shadow-3 flex flex-column w-3 ' style={{ maxHeight: "100vh" }}>
            <div className=' flex p-4 border-bottom-1 surface-border'>
                <span className='text-4xl mb-2'>Formulaire</span>
                <Button icon="pi pi-sync text-2xl" rounded text className='ml-auto' onClick={clearForm} tooltip='Vider le formulaire' />
            </div>

            <div className='flex flex-column overflow-y-auto p-3' style={{ maxHeight: "100vh" }} >
                <div className=''>
                    {pdfForm.getFields().map((field, index) => {
                        if (field instanceof PDFTextField) {
                            return (
                                <TextFieldTemplate ref={fieldsRefs[index]} key={field.ref.objectNumber} field={field} />
                            )
                        } else if (field instanceof PDFButton && field.getName().toLowerCase().includes('image')) {
                            return <ImageButtonField ref={fieldsRefs[index]} key={field.ref.objectNumber} imageButton={field} />
                        } else if (field instanceof PDFCheckBox) {
                            return <OneCheckBoxeTemplate ref={fieldsRefs[index]} checkBoxeField={field} />
                        } else if (field instanceof PDFSignature) {
                            // return <SignatureFieldTemplate field={field} />
                        }
                        return null
                    })}
                </div>
            </div>
            <div className='mt-1'>

            <Button label={t('save')} className='w-full' onClick={onSubmit} />
            </div>
        </div>
    )
}

export default AnnotationsFormOrganizer