import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";


const AppFooter = () => {
    const { t } = useTranslation();

    return (
        <div className="layout-footer">
            <span>{t("footer.droitsreserves")} &copy; {new Date().getFullYear()}</span>
        </div>
    );
};

export default AppFooter;
