import { t } from 'i18next'
import { ArrowBigRight, FileSliders, FileText, TextCursorInput } from 'lucide-react'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import React from 'react'

type Props = {
    setFile : (file : File) => void
}

const TemplatesDemo = ({setFile}: Props) => {
    const chooseOptions = { icon: 'pi', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined hover:bg-primary' };

    const [createCliked, setCreateClicked] = React.useState(false)

    return (
        <div
            className={`flex flex-column gap-4 justify-content-center align-items-center card border-dashed border-3 bg-white `}
            style={{ minHeight: '60vh' }}
        >
            <span className='text-4xl mb-7 ' >{t("templates.demo.title")}</span>

            <div className='flex flex-row justify-content-center align-items-center gap-5 w-full'>

                <div className='flex flex-column justify-content-center align-items-center gap-3 '>
                    <FileText className='' size="100px" strokeWidth="1px" />
                    <span className='font-bold ' >{t("templates.demo.addStep.label")}</span>
                    <span className='text-center w-15rem '>{t("templates.demo.addStep.description")}</span>

                </div>

                <ArrowBigRight className='mb-7' size="50px" strokeWidth="1px" />

                <div className='flex flex-column justify-content-center align-items-center gap-3'>
                    <TextCursorInput size="100px" strokeWidth="1px" />
                    <span className='font-bold ' >{t("templates.demo.prepareStep.label")}</span>
                    <span className='text-center w-15rem '>{t("templates.demo.prepareStep.description")}</span>
                </div>

                <ArrowBigRight className='mb-7' size="50px" strokeWidth="1px" />

                <div className='flex flex-column justify-content-center align-items-center gap-3'>
                    <FileSliders size="100px" strokeWidth="1px" />
                    <span className='font-bold ' >{t("templates.demo.saveStep.label")}</span>
                    <span className='text-center w-15rem '>{t("templates.demo.saveStep.description")}</span>
                </div>
            </div>

            {/* <Button  label='Create Template' raised className='fadein animation-duration-1000 my-5 ' rounded size='large' /> */}
            <Button label={t("templates.demo.createTemplateButton.label")} raised className='fadein animation-duration-1000 mt-5 ' rounded size='large' onClick={()=> setCreateClicked(true)} />
            <div className={`${createCliked?"":" opacity-0 "} flex flex-row gap-5 `} style={{}}>
                <FileUpload className={` ${createCliked?" zoomindown ":" "}  animation-duration-500`} chooseLabel={t("templates.demo.uploadFileLabel.label")} chooseOptions={chooseOptions} mode="basic" auto accept="application/pdf" customUpload uploadHandler={(e) => setFile(e.files[0])} />
                <Button label={t("templates.demo.selectExistingLabel.label")} rounded className={`${createCliked?" zoomindown ":" "} animation-duration-500 bg-primary-reverse hover:bg-primary `} />
            </div>


        </div>
    )
}

export default TemplatesDemo
