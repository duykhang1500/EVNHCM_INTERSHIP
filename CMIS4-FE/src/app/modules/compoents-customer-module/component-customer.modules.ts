import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppCodeModule } from "src/app/app-systems/app-code-component/app.code.component";
import { DSachDTuongComponent } from "./components/danh-sach-doi-tuong-component/dsach-dtuong.component";
import { LoadingComponent } from "./components/loading-component/loading.component";
import { TimKiemKhachHangComponent } from "./components/tim-kiem-khach-hang-component/tim-kiem-khach-hang.component";
import { iComponentBase } from "./functions/iComponentBase.component";
import { iServiceBase } from "./functions/iServiceBase";
import { NumberReplacerPipe } from "./pipes/customerNumber.pipe";
import { ShareData } from "./shared-data-services/sharedata.service";
import { ComponentModule } from '../components-module/component.modules';

@NgModule({
    imports: [
        ComponentModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        AppCodeModule
    ],
    providers: [
        ShareData, iServiceBase,
    ],
    declarations: [
        iComponentBase,
        LoadingComponent,
        DSachDTuongComponent,
        NumberReplacerPipe,
        TimKiemKhachHangComponent
    ],
    exports: [
        iComponentBase,
        LoadingComponent,
        DSachDTuongComponent,
        NumberReplacerPipe,
        TimKiemKhachHangComponent
    ],
})
export class ComponentCustomerModule {
}
