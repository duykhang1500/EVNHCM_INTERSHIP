import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppMainComponent } from "./app.main.component";
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
import {
    LoginComponent,
    SettingUserComponent,
} from "./modules/quan-tri-he-thong-module/quan-tri-he-thong";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppCalendarComponent } from "./pages/app.calendar.component";
import { AppContactusComponent } from "./pages/app.contactus.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { AppInvoiceComponent } from "./pages/app.invoice.component";
import { AppLandingComponent } from "./pages/app.landing.component";
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

const routes: Routes = [
    {
        path: "",
        redirectTo: "/Home",
        pathMatch: "full",
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "Home",
        component: AppMainComponent,
        children: [
            { path: "", component: DashboardComponent },
            {
                path: "favorites/dashboardanalytics",
                component: DashboardAnalyticsComponent,
            },
            { path: "uikit/formlayout", component: FormLayoutDemoComponent },
            { path: "uikit/floatlabel", component: FloatLabelDemoComponent },
            {
                path: "uikit/invalidstate",
                component: InvalidStateDemoComponent,
            },
            { path: "uikit/input", component: InputDemoComponent },
            { path: "uikit/button", component: ButtonDemoComponent },
            { path: "uikit/table", component: TableDemoComponent },
            { path: "uikit/list", component: ListDemoComponent },
            { path: "uikit/tree", component: TreeDemoComponent },
            { path: "uikit/panel", component: PanelsDemoComponent },
            { path: "uikit/overlay", component: OverlaysDemoComponent },
            { path: "uikit/menu", component: MenusDemoComponent },
            { path: "uikit/media", component: MediaDemoComponent },
            { path: "uikit/message", component: MessagesDemoComponent },
            { path: "uikit/misc", component: MiscDemoComponent },
            { path: "uikit/charts", component: ChartsDemoComponent },
            { path: "uikit/file", component: FileDemoComponent },
            { path: "utilities/display", component: DisplayComponent },
            { path: "utilities/elevation", component: ElevationComponent },
            { path: "utilities/flexbox", component: FlexboxComponent },
            { path: "utilities/grid", component: GridComponent },
            { path: "utilities/icons", component: IconsComponent },
            { path: "utilities/widgets", component: WidgetsComponent },
            { path: "utilities/spacing", component: SpacingComponent },
            { path: "utilities/typography", component: TypographyComponent },
            { path: "utilities/text", component: TextComponent },
            { path: "pages/crud", component: AppCrudComponent },
            { path: "pages/calendar", component: AppCalendarComponent },
            { path: "pages/timeline", component: AppTimelineDemoComponent },
            { path: "pages/invoice", component: AppInvoiceComponent },
            { path: "pages/help", component: AppHelpComponent },
            { path: "pages/empty", component: EmptyDemoComponent },
            { path: "documentation", component: DocumentationComponent },

            //B??n l??? ??i???n n??ng module
            {
                path: "BLeDNang",
                loadChildren: () =>
                    import(
                        "./modules/ban-le-dien-nang-module/ban-le-dien-nang.module"
                    ).then((m) => m.BanLeDienNangModule),
            },
            //B??o c??o th??ng module
            {
                path: "BCaoThang",
                loadChildren: () =>
                    import(
                        "./modules/bao-cao-thang-module/bao-cao-thang.module"
                    ).then((m) => m.BaoCaoThangModule),
            },
            //Bi???n ?????ng thi???t b??? module
            {
                path: "BDongTBi",
                loadChildren: () =>
                    import(
                        "./modules/bien-dong-thiet-bi-module/bien-dong-thiet-bi.module"
                    ).then((m) => m.BienDongThietBiModule),
            },
            //Bi???n ?????ng treo th??o module
            {
                path: "BDongTrThao",
                loadChildren: () =>
                    import(
                        "./modules/bien-dong-treo-thao-module/bien-dong-treo-thao.module"
                    ).then((m) => m.BienDongTreoThaoModule),
            },
            //Ch??? s??? kh??ch h??ng module
            {
                path: "ChiSoKHang",
                loadChildren: () =>
                    import(
                        "./modules/chi-so-khach-hang-module/chi-so-khach-hang.module"
                    ).then((m) => m.ChiSoKhachHangModule),
            },
            //Ch??? s??? t???n th???t module
            {
                path: "ChiSoTThat",
                loadChildren: () =>
                    import(
                        "./modules/chi-so-ton-that-module/chi-so-ton-that.module"
                    ).then((m) => m.ChiSoTonThatModule),
            },
            //C??y t???n th???t module
            {
                path: "CayTonThat",
                loadChildren: () =>
                    import(
                        "./modules/cay-ton-that-module/cay-ton-that.module"
                    ).then((m) => m.CayTonThatModule),
            },
            //Danh m???c module
            {
                path: "DanhMuc",
                loadChildren: () =>
                    import("./modules/danh-muc-module/danh-muc.module").then(
                        (m) => m.DanhMucModule
                    ),
            },
            //D???ch v??? module
            {
                path: "DichVu",
                loadChildren: () =>
                    import("./modules/dich-vu-module/dich-vu.module").then(
                        (m) => m.DichVuModule
                    ),
            },
            //??i???n n??ng th??n module
            {
                path: "DienNongThon",
                loadChildren: () =>
                    import(
                        "./modules/dien-nong-thon-module/dien-nong-thon.module"
                    ).then((m) => m.DienNongThonModule),
            },
            //Email SMS module
            {
                path: "EmailSMS",
                loadChildren: () =>
                    import("./modules/email-sms-module/email-sms.module").then(
                        (m) => m.EmailSMSModule
                    ),
            },
            //H??? s?? thi???t b??? module
            {
                path: "HSoTBi",
                loadChildren: () =>
                    import(
                        "./modules/ho-so-thiet-bi-module/ho-so-thiet-bi.module"
                    ).then((m) => m.HoSoThietBiModule),
            },
            //H??a ????n ??i???u ch???nh module
            {
                path: "HDonDChinh",
                loadChildren: () =>
                    import(
                        "./modules/hoa-don-dieu-chinh-module/hoa-don-dieu-chinh.module"
                    ).then((m) => m.HoaDonDieuChinhModule),
            },
            //H??a ????n ph??t sinh module
            {
                path: "HDonPSinh",
                loadChildren: () =>
                    import(
                        "./modules/hoa-don-phat-sinh-module/hoa-don-phat-sinh.module"
                    ).then((m) => m.HoaDonPhatSinhModule),
            },
            //H???p ?????ng module
            {
                path: "HopDong",
                loadChildren: () =>
                    import("./modules/hop-dong-module/hop-dong.module").then(
                        (m) => m.HopDongModule
                    ),
            },
            //Ki???m tra gi??m s??t module
            {
                path: "KTraGSat",
                loadChildren: () =>
                    import(
                        "./modules/kiem-tra-giam-sat-module/kiem-tra-giam-sat.module"
                    ).then((m) => m.KiemTraGiamSatModule),
            },
            //N??? kh?? ????i module
            {
                path: "NoKhoDoi",
                loadChildren: () =>
                    import(
                        "./modules/no-kho-doi-module/no-kho-doi.module"
                    ).then((m) => m.NoKhoDoiModule),
            },
            //Qu???n tr??? h??? th???ng module
            {
                path: "QTriHThong",
                loadChildren: () =>
                    import(
                        "./modules/quan-tri-he-thong-module/quan-tri-he-thong.module"
                    ).then((m) => m.QuanTriHeThongModule),
            },
            //Thu ti???n ch???m n??? module
            {
                path: "TTienCNo",
                loadChildren: () =>
                    import(
                        "./modules/thu-tien-cham-no-module/thu-tien-cham-no.module"
                    ).then((m) => m.ThuTienChamNoModule),
            },

            { path: "SettingUser", component: SettingUserComponent },
        ],
    },
    { path: "error", component: AppErrorComponent },
    { path: "access", component: AppAccessdeniedComponent },
    { path: "notfound", component: AppNotfoundComponent },
    { path: "contactus", component: AppContactusComponent },
    { path: "landing", component: AppLandingComponent },
    { path: "pages/wizard", component: AppWizardComponent },
    { path: "**", redirectTo: "/notfound" },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: "enabled",
            useHash: true,
        }),
    ],
    exports: [],
})
export class AppRoutingModule {}
