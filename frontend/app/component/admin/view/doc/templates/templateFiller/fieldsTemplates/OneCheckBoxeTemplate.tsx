import { PDFCheckBox } from 'pdf-lib'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import React, { forwardRef, useImperativeHandle } from 'react'

type Props = {
    checkBoxeField: PDFCheckBox
}

const OneCheckBoxeTemplate = forwardRef(({ checkBoxeField }: Props, ref) => {


    const [checked, setChecked] = React.useState<boolean>(checkBoxeField.isChecked())

    const onCheckChange = (e: CheckboxChangeEvent) => {
        const checkBox = e.target.value
        if (checkBox) {
            if (e.checked) {
                checkBox.check()
                setChecked(true)
            } else {
                checkBox.uncheck()
                setChecked(false)
            }
        }
    }

    useImperativeHandle(ref,()=> ({
        onClear: ()=>{
            checkBoxeField.uncheck()
            setChecked(false)
        }
    }))
    return (
        <div className='flex flex-column gap-1 m-1'>
            <div key={checkBoxeField.ref.objectNumber} className='flex gap-2'>
                <Checkbox inputId={checkBoxeField?.ref?.tag} name="category" value={checkBoxeField} onChange={onCheckChange} checked={checked} />
                <span>{checkBoxeField.getName()}</span>
            </div>

        </div>
    )
})

export default OneCheckBoxeTemplate