import { PDFTextField } from 'pdf-lib'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import React, { forwardRef, useImperativeHandle } from 'react'

type Props = {
    field: PDFTextField
}

const TextFieldTemplate = forwardRef( ({ field }: Props, ref) => {

    const [value, setValue] = React.useState<string>(field.getText() || '')

    const handleInputTextChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        field.setText(e.target.value)
    }

    const handleInputTextAreaChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
        field.setText(e.target.value)
    }

    useImperativeHandle(ref, () => ({
        onClear : () => {
            setValue('')
            field.setText('')
        }
    }))
    
    return (
        <div className='col-12 md:col-12 lg:col-12 flex flex-column gap-1  '>
            <span className='font-bold'>{field.getName()}</span>
            {
                field.isMultiline()
                    ?
                    <InputTextarea
                        value={value}
                        className={`border-1  border-round `}
                        required={field.isRequired()}
                        onChange={handleInputTextAreaChanges}
                    />
                    :
                    <InputText
                        value={value}
                        className={`border-1  border-round `}
                        required={field.isRequired()}
                        onChange={handleInputTextChanges}

                    />
            }
        </div>
    )
})

export default TextFieldTemplate