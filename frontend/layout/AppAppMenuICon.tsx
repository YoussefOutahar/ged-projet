import { AuthService } from 'app/zynerator/security/Auth.service';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AppMenuItem } from 'types/layout';
import i18n from './i18n';
import Link from 'next/link';
import { TieredMenu } from 'primereact/tieredmenu';
import { useRouter } from 'next/router';

const AppMenuICon = () => {
    const [model, setModel] = useState<AppMenuItem[]>([] as AppMenuItem[]);
    const authService = new AuthService();
    const router = useRouter();
    const menuA = useRef<any>(null);
    const menuB = useRef<any>(null);
    const { t } = useTranslation();

    const modelAdminFonctionel: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        {
            label: t('appBar.settings'), icon: 'pi pi-fw pi-wrench', badge: "NEW",
            items: [{
                label: t('appBar.entiteAdministrative'),
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: t('appBar.entiteAdministrativeType'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/entite-administrative-type/list',
                    },
                    {
                        label: t('appBar.entiteAdministrativeList'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/entite-administrative/list'
                    },
                ]
            },
            {
                label: t('appBar.users'),
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: t('appBar.userState'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/referentiel-partage/etat-utilisateur/list'
                    },
                    {
                        label: t('appBar.userGroup'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/referentiel-partage/groupe/list'
                    },
                    {
                        label: t('appBar.usersList'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/utilisateur/list'
                    },
                ]
            },
            {
                label: t('appBar.documents'),
                icon: 'pi pi-fw pi-file-o',
                items:
                    [
                        {
                            label: t('appBar.documentType'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-type/list'
                        },
                        {
                            label: t('appBar.documentCategorie'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-categorie/list'
                        },
                        {
                            label: t('appBar.documentValidationState'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-state/list'
                        },
                        {
                            label: t("appBar.indexElement"),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/index-element/list'
                        },
                    ]
            }]
        },
        { label: t('appBar.audit'), icon: 'pi pi-fw pi-cog', to: '/Audit' },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('echantillon.appMenu'), icon: 'pi pi-fw pi-filter', to: '/Echantillonnage' },
        { label: t('echantillon.validation'), icon: 'pi pi-fw pi-check-circle', to: '/Validation' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label: t('appBar.editor'), icon: 'pi pi-fw pi-file-edit', to: '/text-editor' },
        { label : t('Modeles'), icon: 'pi pi-fw pi-briefcase', to: '/templates'},
        { label: t('appBar.mesCourriels'), icon: 'pi pi-fw pi-inbox', to:'/bureau-ordre-mesCourriels'},
        {
            label: t('appBar.courrielsCalendar'),
            icon: 'pi pi-fw pi-calendar',
            to: '/bureau-ordre-calendar'
        },
        {
            label: t('appBar.courriels'),
            icon: 'pi pi-fw pi-envelope',
            to: '/bureau-ordre-courriels'
        },
        {
            label: t('appBar.dashboard'),
            icon: 'pi pi-fw pi-chart-line',
            to: '/bureau-ordre-analytics'
        },
        {
            label: t('appBar.archive'), icon: 'pi pi-fw pi-box',
            items: [
                {
                    label: t('appBar.archiveIntermediate'),
                    icon: 'pi pi-fw pi-filter',
                    url: '/Archive'
                },
                {
                    label: t('appBar.archiveFinal'),
                    icon: 'pi pi-fw pi-check-circle',
                    url: '/Archive-final'
                }
            ]
        },
        {
            label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
        },
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        { label: 'Separateur', icon:'pi pi-minus' ,to: '#'},
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-line',
            to: '/workflowDashboard'
        },
        {
            label: 'Recherche de document',
            icon: 'pi pi-fw pi-search',
            to: '/workflow-parapheur-dashboard'
        },
        {
            label:  t('lancez une Commission'),
            icon: 'pi pi-play',
            to: '/workflow'
        },
        {
            label: t('tous les Commissions'),
            icon: 'pi pi-cog',
            to: '/admin/view/workflow/workflowList'
        },
        {
            label: t('Mes taches'),
            icon: 'pi pi-check-circle',
            to: '/admin/view/workflow/mesTaches'
        },
        {
            label: 'Audit Commissions',
            icon: 'pi pi-fw pi-wrench',
            to: '/AuditWorkflow'
        },  
        {
            label: t('appBar.workflowPreset'),
            icon: 'pi pi-sitemap',
            to: '/workflowPreset'
        },
    ];
    const modelAdminTechnique: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        {
            label: t('appBar.settings'), icon: 'pi pi-fw pi-wrench', badge: "NEW",
            items: [{
                label: t('appBar.entiteAdministrative'),
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: t('appBar.entiteAdministrativeType'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/entite-administrative-type/list',
                    },
                    {
                        label: t('appBar.entiteAdministrativeList'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/entite-administrative/list'
                    },
                ]
            },
            {
                label: t('appBar.users'),
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: t('appBar.userState'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/referentiel-partage/etat-utilisateur/list'
                    },
                    {
                        label: t('appBar.userGroup'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/referentiel-partage/groupe/list'
                    },
                    {
                        label: t('appBar.usersList'),
                        icon: "pi pi-angle-right",
                        url: '/admin/view/organigramme/utilisateur/list'
                    },
                ]
            },
            {
                label: t('appBar.documents'),
                icon: 'pi pi-fw pi-file-o',
                items:
                    [
                        {
                            label: t('appBar.documentType'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-type/list'
                        },
                        {
                            label: t('appBar.documentCategorie'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-categorie/list'
                        },
                        {
                            label: t('appBar.documentValidationState'),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/document-state/list'
                        },
                        {
                            label: t("appBar.indexElement"),
                            icon: "pi pi-angle-right",
                            url: '/admin/view/referentiel-doc/index-element/list'
                        },
                    ]
            }]
        },
    ];
    const modelAgentExterne: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label: t('appBar.editor'), icon: 'pi pi-fw pi-file-edit', to: '/text-editor' },
        {
            label: t('appBar.archive'), icon: 'pi pi-fw pi-box',
            items: [
                {
                    label: t('appBar.archiveIntermediate'),
                    icon: 'pi pi-fw pi-filter',
                    url: '/Archive'
                },
                {
                    label: t('appBar.archiveFinal'),
                    icon: 'pi pi-fw pi-check-circle',
                    url: '/Archive-final'
                }
            ]
        },
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        // { label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur' },
    ];
    const modelUserBO: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label: t('appBar.mesCourriels'), icon: 'pi pi-fw pi-inbox', to:'/bureau-ordre-mesCourriels'},
        {
            label: t('appBar.courriels'),
            icon: 'pi pi-fw pi-envelope',
            to: '/bureau-ordre-courriels'
        },
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        { label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur' },
    ];
    const modelUserWF: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label : t('Modeles'), icon: 'pi pi-fw pi-briefcase', to: '/templates'},
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        { label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur' },
        { label: 'Separateur', icon:'pi pi-minus' ,to: '#'},
        {
            label: t('appBar.dashboard'),
            icon: 'pi pi-fw pi-chart-line',
            to: '/workflowDashboard'
        },
        {
            label: t('appBar.rechercheDocWorkflow'),
            icon: 'pi pi-fw pi-search',
            to: '/workflow-parapheur-dashboard'
        },
        {
            label:  t('appBar.lancerCommission'),
            icon: 'pi pi-play',
            to: '/workflow'
        },
        {
            label: t('appBar.mesCommissions'),
            icon: 'pi pi-cog',
            to: '/admin/view/workflow/workflowList'
        },
        {
            label: t('appBar.MesTaches'),
            icon: 'pi pi-check-circle',
            to: '/admin/view/workflow/mesTaches'
        },
        {
            label: t('appBar.auditCommission'),
            icon: 'pi pi-fw pi-wrench',
            to: '/AuditWorkflow'
        },  
        {
            label: t('appBar.workflowPreset'),
            icon: 'pi pi-sitemap',
            to: '/workflowPreset'
        },
    ];
    const modelUserArchive: AppMenuItem[] = [
        { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
        { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-Organigramme' },
        { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        {
            label: t('appBar.archive'), icon: 'pi pi-fw pi-box',
            items: [
                {
                    label: t('appBar.archiveIntermediate'),
                    icon: 'pi pi-fw pi-filter',
                    url: '/Archive'
                },
                {
                    label: t('appBar.archiveFinal'),
                    icon: 'pi pi-fw pi-check-circle',
                    url: '/Archive-final'
                }
            ]
        },
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        { label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur' },
    ];
     //Admin Client
     const modelAdminClient: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label:  t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'),icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.audit'), icon: 'pi pi-fw pi-cog', to: '/Audit' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
    ];
    //Agent de Scan
    const modelAgentScan: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
            ]
        },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label: t('appBar.editor'), icon: 'pi pi-fw pi-file-edit', to: '/text-editor' },
    ];
    //Chef de Projet de numérisation
    const modelChefProjet: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('appBar.audit'), icon: 'pi pi-fw pi-cog', to: '/Audit' },
        { label: 'Separateur', icon: 'pi pi-minus', to: '#' },
        { label: t('echantillon.appMenu'), icon: 'pi pi-fw pi-filter', to: '/Echantillonnage' },
        { label: t('echantillon.validation'), icon: 'pi pi-fw pi-check-circle', to: '/Validation' },
        { label: t('appBar.documentsMenu'), icon: 'pi pi-fw pi-briefcase', to: '/plan-classement' },
        { label: t('appBar.editor'), icon: 'pi pi-fw pi-file-edit', to: '/text-editor' },
        {
            label: t('appBar.archive'), icon: 'pi pi-fw pi-box',
            items: [
                {
                    label: t('appBar.archiveIntermediate'),
                    icon: 'pi pi-fw pi-filter',
                    url: '/Archive'
                },
                {
                    label: t('appBar.archiveFinal'),
                    icon: 'pi pi-fw pi-check-circle',
                    url: '/Archive-final'
                }
            ]
        },
        { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
        {label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur' },
    ];
    useEffect(() => {
        const roleConnectedUser = authService.getRoleConnectedUser();
        let updatedModel: AppMenuItem[] = [];
        if (roleConnectedUser === 'ROLE_ADMIN_TECH') {
            setModel(modelAdminTechnique);
            updatedModel =modelAdminTechnique;
        }
        if (roleConnectedUser === 'ROLE_ADMIN_FUNC') {
            setModel(modelAdminFonctionel);
            updatedModel = modelAdminFonctionel;
        }
        //Admin Client
        if (roleConnectedUser === 'ROLE_ADMIN_CLIENT') {
            setModel(modelAdminClient);
            updatedModel = modelAdminClient;
        }
        //Agent de Scan
        if (roleConnectedUser === 'ROLE_AGENT_SCAN') {
            setModel(modelAgentScan);
            updatedModel = modelAgentScan;
        }
        //collaborateur
        if (roleConnectedUser === 'ROLE_COLLABORATEUR') {
            setModel(modelAgentExterne);
            updatedModel = modelAgentExterne;
        }
        if (roleConnectedUser === 'ROLE_CHEF_PROJET') {
            setModel(modelChefProjet);
            updatedModel = modelChefProjet;
        }
        if (roleConnectedUser === 'ROLE_USER_BO') {
            setModel(modelUserBO);
            updatedModel = modelUserBO;
        }
        if (roleConnectedUser === 'ROLE_USER_WF') {
            setModel(modelUserWF);
            updatedModel = modelUserWF;
        }
        if (roleConnectedUser === 'ROLE_USER_ARCHIVE') {
            setModel(modelUserArchive);
            updatedModel = modelUserArchive;
        }
        setModel(updatedModel);
    }, [i18n.language])
    return (
        <div className="app-menu-icons-only mt-3">
            {model.map((item, index) => (
                <div key={index} className="app-menu-item-icon">
                    {item.to ? (
                        <Link href={item.to} target={item.target || '_self'} tabIndex={0}>
                            <span
                                className={`pi ${item.icon} mb-3 ml-1 hover:text-blue-600 ${router.asPath === item.to ? 'text-blue-500' : ''}`}
                                style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                                title={item.label}
                            />
                        </Link>

                    ) : (
                        <>
                            <span
                                className={`pi ${item.icon} mb-3 ml-1 hover:text-blue-600`}
                                style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                                title={item.label}
                                onClick={(e) => {
                                    if (item.badge) {
                                        menuA.current!.toggle(e);
                                    } else {
                                        menuB.current!.toggle(e);
                                    }
                                }}
                            />
                            {item.badge ? (
                                <TieredMenu model={model[index].items} popup ref={menuA} breakpoint="887px" className='ml-5' style={{ background: "#eff5fe" }} />
                            ) : (
                                <TieredMenu model={model[index].items} popup ref={menuB} breakpoint="887px" className='ml-5' style={{ background: "#eff5fe" }} />
                            )
                            }
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AppMenuICon
