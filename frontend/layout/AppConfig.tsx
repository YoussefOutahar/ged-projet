import { LayoutContext } from 'layout/context/layoutcontext';
import { useContext, useEffect } from 'react';
import { AppConfigProps } from 'types/types';

const AppConfig = (props: AppConfigProps) => {
    const { layoutConfig } = useContext(LayoutContext);

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    useEffect(() => {
        applyScale();
    }, [layoutConfig.scale]);

    return <></>
};

export default AppConfig;
