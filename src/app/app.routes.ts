import { AdminIntervention } from './components/admin/admin-intervention/admin-intervention';
import { Routes } from '@angular/router';
import { AdminSecurite } from './components/admin/admin-securite/admin-securite';
import { AdminAnalyse } from './components/admin/admin-analyse/admin-analyse';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { DashboardCitoyen } from './components/citoyen/dashboard-citoyen/dashboard-citoyen';
import { Connexion } from './components/citoyen/auth/connexion/connexion';
import { InscriptionComponent } from './components/citoyen/auth/inscription/inscription-component/inscription-component';
import { MesSignalement } from './components/citoyen/signalement/mes-signalement/mes-signalement';
import { SignalerProbleme } from './components/citoyen/signalement/signaler-probleme/signaler-probleme';
import { SignalementSuccess } from './components/citoyen/signalement/signalement-success/signalement-success';
import { GestionSignalement } from './components/admin/gestion-signalement/gestion-signalement';
import { Layout } from './components/admin/layout/layout';
import { LoginAdmin } from './components/admin/login-admin/login-admin';
import { ListeSignalement } from './components/agent/liste-signalement/liste-signalement';
import { SignalementDetails } from './components/agent/signalement-details/signalement-details';
import { SignalementMap } from './components/agent/signalement-map/signalement-map';
import { SignalementDetailAdmin } from './components/admin/signalement-detail-admin/signalement-detail-admin';
import { authGuard, authGuardAdmin } from './guards/auth.guard';
import { roleGuard, roleGuardAdmin } from './guards/role.guard';
import { ListeIntervention } from './components/agent/liste-intervention/liste-intervention';
import { DetailSignalement } from './components/citoyen/detail-signalement/detail-signalement';
import { Profil } from './components/admin/profil/profil';
import { ProfilUtilisateur } from './components/profil-utilisateur/profil-utilisateur';
import { AdminAgentProfil } from './components/admin/admin-agent-profil/admin-agent-profil';

export const routes: Routes = [

  // ESPACE CITOYEN
  {path: '', component: DashboardCitoyen},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'connexion', component: Connexion},
  {path: 'signaler-probleme', component: SignalerProbleme},
  {path: 'signalement-success', component: SignalementSuccess},
  {path: 'signalements', component: MesSignalement,
    canActivate: [authGuard, roleGuard], data: { roles: ['citoyen']
  }},
  {path: 'signalements/detail/:id', component: DetailSignalement,
    canActivate: [authGuard, roleGuard], data: { roles: ['citoyen']
  }},

  {path: 'profil', component: ProfilUtilisateur,
    canActivate: [authGuard, roleGuard], data: { roles: ['citoyen', 'agent']}
  },
  //ESPACE AGENT
  {path: 'agent/dashboard', component: ListeSignalement,
    canActivate: [authGuard, roleGuard], data: { roles: ['agent']}
  },
  {path: 'agent/signalements/:id', component: SignalementDetails,
    canActivate: [authGuard, roleGuard], data: { roles: ['agent']}
  },
  {path: 'agent/interventions', component: ListeIntervention,
    canActivate: [authGuard, roleGuard], data: { roles: ['agent']}
  },
  {path: 'agent/signalements/map', component: SignalementMap,
    canActivate: [authGuard, roleGuard], data: { roles: ['agent']}
  },

  // ESPACE ADMIN
  {path: 'admin/login', component: LoginAdmin},

  {
    path: 'admin', component: Layout,
    children: [
      { path: 'signalements/detail/:id', component: SignalementDetailAdmin},
      { path: 'dashboard', component: Dashboard,
         canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
       },
      { path: 'signalements', component: GestionSignalement,
         canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      { path: 'admin-intervention', component: AdminIntervention,
        // canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      { path: 'signalements/detail', component: SignalementDetailAdmin,
         canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      { path: 'statistiques', component: AdminAnalyse,
         canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      { path: 'parametres', component: AdminSecurite,
         canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      {path: 'profil', component: Profil,
        canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      },
      {path: 'profil-agent', component: AdminAgentProfil,
        canActivate: [authGuardAdmin, roleGuardAdmin], data: { roles: ['admin']}
      }
    ],
  },

  // fallback: redirige vers l'accueil si la route n'existe pas
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
