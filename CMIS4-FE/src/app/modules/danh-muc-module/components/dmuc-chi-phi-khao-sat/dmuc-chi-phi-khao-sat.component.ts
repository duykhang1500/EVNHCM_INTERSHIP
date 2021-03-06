import { BadgeModule } from "primeng/badge";
import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import {
    ConfirmationService,
    ConfirmEventType,
    MessageService,
} from "primeng/api";

import { iServiceBase } from "src/app/modules/compoents-customer-module/components-customer";
import { SurveyCost } from "../../models/dmuc-chi-phi-khao-sat/chi-phi";

@Component({
    selector: "app-dmuc-chi-phi-khao-sat",
    templateUrl: "./dmuc-chi-phi-khao-sat.component.html",
    styleUrls: ["./dmuc-chi-phi-khao-sat.component.scss"],
    providers: [ConfirmationService, MessageService],
})
export class DmucChiPhiKhaoSatComponent implements OnInit {
    list: any = [];

    displayModalAdd: boolean = false;
    displayModalEdit: boolean = false;

    position: string;
    selectedItem: SurveyCost = {};

    submitted: boolean;

    maDonViQuanLy: string;
    maChiPhiKhaoSat!: string;
    tenChiPhiKhaoSat!: string;
    donViTinh!: string;
    chiPhiKhaoSat!: number;
    heSoKhaoSat!: number;
    nguoiTao: string = "Khang";

    constructor(
        private serviceBase: iServiceBase,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    async ngOnInit(): Promise<void> {
        await this.getList();
    }

    async getList() {
        this.list = await this.serviceBase.getDataAPI("getAll");
    }

    showModalAdd() {
        this.displayModalAdd = true;
    }

    closeModalDialog() {
        this.submitted = false;
        this.displayModalAdd = false;
        this.resetForm();
    }

    showModalEdit() {
        this.displayModalEdit = !this.displayModalEdit;
    }

    resetForm() {
        this.displayModalAdd = false;
        this.maDonViQuanLy = "";
        this.maChiPhiKhaoSat = "";
        this.tenChiPhiKhaoSat = "";
        this.donViTinh = "";
        this.chiPhiKhaoSat = null;
        this.heSoKhaoSat = null;
    }

    //============================================ Fn ===============================================
    handleCreate(): any {
        // this.submitted = true;
        if (
            this.maDonViQuanLy &&
            this.maChiPhiKhaoSat &&
            this.tenChiPhiKhaoSat &&
            this.donViTinh &&
            this.chiPhiKhaoSat &&
            this.heSoKhaoSat
        ) {
            let currDate = new Date();
            let formData = {
                maDviqly: this.maDonViQuanLy,
                maCphiKsat: this.maChiPhiKhaoSat,
                tenCphiKsat: this.tenChiPhiKhaoSat,
                dvt: this.donViTinh,
                cphiKsat: this.chiPhiKhaoSat,
                heSoKsat: this.heSoKhaoSat,
                nguoiTao: this.nguoiTao,
                ngayTao: currDate.toISOString().split("T")[0],
                trangThai: 1,
            };
            this.serviceBase.postDataAPI("create", formData).subscribe(
                (res) => {
                    if (res === true) {
                        this.list.unshift(formData);
                        this.messageService.add({
                            severity: "success",
                            summary: "Th??nh c??ng!",
                            detail: `Chi ph?? kh???o s??t ${this.tenChiPhiKhaoSat} ???? ???????c t???o!`,
                        });
                        this.resetForm();
                        this.submitted = false;
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Th???t b???i!",
                            detail: "C?? l???i x???y ra khi t???o chi ph??!",
                        });
                    }
                },
                (err) => {
                    console.log("Failed to add new!", err);
                    this.messageService.add({
                        severity: "error",
                        summary: "Th???t b???i!",
                        detail: "C?? l???i x???y ra khi t???o chi ph??!",
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: "error",
                summary: "Th???t b???i!",
                detail: "Vui l??ng nh???p ????? th??ng tin!",
            });
        }
    }

    //select item for edit
    setSelected(item) {
        this.submitted = true;
        this.selectedItem = { ...item };
        this.displayModalEdit = true;
        console.log("Item selected for edit: ", this.selectedItem);
    }

    handleUpdate() {
        this.submitted = true;
        if (
            this.selectedItem.cphiKsat &&
            this.selectedItem.maDviqly &&
            this.selectedItem.tenCphiKsat &&
            this.selectedItem.heSoKsat &&
            this.selectedItem.trangThai &&
            this.selectedItem.dvt
        ) {
            let currDate = new Date();
            this.selectedItem.ngaySua = currDate.toISOString().split("T")[0];
            this.selectedItem.nguoiSua = "Khang";
            this.serviceBase
                .updateAPI(this.selectedItem.maCphiKsat, this.selectedItem)
                .subscribe(
                    (res) => {
                        console.log("Update th??nh c??ng: ", res);
                        this.displayModalEdit = false;
                        const index = this.list.findIndex(
                            (item) =>
                                item.maCphiKsat === this.selectedItem.maCphiKsat
                        );
                        this.list[index] = this.selectedItem;
                        this.messageService.add({
                            severity: "success",
                            summary: "Th??nh c??ng!",
                            detail: `C???p nh???t th??ng tin th??nh c??ng!`,
                        });
                    },
                    (err) => {
                        console.log("Update th???t b???i!: ", err);
                    }
                );
            this.submitted = false;
        } else {
            this.messageService.add({
                severity: "error",
                summary: "Th???t b???i!",
                detail: "Vui l??ng nh???p ????? th??ng tin!",
            });
        }
    }

    handleDelete(id, name) {
        console.log("Delete ID: ", id, name);
        this.confirmationService.confirm({
            message: `B???n c?? ch???c ch???n x??a chi ph?? ${name}`,
            header: `X??a chi ph??`,
            icon: "pi pi-info-circle",
            accept: () => {
                this.serviceBase.deleteAPI(id).subscribe(
                    () => {
                        this.list = this.list.filter(
                            (item) => item.maCphiKsat != id
                        );
                        this.messageService.add({
                            severity: "success",
                            summary: "Th??nh c??ng!",
                            detail: `????? x??a chi ph?? ${name}`,
                        });
                    },
                    (err) => {
                        console.log("X??a th???t b???i", err);
                        this.messageService.add({
                            severity: "error",
                            summary: "C?? l???i x???y ra!",
                            detail: "X??a th???t b???i",
                        });
                    }
                );
            },
            reject: () => {},
        });
    }
}
