import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentCustomerModule } from '../compoents-customer-module/component-customer.modules';
import { ComponentModule } from '../components-module/component.modules';
import { DungThanhToanMTMNComponent } from './components/dung-thanh-toan-mtmn/dung-thanh-toan-mtmn.component';


const routes: Routes = [
    { path: 'DungThanhToanMTMN', component: DungThanhToanMTMNComponent }
];

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DungThanhToanMTMNComponent
    ],
    exports: [
        DungThanhToanMTMNComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    entryComponents: [
    ],
    bootstrap: []
})
export class ThuTienChamNoModule {

}
