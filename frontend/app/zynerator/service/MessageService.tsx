export const MessageService = {

    showToast: (toastRef: any, options: any) => {
        if (toastRef && options) {
            toastRef.current?.show(options);
        }
    },

    showBanner: (toastRef: any, title: string, message: string, severity: string) => {
        let options = { 
            severity: severity, 
            summary: title, 
            detail: message, 
            life: 10000,
            content: () => (
                <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                    <div className="flex align-items-center gap-2">
                    </div>
                    <div className="font-medium text-lg my-3 text-900">{message}</div>
                    {/* <Button className="p-button-sm flex" label="Reply" severity="success" onClick={clear}></Button> */}
                </div>
            )
        };
        toastRef.current?.show(options);
    },

    showSuccess: (toastRef: any, title: string, message: string) => {
        let options = { severity: 'success', summary: title, detail: message, life: 3000 };
        toastRef.current?.show(options);
    },

    showError: (toastRef: any, title: string, message: string) => {
        let options = { severity: 'error', summary: title, detail: message, life: 3000 };
        toastRef.current?.show(options);
    },
    showWarning: (toastRef: any, title: string, message: string) => {
        let options = { severity: 'warn', summary: title, detail: message, life: 3000 };
        toastRef.current?.show(options);
    },
};
