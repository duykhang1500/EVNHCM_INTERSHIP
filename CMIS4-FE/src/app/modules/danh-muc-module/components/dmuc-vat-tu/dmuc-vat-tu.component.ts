import { API_DANH_MUC } from "./../../../../services/apiURL";
import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import {
    iComponentBase,
    iServiceBase,
    mType,
} from "src/app/modules/compoents-customer-module/components-customer";
import * as API from "src/app/services/apiURL";
import { map } from "rxjs/operators";
import { Material } from "../../models/dmuc-vat-tu/vat-tu.model";

@Component({
    selector: "app-dmuc-vat-tu",
    templateUrl: "./dmuc-vat-tu.component.html",
    styleUrls: ["./dmuc-vat-tu.component.scss"],
})
export class DanhMucVatTuComponent implements OnInit {
    dialogTitle: String;
    materialDialog: boolean;
    disable: boolean;
    isEdit: boolean;
    materials: Material[];
    material: Material = {};
    status: any;

    constructor(
        private serviceBase: iServiceBase,
        private confirmationService: ConfirmationService,
        public messageService: MessageService
    ) {
        this.status = [
            { name: "Kích hoạt", status: 1 },
            { name: "Đã hủy", status: 0 },
        ];
    }

    async ngOnInit(): Promise<void> {
        await this.getMaterialList();
    }

    async getMaterialList() {
        this.materials = await this.serviceBase.getMaterialList();
    }

    openNew() {
        this.material = {};
        this.dialogTitle = "Thêm vật tư";
        this.materialDialog = true;
    }

    hideDialog() {
        this.materialDialog = false;
        this.isEdit = false;
        this.disable = false;
        this.material = {};
    }

    editMaterial(material: Material) {
        this.isEdit = true;
        this.material = { ...material };
        this.dialogTitle = `Chỉnh sửa vật tư ${material.ten}`;
        this.disable = true;
        this.materialDialog = true;
    }

    saveMaterial() {
        if (this.isEdit) {
            const material = { ...this.material };
            this.serviceBase.updateMaterial(this.material).subscribe(
                (res) => {
                    if (res) {
                        const index = this.materials.findIndex(
                            (val) => val.maVt === material.maVt
                        );
                        this.materials[index] = material;
                        this.messageService.add({
                            severity: "success",
                            summary: "Thành công!",
                            detail: `Cập nhật vật tư ${material.ten}`,
                        });
                        this.hideDialog();
                    }
                },
                (err) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Có lỗi xảy ra!",
                        detail: "Cập nhật thất bại",
                    });
                }
            );
        } else {
            const material = { ...this.material, trangThai: 1 };

            this.serviceBase.createMaterial(material).subscribe(
                (res) => {
                    if (res) {
                        this.materials.push(material);
                        this.messageService.add({
                            severity: "success",
                            summary: "Thành công!",
                            detail: `Tạo mới vật tư ${material.ten}`,
                        });
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Có lỗi xảy ra!",
                            detail: "Tạo mới thất bại",
                        });
                    }
                },
                (err) => {
                    console.log("Tạo mới thất bại", err);
                    this.messageService.add({
                        severity: "error",
                        summary: "Có lỗi xảy ra!",
                        detail: "Tạo mới thất bại",
                    });
                }
            );
        }
        this.hideDialog();
    }

    deleteMaterial(material: Material) {
        this.confirmationService.confirm({
            message: "Anh/Chị có chắc chắn xóa " + material.ten + "?",
            header: "Xóa vật tư",
            icon: "pi pi-info-circle",
            accept: () => {
                this.serviceBase.deleteMaterial(material).subscribe(
                    () => {
                        this.materials = this.materials.filter(
                            (val) => val.maVt !== material.maVt
                        );
                        this.messageService.add({
                            severity: "success",
                            summary: "Thành công!",
                            detail: `Đẫ xóa vật tư ${material.ten}`,
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
