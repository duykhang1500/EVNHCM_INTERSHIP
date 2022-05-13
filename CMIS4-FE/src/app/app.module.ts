import {
    DatePipe,
    HashLocationStrategy,
    LocationStrategy,
} from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppBreadcrumbComponent } from "./app-systems/app-breadcrumb-component/app.breadcrumb.component";
import { AppBreadcrumbService } from "./app-systems/app-breadcrumb-component/app.breadcrumb.service";
import { AppCodeModule } from "./app-systems/app-code-component/app.code.component";
import { AppConfigComponent } from "./app-systems/app-config-component/app.config.component";
import { AppFooterComponent } from "./app-systems/app-footer-component/app.footer.component";
import { AppInlineMenuComponent } from "./app-systems/app-inlinemenu-component/app.inlinemenu.component";
import { AppMenuComponent } from "./app-systems/app-menu-component/app.menu.component";
import { MenuService } from "./app-systems/app-menu-component/app.menu.service";
import { AppMenuitemComponent } from "./app-systems/app-menuitem-component/app.menuitem.component";
import { AppRightMenuComponent } from "./app-systems/app-rightmenu-component/app.rightmenu.component";
import { AppTopBarComponent } from "./app-systems/app-topbar-component/app.topbar.component";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { CountryService } from "./demo/service/countryservice";
import { CustomerService } from "./demo/service/customerservice";
import { EventService } from "./demo/service/eventservice";
import { IconService } from "./demo/service/iconservice";
import { NodeService } from "./demo/service/nodeservice";
import { PhotoService } from "./demo/service/photoservice";
import { ProductService } from "./demo/service/productservice";
import { ButtonDemoComponent } from "./demo/view/buttondemo.component";
import { ChartsDemoComponent } from "./demo/view/chartsdemo.component";
import { DashboardComponent } from "./demo/view/dashboard.component";
import { DashboardAnalyticsComponent } from "./demo/view/dashboardanalytics.component";
import { DocumentationComponent } from "./demo/view/documentation.component";
import { EmptyDemoComponent } from "./demo/view/emptydemo.component";
import { FileDemoComponent } from "./demo/view/filedemo.component";
import { FloatLabelDemoComponent } from "./demo/view/floatlabeldemo.component";
import { FormLayoutDemoComponent } from "./demo/view/formlayoutdemo.component";
import { InputDemoComponent } from "./demo/view/inputdemo.component";
import { InvalidStateDemoComponent } from "./demo/view/invalidstatedemo.component";
import { ListDemoComponent } from "./demo/view/listdemo.component";
import { MediaDemoComponent } from "./demo/view/mediademo.component";
import { MenusDemoComponent } from "./demo/view/menusdemo.component";
import { MessagesDemoComponent } from "./demo/view/messagesdemo.component";
import { MiscDemoComponent } from "./demo/view/miscdemo.component";
import { OverlaysDemoComponent } from "./demo/view/overlaysdemo.component";
import { PanelsDemoComponent } from "./demo/view/panelsdemo.component";
import { TableDemoComponent } from "./demo/view/tabledemo.component";
import { TreeDemoComponent } from "./demo/view/treedemo.component";
import { ComponentCustomerModule } from "./modules/compoents-customer-module/component-customer.modules";
import { MyHttpInterceptor } from "./modules/compoents-customer-module/functions/MyHttpInterceptor";
import { ComponentModule } from "./modules/components-module/component.modules";
import { DienNongThonModule } from "./modules/dien-nong-thon-module/dien-nong-thon.module";
import { QuanTriHeThongModule } from "./modules/quan-tri-he-thong-module/quan-tri-he-thong.module";
import { ThuTienChamNoModule } from "./modules/thu-tien-cham-no-module/thu-tien-cham-no.module";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppCalendarComponent } from "./pages/app.calendar.component";
import { AppContactusComponent } from "./pages/app.contactus.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { AppInvoiceComponent } from "./pages/app.invoice.component";
import { AppLandingComponent } from "./pages/app.landing.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppTimelineDemoComponent } from "./pages/app.timelinedemo.component";
import { AppWizardComponent } from "./pages/app.wizard.component";
import { DisplayComponent } from "./utilities/display.component";
import { ElevationComponent } from "./utilities/elevation.component";
import { FlexboxComponent } from "./utilities/flexbox.component";
import { GridComponent } from "./utilities/grid.component";
import { IconsComponent } from "./utilities/icons.component";
import { SpacingComponent } from "./utilities/spacing.component";
import { TextComponent } from "./utilities/text.component";
import { TypographyComponent } from "./utilities/typography.component";
import { WidgetsComponent } from "./utilities/widgets.component";

import { DanhMucModule } from "./modules/danh-muc-module/danh-muc.module";

@NgModule({
    imports: [
        AppCodeModule,
        ComponentModule,
        ComponentCustomerModule,
        DienNongThonModule,
        QuanTriHeThongModule,
        ThuTienChamNoModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        DanhMucModule,
        FormsModule,
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppInlineMenuComponent,
        AppRightMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardComponent,
        DashboardAnalyticsComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        DisplayComponent,
        ElevationComponent,
        FlexboxComponent,
        GridComponent,
        IconsComponent,
        WidgetsComponent,
        SpacingComponent,
        TypographyComponent,
        TextComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppLoginComponent,
        AppLandingComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppTimelineDemoComponent,
        AppWizardComponent,
        AppContactusComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MenuService,
        AppBreadcrumbService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MyHttpInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
