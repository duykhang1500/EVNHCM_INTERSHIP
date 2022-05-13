import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ComponentCustomerModule } from "../compoents-customer-module/component-customer.modules";
import { ComponentModule } from "../components-module/component.modules";

import { DanhMucVatTuComponent } from "./components/dmuc-vat-tu/dmuc-vat-tu.component";
import { DmucNhanCongComponent } from "./components/dmuc-nhan-cong/dmuc-nhan-cong.component";
import { DmucVanChuyenComponent } from "./components/dmuc-van-chuyen/dmuc-van-chuyen.component";
import { DmucChiPhiKhaoSatComponent } from "./components/dmuc-chi-phi-khao-sat/dmuc-chi-phi-khao-sat.component";

const routes: Routes = [
    {
        path: "DMVatTu",
        component: DanhMucVatTuComponent,
    },
    {
        path: "DMNhanCong",
        component: DmucNhanCongComponent,
    },
    {
        path: "DMVanChuyen",
        component: DmucVanChuyenComponent,
    },
    {
        path: "DMChiPhiKhaoSat",
        component: DmucChiPhiKhaoSatComponent,
    },
];

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DanhMucVatTuComponent,
        DmucNhanCongComponent,
        DmucVanChuyenComponent,
        DmucChiPhiKhaoSatComponent,
    ],
    exports: [
        DanhMucVatTuComponent,
        DmucNhanCongComponent,
        DmucVanChuyenComponent,
    ],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
    entryComponents: [],
    bootstrap: [],
})
export class DanhMucModule {}
