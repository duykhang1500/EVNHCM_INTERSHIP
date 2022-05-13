import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentCustomerModule } from '../compoents-customer-module/component-customer.modules';
import { ComponentModule } from '../components-module/component.modules';


const routes: Routes = [
];

@NgModule({
    imports: [
        ComponentModule,
        ComponentCustomerModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    entryComponents: [
    ],
    bootstrap: []
})
export class HoaDonPhatSinhModule {

}
