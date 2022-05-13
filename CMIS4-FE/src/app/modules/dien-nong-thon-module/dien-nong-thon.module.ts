import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentCustomerModule } from '../compoents-customer-module/component-customer.modules';
import { ComponentModule } from '../components-module/component.modules';
import { TiepNhanYcauComponent } from './components/tiep-nhan-ycau/tiep-nhan-ycau.component';

@NgModule({
    imports: [
        ComponentModule,
        ReactiveFormsModule,
        ComponentCustomerModule
    ],
    declarations: [
        TiepNhanYcauComponent,
    ],
    exports: [
        TiepNhanYcauComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    entryComponents: [
    ],
    bootstrap: []
})
export class DienNongThonModule {
    constructor(private injector: Injector) {
    }
}
