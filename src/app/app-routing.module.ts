import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingGuardGuard } from './services/routing-guard.guard';

import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TagsComponent } from './components/tags/tags.component';
import { TemplateComponent } from './components/template/template.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TagComponent } from './components/tag/tag.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { SentFriendRequestComponent } from './components/sent-friend-request/sent-friend-request.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', redirectTo: '', pathMatch: 'full' },
	{ path: 'forgotPassword', component: ForgotPasswordComponent },
	{ path: 'resetPassword/:key', component: ResetPasswordComponent },
	// { path: 'tags', component: TagsComponent, canActivate: [RoutingGuardGuard] },
	// { path: 'templates', component: TemplateComponent, canActivate: [RoutingGuardGuard] },
	// { path: 'contacts', component: ContactsComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [RoutingGuardGuard] },
	
	{ path: 'dashboard', component: TagComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'templates', component: TemplatesComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'sent-friend-request', component: SentFriendRequestComponent, canActivate: [RoutingGuardGuard] }
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
