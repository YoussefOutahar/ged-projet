import TemplateBuilder from 'app/component/admin/view/doc/templates/templateBuilder/TemplateBuilder'
import TemplateFiller from 'app/component/admin/view/doc/templates/templateFiller/TemplateFiller'
import TemplatesDemo from 'app/component/admin/view/doc/templates/TemplatesDemo'
import CustomFileUploader from 'app/component/common/CustomFileUploader'
import { t } from 'i18next'
import { FileUpload } from 'primereact/fileupload'
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview'
import React, { useState } from 'react'

type Props = {}

const index = (props: Props) => {
    const [file, setFile] = useState<File | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const onTabChange = (e: TabViewTabChangeEvent) => {
        setActiveIndex(e.index)
        setFile(null)
    }

    return (
        <div className='flex flex-column'>
            <h1 className="text-2xl font-bold text-blue-800">{t("templates.title")}</h1>
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header={t("templates.tabs.create")}>
                    {
                        file
                            ?
                            <TemplateBuilder file={file} setFile={setFile} />
                            :
                            <TemplatesDemo setFile={setFile} />
                    }
                </TabPanel>

                <TabPanel header={t("templates.tabs.update")}>
                    {/* <span className='text-xl font-medium mb-3'>Charger le modele</span> */}
                    <CustomFileUploader setFiles={(files) => setFile(files[0])} autoUpload className='my-4 shadow-3 ' />
                    <TemplateFiller file={file} setFile={setFile} />
                </TabPanel>
            </TabView>

        </div>
    )
}

export default index