import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";

import {
    iComponentBase,
    iServiceBase,
    mType,
} from "src/app/modules/compoents-customer-module/components-customer";
import * as API from "src/app/services/apiURL";
import { map } from "rxjs/operators";
import { nhancong } from "../../models/dmuc-nhan-cong/nhan-cong.model";

@Component({
    selector: "app-dmuc-nhan-cong",
    templateUrl: "./dmuc-nhan-cong.component.html",
    styleUrls: ["./dmuc-nhan-cong.component.scss"],
    styles: [
        `
            :host ::ng-deep .p-dialog .product-image {
                width: 150px;
                margin: 0 auto 2rem auto;
                display: block;
            }
        `,
    ],
    providers: [MessageService, ConfirmationService],
})
export class DmucNhanCongComponent implements OnInit {
    statuses: any[];
    sMaDvi: string;
    nhancong: nhancong;
    submitted: boolean;
    limit: number = 10;
    productDialog: boolean;
    dataNhancong: nhancong[];
    searchString: string = "";
    selectedProducts: nhancong[];
    listDataNhanCong: nhancong[];
    constructor(
        private serviceBase: iServiceBase,
        private confirmationService: ConfirmationService,
        public msg: MessageService
    ) {}

    async ngOnInit(): Promise<void> {
        //this.sMaDvi = this.getUserInformation()[0].SUBDIVISIONID;
        await this.loadDataTableByDonVi();
        this.listDataNhanCong = this.dataNhancong;
    }

    openNew() {
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(nhancong: nhancong) {
        this.nhancong = { ...nhancong };
        this.productDialog = true;
    }

    deleteProduct(nhancong: nhancong) {
        this.confirmationService.confirm({
            message: "Anh chị có chắc xóa " + nhancong.tenVtu + "?",
            header: "Confirm",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.dataNhancong = this.dataNhancong.filter(
                    (val) => val.maVtu !== nhancong.maVtu
                );
                this.listDataNhanCong = this.listDataNhanCong.filter(
                    (val) => val.maVtu !== nhancong.maVtu
                );

                this.msg.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Xóa thành công ${nhancong.tenVtu}`,
                    life: 1500,
                });
            },
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    async loadDataTableByDonVi() {
        let param = {
            MA_DVIQLY: "PE1400",
        };
        this.dataNhancong = await this.serviceBase.getData_AsyncByPostRequest(
            API.PHAN_HE.DANHMUC,
            API.API_DANH_MUC.GET_NHANCONG_BY_DONVI,
            param
        );
    }

    handleChange(string: string) {
        this.dataNhancong = this.listDataNhanCong.filter((val: any) => {
            return (
                val.maVtu.toLowerCase().includes(string.toLowerCase()) ||
                val.tenVtu.toLowerCase().includes(string.toLowerCase())
            );
        });
    }
}
