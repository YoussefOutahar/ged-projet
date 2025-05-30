import { Button, ButtonProps } from 'primereact/button'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'
import { IconType } from 'primereact/utils'
import React from 'react'

type Props = {
    label?: string
    className?: string
    style?: React.CSSProperties
    disabled?: boolean
    icon?: IconType<ButtonProps>
    tooltip?: string
    onAccept : () => void 
    onReject : () => void
    confirmationMessage ?: string
}

const ConfirmButton = (props: Props) => {

    const confirm = (event: { currentTarget: any }) => {
        confirmPopup({
            target: event.currentTarget,
            message: props.confirmationMessage? props.confirmationMessage : 'Are you sure you want to proceed ? ',
            icon: 'pi pi-info-circle',
            // defaultFocus: 'reject',            
            acceptClassName: 'p-button-danger',
            accept: props.onAccept,
            reject: props.onReject
        });
    };

    return (
        <div>
            <ConfirmPopup />
            <Button
                label={props.label}
                onClick={confirm}
                className={props.className}
                disabled={props.disabled}
                icon={props.icon}
                tooltip={props.tooltip}
                style={props.style}
            />

        </div>
    )
}

export default ConfirmButton