/* eslint-disable @next/next/no-img-element */

import { AuthService } from 'app/zynerator/security/Auth.service';
import AppMenuitem from 'layout/AppMenuitem';
import { MenuProvider } from 'layout/context/menucontext';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppMenuItem } from 'types/types';
import i18n from './i18n';
import useFeatureFlags from 'app/component/admin/view/featureFlag/list/FeatureFlagsComponent';


const AppMenu = () => {

    const [model, setModel] = useState<AppMenuItem[]>([] as AppMenuItem[]);
    const authService = new AuthService();
    const { t } = useTranslation();
    const { featureFlags, isActiveBack, isActiveFront} = useFeatureFlags();

    const modelAdminTechnique: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-sitemap', to: '/plan-classement' }, 
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 

            ]
        },
        {
            label: t('appBar.settings'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('appBar.entiteAdministrative'),
                    icon: 'pi pi-fw pi-tag',
                    items: [
                        {
                            label: t('appBar.entiteAdministrativeType.entiteAdministrativeType'),
                            to: '/admin/view/organigramme/entite-administrative-type/list'
                        },
                        {
                            label: t('appBar.entiteAdministrativeList'),
                            to: '/admin/view/organigramme/entite-administrative/list'
                        },
                    ]
                },
                {
                    label: t('appBar.users'),
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: t('appBar.userState'),
                            to: '/admin/view/referentiel-partage/etat-utilisateur/list'
                        },
                        {
                            label: t('appBar.userGroup'),
                            to: '/admin/view/referentiel-partage/groupe/list'
                        },
                        {
                            label: t('appBar.usersList'),
                            to: '/admin/view/organigramme/utilisateur/list'
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
                                to: '/admin/view/referentiel-doc/document-type/list'
                            },
                            {
                                label: t('appBar.documentCategorie'),
                                to: '/admin/view/referentiel-doc/document-categorie/list'
                            },
                            {
                                label: t('appBar.documentValidationState'),
                                to: '/admin/view/referentiel-doc/document-state/list'
                            },
                            {
                                label: t("appBar.indexElement"),
                                to: '/admin/view/referentiel-doc/index-element/list'
                            },
                        ]
                },
                
            ]
        },
    ];

    const modelAdminFonctionel: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label:  t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'),icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        {
            label:  t('appBar.settings'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label:  t('appBar.entiteAdministrative'),
                    icon: 'pi pi-fw pi-tag',
                    items: [
                        {
                            label:  t('appBar.entiteAdministrativeType'),
                            to: '/admin/view/organigramme/entite-administrative-type/list'
                        },
                        {
                            label:  t('appBar.entiteAdministrativeList'),
                            to: '/admin/view/organigramme/entite-administrative/list'
                        },
                    ]
                },
                {
                    label: t('appBar.users'),
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: t('appBar.userState'),
                            to: '/admin/view/referentiel-partage/etat-utilisateur/list'
                        },
                        {
                            label: t('appBar.userGroup'),
                            to: '/admin/view/referentiel-partage/groupe/list'
                        },
                        {
                            label: t('appBar.usersList'),
                            to: '/admin/view/organigramme/utilisateur/list'
                        },
                    ]
                },
                {
                    label: t('appBar.documents'),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label:  t('appBar.documentType'),
                                to: '/admin/view/referentiel-doc/document-type/list'
                            },
                            {
                                label: t('appBar.documentCategorie'),
                                to: '/admin/view/referentiel-doc/document-categorie/list'
                            },
                            {
                                label: t('appBar.documentValidationState'),
                                to: '/admin/view/referentiel-doc/document-state/list'
                            },
                            {
                                label: t("appBar.indexElement"),
                                to: '/admin/view/referentiel-doc/index-element/list'
                            },
                        ]
                },
                {
                    label:t('appBar.classificationPlan'), 
                    icon: 'pi pi-sort-amount-down-alt',
                    items:
                        [
                            {
                                label: t('Models'),
                                to: '/plan-models'
                            },
                            {
                                label: t('appBar.indexElement'),
                                to: '/plan-index'
                            },
                        ]
                },
                {
                    label: t('appBar.bureauOrdre'), icon: 'pi pi-fw pi-inbox', to:'',
                    items: [
                        {
                            label: t('appBar.etablissements'),
                            icon: 'pi pi-fw pi-building',
                            to: '/bureau-ordre-etablissements'
                        },
                        {
                            label: t('appBar.actions'),
                            icon: 'pi pi-bolt',
                            to: '/bureau-ordre-actions'
                        },
                        {
                            label: t('appBar.registres'),
                            icon: 'pi pi-fw pi-book',
                            to: '/bureau-ordre-registres'
                        }
                    ]

                },
            ]
        },
        {
            label: t('appBar.jornalisation'),   
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('appBar.audit'),
                    icon: 'pi pi-fw pi-file-o',
		            to: '/Audit',
                }
            ]  
        },
        {
            label: t('echantillon.qualite'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('echantillon.appMenu'),
                    icon: 'pi pi-fw pi-filter',
                    to: '/Echantillonnage'
                },
                {
                    label: t('echantillon.validation'),
                    icon: 'pi pi-fw pi-check-circle',
                    to: '/Validation'
                }
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documentsMenu"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentsList'),
                                to: '/plan-classement',
                            },
                            {
                                label: t('appBar.editor'),
                                to: '/text-editor',
                            },
                            {
                                label : t('Modeles'),
                                to: '/templates'
                            }

                        ]
                },
                { label: t('appBar.archive'), icon: 'pi pi-fw pi-box', to: '',
                items: [
                    {
                        label: t('appBar.archiveIntermediate'),
                        icon: 'pi pi-fw pi-filter',
                        to: '/Archive' 
                    },
                    {
                        label: t('appBar.archiveFinal'),
                        icon: 'pi pi-fw pi-check-circle',
                        to: '/Archive-final'
                    }
                ]
                }, 
                {
                    label: t('appBar.mesCourriels'), icon: 'pi pi-fw pi-inbox', to:'/bureau-ordre-mesCourriels',
                    
                },
                {
                    label: t('appBar.courrielsCalendar'),
                    icon: 'pi pi-fw pi-calendar',
                    to: '/bureau-ordre-calendar'
                },
                {
                    label: t('appBar.bureauOrdre'), icon: 'pi pi-fw pi-box', to:'',
                    items: [
                        {
                            label: t('appBar.dashboard'),
                            icon: 'pi pi-fw pi-chart-line',
                            to: '/bureau-ordre-analytics'
                        },
                        {
                            label: t('appBar.courriels'),
                            icon: 'pi pi-fw pi-inbox',
                            to: '/bureau-ordre-courriels'
                        },
                    ]

                },   
                {
                    label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                },         
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },

            ]
        },
        {
            label: t('appBar.workflow'),
            icon: 'pi pi-fw pi-file-o',
            items:
                [
                    {
                        label:  t('appBar.dashboard'),
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            {
                                label:  t('appBar.dashboard'),
                                icon: 'pi pi-fw pi-chart-line',
                                to: '/workflowDashboard'
                            },
                            {
                                label: t('appBar.rechercheDocWorkflow'),
                                icon: 'pi pi-fw pi-search',
                                to: '/workflow-parapheur-dashboard'
                            },
                        ],
                    },
                    {
                        label: t('appBar.workflow'),
                        icon: 'pi pi-fw pi-briefcase',
                        items:
                        [
                            {
                                label: t('appBar.lancerCommission'),
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
                                icon: 'pi pi-verified',
                                to: '/admin/view/workflow/mesTaches'
                            },
                          
                        ]
                    },
                    {
                        label:t('appBar.auditCommission'),
                        icon: 'pi pi-fw pi-wrench',
                        to: '/AuditWorkflow'
                    },
                    {
                        label: t('appBar.workflowPreset'),            
                        icon: 'pi pi-sliders-v',
                        to: '/workflowPreset'
                    },
                ]
        },
    ];

    const modelAgentExterne: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label: t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'), icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documents"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentScanning'),
                                to: '/plan-classement',
                            },
                            {
                                label: t('appBar.editor'),
                                to: '/text-editor',
                            },
                        ]
                },
                { label: t('appBar.archive'), icon: 'pi pi-fw pi-box', to: '',
                    items: [
                        {
                            label: t('appBar.archiveIntermediate'),
                            icon: 'pi pi-fw pi-filter',
                            to: '/Archive' 
                        },
                        {
                            label: t('appBar.archiveFinal'),
                            icon: 'pi pi-fw pi-check-circle',
                            to: '/Archive-final'
                        }
                    ]
                },
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
                // {
                //     label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                // },
            ]
        },
    ];

    const modelUserBO: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label:  t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'),icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documentsMenu"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentsList'),
                                to: '/plan-classement',
                            },
                        ]
                },
                {
                    label: t('appBar.mesCourriels'), icon: 'pi pi-fw pi-inbox', to:'/bureau-ordre-mesCourriels',
                    
                },
                {
                    label: t('appBar.bureauOrdre'), icon: 'pi pi-fw pi-box', to:'',
                    items: [
                        {
                            label: t('appBar.courriels'),
                            icon: 'pi pi-fw pi-inbox',
                            to: '/bureau-ordre-courriels'
                        }]

                },              
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
                {
                    label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                },

            ]
        },
    ];

    const modelUserWF: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label:  t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'),icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documentsMenu"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentsList'),
                                to: '/plan-classement',
                            },
                            {
                                label : t('Modeles'),
                                to: '/templates'
                            }

                        ]
                },             
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
                {
                    label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                },
            ]
        },
        {
            label: t('appBar.workflow'),
            icon: 'pi pi-fw pi-file-o',
            items:
                [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
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
                        ],
                    },
                    {
                        label: t('appBar.workflow'),
                        icon: 'pi pi-fw pi-briefcase',
                        items:
                        [
                            {
                                label:  t('lancez une Commission'),
                                icon: 'pi pi-play',
                                to: '/workflow'
                            },
                            {
                                label: t('Mes Workflows'),
                                icon: 'pi pi-cog',
                                to: '/admin/view/workflow/workflowList'
                            },
                            {
                                label: t('Mes taches'),
                                icon: 'pi pi-verified',
                                to: '/admin/view/workflow/mesTaches'
                            },
                          
                        ]
                    },
                    {
                        label: 'Audit des Workflowws',
                        icon: 'pi pi-fw pi-wrench',
                        to: '/AuditWorkflow'
                    },
                    {
                        label: t('appBar.workflowPreset'),            
                        icon: 'pi pi-sliders-v',
                        to: '/workflowPreset'
                    },
                ]
        },
    ];

    const modelUserArchive: AppMenuItem[] = [
        {
            label: t('appBar.home'),
            items: [
                { label:  t('appBar.dashboard'), icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
                { label: t('appBar.organigramme'),icon: 'pi pi-fw pi-th-large', to: '/organigrame' },
                { label: t('appBar.classificationPlan'), icon: 'pi pi-fw pi-th-large', to: '/plan-Organigramme' },
                { label: t('appBar.classification'), icon: 'pi pi-fw pi-sitemap', to: '/Classement' }, 
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documentsMenu"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentsList'),
                                to: '/plan-classement',
                            },
                        ]
                },
                { label: t('appBar.archive'), icon: 'pi pi-fw pi-box', to: '',
                items: [
                    {
                        label: t('appBar.archiveIntermediate'),
                        icon: 'pi pi-fw pi-filter',
                        to: '/Archive' 
                    },
                    {
                        label: t('appBar.archiveFinal'),
                        icon: 'pi pi-fw pi-check-circle',
                        to: '/Archive-final'
                    }
                ]
                },             
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
                {
                    label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                },

            ]
        },
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
        {
            label: t('appBar.jornalisation'),   
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('appBar.audit'),
                    icon: 'pi pi-fw pi-file-o',
		            to: '/Audit',
                }
            ]  
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documentsMenu"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentsList'),
                                to: '/plan-classement',
                            },
                        ]
                },
            ]
        },
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
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documents"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentScanning'),
                                to: '/plan-classement',
                            },
                            {
                                label: t('appBar.editor'),
                                to: '/text-editor',
                            },
                        ]
                },
            ]
        },
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
        {
            label: t('appBar.jornalisation'),   
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('appBar.audit'),
                    icon: 'pi pi-fw pi-file-o',
                    to: '/Audit',
                }
            ]  
        },
        {
            label: t('echantillon.qualite'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t('echantillon.appMenu'),
                    icon: 'pi pi-fw pi-filter',
                    to: '/Echantillonnage'
                },
                {
                    label: t('echantillon.validation'),
                    icon: 'pi pi-fw pi-check-circle',
                    to: '/Validation'
                }
            ]
        },
        {
            label: t('appBar.administration'),
            icon: 'pi pi-fw pi-briefcase',
            to: '',
            items: [
                {
                    label: t("appBar.documents"),
                    icon: 'pi pi-fw pi-file-o',
                    items:
                        [
                            {
                                label: t('appBar.documentScanning'),
                                to: '/plan-classement',
                            },
                            {
                                label: t('appBar.editor'),
                                to: '/text-editor',
                            },
                        ]
                },
                { label: t('appBar.archive'), icon: 'pi pi-fw pi-box', to: '',
                    items: [
                        {
                            label: t('appBar.archiveIntermediate'),
                            icon: 'pi pi-fw pi-filter',
                            to: '/Archive' 
                        },
                        {
                            label: t('appBar.archiveFinal'),
                            icon: 'pi pi-fw pi-check-circle',
                            to: '/Archive-final'
                        }
                    ]
                },
                { label: t('appBar.recycleBin'), icon: 'pi pi-fw pi-trash', to: '/Corbeille' },
                {
                    label: 'Parapheur', icon: 'pi  pi-folder', to:'/parapheur',
                },
            ]
        },
    ];

    useEffect(() => {
        const roleConnectedUser = authService.getRoleConnectedUser();
        isActiveBack('useRemoteSignature').then((res) => {
            if(res && roleConnectedUser === 'ROLE_ADMIN_FUNC'){
                modelAdminFonctionel[1].items.push(            
                    {
                        label : t('appBar.signingCertificat'),
                        icon: 'pi pi-shield',
                        items : [
                            {
                                label: t('appBar.certificatList'),
                                to: '/admin/view/certificats/certificatList'
                            }
                        ]
                    });
                    setModel(modelAdminFonctionel);
                }
        });        
    }, [featureFlags]);

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
        <MenuProvider>    
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          );
        })}
      </ul>
        </MenuProvider>
    );
};


export default AppMenu;
