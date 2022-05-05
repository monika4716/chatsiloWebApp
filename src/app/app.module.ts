import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

/* THIRD PARTY LIBRARY */
import { NgxSpinnerModule } from "ngx-spinner";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CookieService } from 'ngx-cookie-service';
import {TableModule} from 'primeng/table';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {MessagesModule} from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from 'primeng/menu';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {DataViewModule} from 'primeng/dataview';
import {ToastModule} from 'primeng/toast';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ScrollPanelModule} from 'primeng/scrollpanel';

/* SERVICES */
import { RoutingGuardGuard } from './services/routing-guard.guard';
import { SharedService } from './services/shared.service';
/* COMPONENTS */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HeaderBeforeLoginComponent } from './components/header-before-login/header-before-login.component';
import { HeaderAfterLoginComponent } from './components/header-after-login/header-after-login.component';
import { FooterBeforeLoginComponent } from './components/footer-before-login/footer-before-login.component';
import { TagsComponent } from './components/tags/tags.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TemplateComponent } from './components/template/template.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CsvImportComponent } from './components/csv-import/csv-import.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { TagComponent } from './components/tag/tag.component';
import { SentFriendRequestComponent } from './components/sent-friend-request/sent-friend-request.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HeaderBeforeLoginComponent,
    HeaderAfterLoginComponent,
    FooterBeforeLoginComponent,
    TemplateComponent,
    TagsComponent,
    SideBarComponent,
    ContactsComponent,
    CsvImportComponent,
    ProfileComponent,
    DashboardComponent,
    SidebarComponent,
    TemplatesComponent,
    TagComponent,
    SentFriendRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    TableModule,
    VirtualScrollerModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    DropdownModule,
    ProgressBarModule,
    FileUploadModule,
    TabViewModule,
    PanelModule,
    MenuModule,
    TooltipModule,
    ButtonModule,
    DataViewModule,
    ToastModule,
    ColorPickerModule,
    ScrollPanelModule
  ],
  providers: [RoutingGuardGuard,CookieService,ContactsComponent,TagsComponent,SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
