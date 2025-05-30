import { t } from 'i18next';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'

type Props = {
    visible: boolean;
    generatedNumeroCourriel: string;
    cancelNumeroCourrielDialog: () => void;
}

const GeneratedNumeroCourrielPopup = ({visible,generatedNumeroCourriel,cancelNumeroCourrielDialog}: Props) => {
    

  return (
    <Dialog
        visible={visible}
        onHide={() => cancelNumeroCourrielDialog()}
        header={t('bo.data.numeroCourriel')}
        modal
        className="flex flex-column justify-content-center "
        footer={<Button label={t('close')} onClick={() => cancelNumeroCourrielDialog()} />}
    >
        <span className="text-2xl ">{generatedNumeroCourriel}</span>
    </Dialog>  )
}

export default GeneratedNumeroCourrielPopup