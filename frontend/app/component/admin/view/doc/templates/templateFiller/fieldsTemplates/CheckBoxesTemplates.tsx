import { PDFCheckBox } from 'pdf-lib'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import React, { useEffect } from 'react'

type Props = {
    checkBoxeGroup: PDFCheckBox[]
}

const CheckBoxesTemplates = ({ checkBoxeGroup }: Props) => {


    const groupName = checkBoxeGroup[0].getName().split('.')[0]


    const [selectedCheckBoxes, setSelectedCheckBoxes] = React.useState<PDFCheckBox[]>([])

    const onCheckChange = (e: CheckboxChangeEvent) => {
        const checkBox = checkBoxeGroup.find(checkBox => checkBox === e.target.value)
        if (checkBox) {
            if (e.checked) {
                setSelectedCheckBoxes([...selectedCheckBoxes, checkBox])
                checkBox.check()
            } else {
                setSelectedCheckBoxes(selectedCheckBoxes.filter(selectedCheckBox => selectedCheckBox !== checkBox))
                checkBox.uncheck()
            }
        }
    }

    useEffect(() => {
        if (checkBoxeGroup) {
            checkBoxeGroup.forEach(checkBox => {
                if (checkBox.isChecked()) {
                    setSelectedCheckBoxes([...selectedCheckBoxes, checkBox])
                }
            })
        }
    }, [checkBoxeGroup])

    return (
        <div className='flex flex-column gap-1 m-1'>
            <span className='font-bold'>{groupName}</span>
            {
                checkBoxeGroup.map(checkBox => {
                    return (
                        <div key={checkBox.ref.objectNumber} className='flex gap-2'>
                            <Checkbox inputId={checkBox?.ref?.tag} name="category" value={checkBox} onChange={onCheckChange} checked={selectedCheckBoxes.some((item) => item === checkBox)} />
                            <span>{checkBox.getName().split('.')[1]}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CheckBoxesTemplates