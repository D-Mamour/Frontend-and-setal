import { Routes } from '@angular/router';
import { DashboardCitoyen } from './components/citoyen/dashboard-citoyen/dashboard-citoyen';
import { InscriptionComponent } from './components/citoyen/auth/inscription/inscription-component/inscription-component';
import { SignalerProbleme } from './components/citoyen/signalement/signaler-probleme/signaler-probleme';
import { SignalementSuccess } from './components/citoyen/signalement/signalement-success/signalement-success';
import { MesSignalement } from './components/citoyen/signalement/mes-signalement/mes-signalement';
import { Connexion } from './components/citoyen/auth/connexion/connexion';
import { LoginAdmin } from './components/admin/login-admin/login-admin';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { DashboardCitoyenConnecter } from './components/citoyen/dashboard-citoyen-connecter/dashboard-citoyen-connecter';
import { Layout } from './components/admin/layout/layout';
import { GestionSignalement } from './components/gestion-signalement/gestion-signalement';
import { AdminSecurite } from './components/admin-securite/admin-securite';
import {AdminAnalyse} from './components/admin-analyse/admin-analyse';

export const routes: Routes = [

  // ESPACE CITOYEN
  {path: '', component: DashboardCitoyen},
  {path: 'home', component: DashboardCitoyenConnecter},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'connexion', component: Connexion},
  {path: 'signaler-probleme', component: SignalerProbleme},
  {path: 'signalement-success', component: SignalementSuccess},
  {path: 'signalements', component: MesSignalement},
 
  // ESPACE ADMIN
  {path: 'admin/login', component: LoginAdmin},
  {path: 'gestion-signalement', component: GestionSignalement},
  {path: 'admin-securite', component: AdminSecurite},
  {path: 'admin-analyse', component: AdminAnalyse},

  {
    path: 'admin', component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
    ],
  },

];
