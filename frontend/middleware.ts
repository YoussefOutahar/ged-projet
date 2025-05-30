// middleware.ts
import { AuthService } from 'app/zynerator/security/Auth.service';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const Roles = [
  'ROLE_ADMIN_TECH',
  'ROLE_ADMIN_FUNC',
  'ROLE_COLLABORATEUR',
  'ROLE_USER_BO',
  'ROLE_USER_WF',
  'ROLE_USER_ARCHIVE',
  'ROLE_ADMIN_CLIENT',
  'ROLE_AGENT_SCAN',
  'ROLE_CHEF_PROJET'
];
const pathsPerRole = {
  'ROLE_ADMIN_TECH': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/plan-classement',
    '/Classement',
    '/admin/view/organigramme/entite-administrative-type/list',
    '/admin/view/organigramme/entite-administrative/list',
    '/admin/view/referentiel-partage/etat-utilisateur/list',
    '/admin/view/referentiel-partage/groupe/list',
    '/admin/view/organigramme/utilisateur/list',
    '/admin/view/referentiel-doc/document-type/list',
    '/admin/view/referentiel-doc/document-categorie/list',
    '/admin/view/referentiel-doc/document-state/list',
    '/admin/view/referentiel-doc/index-element/list'
  ],
  'ROLE_ADMIN_FUNC': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/admin/view/organigramme/entite-administrative-type/list',
    '/admin/view/organigramme/entite-administrative/list',
    '/admin/view/referentiel-partage/etat-utilisateur/list',
    '/admin/view/referentiel-partage/groupe/list',
    '/admin/view/organigramme/utilisateur/list',
    '/admin/view/referentiel-doc/document-type/list',
    '/admin/view/referentiel-doc/document-categorie/list',
    '/admin/view/referentiel-doc/document-state/list',
    '/admin/view/referentiel-doc/index-element/list',
    '/admin/view/certificats/certificatList',
    '/admin/view/certificats/usersList',
    '/plan-models',
    '/plan-index',
    '/bureau-ordre-etablissements',
    '/bureau-ordre-actions',
    '/bureau-ordre-registres',
    '/Audit',
    '/Echantillonnage',
    '/Validation',
    '/plan-classement',
    '/text-editor',
    '/Archive',
    '/Archive-final',
    '/bureau-ordre-mesCourriels',
    '/bureau-ordre-calendar',
    '/bureau-ordre-analytics',
    '/bureau-ordre-courriels',
    '/parapheur',
    '/Corbeille',
    '/workflowDashboard',
    '/workflow-parapheur-dashboard',
    '/workflow',
    '/admin/view/workflow/workflowList',
    '/admin/view/workflow/mesTaches',
    '/AuditWorkflow',
    '/workflowPreset',
  ],
  'ROLE_COLLABORATEUR': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/plan-classement',
    '/text-editor',
    '/Archive',
    '/Archive-final',
    '/Corbeille'
  ],
  'ROLE_USER_BO': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/plan-classement',
    '/bureau-ordre-mesCourriels',
    '/bureau-ordre-courriels',
    '/Corbeille',
    '/parapheur'
  ],
  'ROLE_USER_WF': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/plan-classement',
    '/Corbeille',
    '/parapheur',
    '/workflowDashboard',
    '/workflow-parapheur-dashboard',
    '/workflow',
    '/admin/view/workflow/workflowList',
    '/admin/view/workflow/mesTaches',
    '/AuditWorkflow',
    '/workflowPreset'
  ],
  'ROLE_USER_ARCHIVE': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/plan-classement',
    '/Archive',
    '/Archive-final',
    '/Corbeille',
    '/parapheur'
  ],
  'ROLE_ADMIN_CLIENT': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/Audit',
    '/plan-classement'
  ],
  'ROLE_AGENT_SCAN': [
    '/auth',
    '/dashboard',
    '/plan-Organigramme',
    '/plan-classement',
    '/text-editor'
  ],
  'ROLE_CHEF_PROJET': [
    '/auth',
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/Classement',
    '/Audit',
    '/Echantillonnage',
    '/Validation',
    '/plan-classement',
    '/text-editor',
    '/Archive',
    '/Archive-final',
    '/Corbeille',
    '/parapheur'
  ]
};

export const config = {
  matcher: [
    '/dashboard',
    '/organigrame',
    '/plan-Organigramme',
    '/plan-classement',
    '/Classement',
    '/admin/view/organigramme/entite-administrative-type/list',
    '/admin/view/organigramme/entite-administrative/list',
    '/admin/view/referentiel-partage/etat-utilisateur/list',
    '/admin/view/referentiel-partage/groupe/list',
    '/admin/view/organigramme/utilisateur/list',
    '/admin/view/referentiel-doc/document-type/list',
    '/admin/view/referentiel-doc/document-categorie/list',
    '/admin/view/referentiel-doc/document-state/list',
    '/admin/view/referentiel-doc/index-element/list',
    '/admin/view/certificats/certificatList',
    '/admin/view/certificats/usersList',
    '/plan-models',
    '/plan-index',
    '/bureau-ordre-etablissements',
    '/bureau-ordre-actions',
    '/bureau-ordre-registres',
    '/Audit',
    '/Echantillonnage',
    '/Validation',
    '/plan-classement',
    '/text-editor',
    '/Archive',
    '/Archive-final',
    '/bureau-ordre-mesCourriels',
    '/bureau-ordre-calendar',
    '/bureau-ordre-analytics',
    '/bureau-ordre-courriels',
    '/parapheur',
    '/Corbeille',
    '/workflowDashboard',
    '/workflow-parapheur-dashboard',
    '/workflow',
    '/admin/view/workflow/workflowList',
    '/admin/view/workflow/mesTaches',
    '/AuditWorkflow',
    '/workflowPreset'
  ]
  ,
}

const hasPathAccess = (roles: string[], path: string): boolean => {

  let hasAccess = false;
  roles.forEach(role => {
    if ((Roles.includes(role)) && pathsPerRole[role as keyof typeof pathsPerRole].includes(path)) {
      hasAccess = true;
    }
  });
  return hasAccess;
}


export function middleware(request: NextRequest) {

  // const token = request.cookies.get('token')?.value;
  // if (token) {
  //   const response = NextResponse.redirect(new URL('/auth', request.url));
  //   response.cookies.delete('token');
  //   response.cookies.delete('roleConnectedUser');
  //   return response;
  // }

  const { pathname } = request.nextUrl
  const role = request.cookies.get('roleConnectedUser')?.value;

  if (role && hasPathAccess([role], pathname)) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/AccessDenied', request.url));
  }

}