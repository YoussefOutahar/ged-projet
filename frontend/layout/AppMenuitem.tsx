import { useRouter } from 'next/router';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from '../layout/context/menucontext';
import { AppMenuItemProps } from 'types/types';

const AppMenuitem = (props: AppMenuItemProps) => {
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const router = useRouter();
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item?.to && router.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const transitionRef = useRef(null);

    useEffect(() => {
        if (item?.to && router.pathname === item.to) {
            setActiveMenu(key);
        }
        const onRouteChange = (url: string) => {
            if (item?.to && item.to === url) {
                setActiveMenu(key);
            }
        };
        router.events.on('routeChangeComplete', onRouteChange);
        return () => {
            router.events.off('routeChangeComplete', onRouteChange);
        };
    }, []);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        //avoid processing disabled items
        if (item?.disabled) {
            event.preventDefault();
            return;
        }
        //execute command
        if (item?.command) {
            item.command({ originalEvent: event, item: item });
        }
        // toggle active state
        if (item?.items) setActiveMenu(active ? props.parentKey as string : key);
        else setActiveMenu(key);
    };

    const subMenu = item?.items && item.visible !== false && (
        <CSSTransition nodeRef={transitionRef} timeout={1000} classNames="layout-submenu" in={props.root ? true : active} key={item.label} >
            <ul ref={transitionRef} className="layout-submenu">
                {item.items.map((child: any, i: number) => {
                    return (
                        <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
                    );
                })}
            </ul>
        </CSSTransition>
    );
    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
            {(!item.to || item.items) && item.visible !== false ? (
                <a href={item.url} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple')} target={item.target} tabIndex={0} >
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}
            {item.to && !item.items && item.visible !== false ? (
                <Link href={item.to} replace={item.replaceUrl} target={item.target} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })} tabIndex={0} >
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.label}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}
            {subMenu}
        </li>
    );
};
export default AppMenuitem;
