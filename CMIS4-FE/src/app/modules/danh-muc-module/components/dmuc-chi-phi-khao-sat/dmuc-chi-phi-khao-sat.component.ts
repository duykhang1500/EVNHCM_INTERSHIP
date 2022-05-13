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
                            summary: "Thành công!",
                            detail: `Chi phí khảo sát ${this.tenChiPhiKhaoSat} đã được tạo!`,
                        });
                        this.resetForm();
                        this.submitted = false;
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Thất bại!",
                            detail: "Có lỗi xảy ra khi tạo chi phí!",
                        });
                    }
                },
                (err) => {
                    console.log("Failed to add new!", err);
                    this.messageService.add({
                        severity: "error",
                        summary: "Thất bại!",
                        detail: "Có lỗi xảy ra khi tạo chi phí!",
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: "error",
                summary: "Thất bại!",
                detail: "Vui lòng nhập đủ thông tin!",
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
                        console.log("Update thành công: ", res);
                        this.displayModalEdit = false;
                        const index = this.list.findIndex(
                            (item) =>
                                item.maCphiKsat === this.selectedItem.maCphiKsat
                        );
                        this.list[index] = this.selectedItem;
                        this.messageService.add({
                            severity: "success",
                            summary: "Thành công!",
                            detail: `Cập nhật thông tin thành công!`,
                        });
                    },
                    (err) => {
                        console.log("Update thất bại!: ", err);
                    }
                );
            this.submitted = false;
        } else {
            this.messageService.add({
                severity: "error",
                summary: "Thất bại!",
                detail: "Vui lòng nhập đủ thông tin!",
            });
        }
    }

    handleDelete(id, name) {
        console.log("Delete ID: ", id, name);
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn xóa chi phí ${name}`,
            header: `Xóa chi phí`,
            icon: "pi pi-info-circle",
            accept: () => {
                this.serviceBase.deleteAPI(id).subscribe(
                    () => {
                        this.list = this.list.filter(
                            (item) => item.maCphiKsat != id
                        );
                        this.messageService.add({
                            severity: "success",
                            summary: "Thành công!",
                            detail: `Đẫ xóa chi phí ${name}`,
                        });
                    },
                    (err) => {
                        console.log("Xóa thất bại", err);
                        this.messageService.add({
                            severity: "error",
                            summary: "Có lỗi xảy ra!",
                            detail: "Xóa thất bại",
                        });
                    }
                );
            },
            reject: () => {},
        });
    }
}
