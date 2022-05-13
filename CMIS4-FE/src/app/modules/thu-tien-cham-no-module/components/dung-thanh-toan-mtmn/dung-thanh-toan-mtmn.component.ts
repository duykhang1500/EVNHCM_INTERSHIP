import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CN_DUNGTTOAN_MTMN } from '../../models/dung-thanh-toan-mtmn.model';
import * as moment from 'moment';
import * as API from 'src/app/services/apiURL';
import { Route, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppBreadcrumbService } from 'src/app/app-systems/app-breadcrumb-component/app.breadcrumb.service';
import { iComponentBase, iServiceBase, mType, VN_LOCAL } from 'src/app/modules/compoents-customer-module/components-customer';

@Component({
    selector: 'cmis-dung-thanh-toan-mtmn',
    templateUrl: './dung-thanh-toan-mtmn.component.html'
})
export class DungThanhToanMTMNComponent extends iComponentBase implements OnInit {
    maDVQL: any;
    userName: any;
    maChucNang: any = "-1";
    tenDVQL: any;
    lstDungTToanMTMN: CN_DUNGTTOAN_MTMN[] = [];
    dungTToanMTMNSelect: CN_DUNGTTOAN_MTMN;
    dungTToanMTMNThemMoi: CN_DUNGTTOAN_MTMN;
    dungTToanMTMNUpdate: CN_DUNGTTOAN_MTMN;
    dungTToanMTMN: CN_DUNGTTOAN_MTMN;
    disabledThemMoi: boolean = true;
    disabledKPhucTToan: boolean = true;
    disabledTiepTuc: boolean = true;
    disabledTKiemNCao: boolean = true;
    disabledCapNhat: boolean = true;
    disabledLyDoKhac: boolean = true;
    disabledUpdate: boolean = true;
    isLoading: boolean = false;
    showTKiemKHangNCao: boolean = false;
    maKHangTKiem: any = "";
    tenKHangInsert: any = "";
    height: number;
    width: number;
    lyDoDungTT: string;
    ngayDungTT: Date;
    lyDoDungKhac: string;
    csuatKTra: number = 0;
    bbanKTra: any;
    showDialogKPhuc: boolean = false;
    lyDoKPhuc: string = "0";
    ngayKPhuc: Date = new Date();
    isInsert: boolean = false;
    vn_local: any;
    routerChucNang: any;

    constructor(private confirmationService: ConfirmationService,
        private serviceBase: iServiceBase,
        private datePipe: DatePipe,
        public msg: MessageService,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private titleService: Title) {
        super(msg);
        this.breadcrumbService.setItems([
            { label: 'Điện mặt trời mái nhà' },
            { label: 'Cập nhật dừng thanh toán điện mặt trời', routerLink: ['/Home/DungThanhToanMTMN'] }
        ]);
        this.maDVQL = this.getUserInformation()[0].SUBDIVISIONID;
        this.userName = this.getUserInformation()[0].USERNAME.toString();
        // this.maChucNang = this.getMenuInfo()[0].libid.toString();
        this.maChucNang = "-1";
        this.tenDVQL = this.getUserInformation()[0].SUBDIVISIONNAME.toString();

        this.disabledThemMoi = false;
        this.height = 0;
        this.width = 0;
        this.vn_local = VN_LOCAL;
        this.dungTToanMTMN = new CN_DUNGTTOAN_MTMN();
        this.routerChucNang = this.router.url;
        this.titleService.setTitle("Cập nhật dừng thanh toán điện mặt trời");
    }

    ngOnInit() {
        //lấy danh sách khách hàng dừng thanh toán
        this.GetAllCNDungTToanMTMN();
    }

    async GetAllCNDungTToanMTMN() {
        try {
            this.lstDungTToanMTMN = [];

            let param = {
                MA_DVIQLY: this.maDVQL
            }

            this.isLoading = true;
            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.GET_ALLCNDUNGTTOAN_MTMN, param);
            this.isLoading = false;
            if (response && !response.TYPE) {
                this.lstDungTToanMTMN = response;

                //Xử lý lại tháng dừng
                this.lstDungTToanMTMN.forEach(item => {
                    let lstNgayDung = item.NGAY_DUNG.split("/");
                    item.NGAY_DUNG = lstNgayDung[1] + "/" + lstNgayDung[2];
                });
            } else {
                this.showMessage(mType.warn, "Thông báo", "Không có khách hàng dừng thanh toán");
            }
        } catch (error) {
            this.isLoading = false;
            this.showMessage(mType.error, "Thông báo", "Lỗi " + error);
        }
    }

    async GetHopDongMTAMDungTToan() {
        try {
            let param = {
                MA_KHANG: this.maKHangTKiem,
                MA_DVIQLY: this.maDVQL
            }
            this.isLoading = true;
            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.HOPDONG, API.API_HOP_DONG.GET_HOPDONG_MTAM_DUNGTTOAN, param);

            this.isLoading = false;
            if (response && response.TYPE) {
                this.disabledCapNhat = true;
                this.showMessage(mType.warn, "Thông báo", "Khách hàng không có Hợp đồng mặt trời mái nhà. Vui lòng tìm kiếm k.hàng MTMN" + response.MESSAGE);
            } else {
                this.disabledCapNhat = false;
                this.tenKHangInsert = response.TEN_KHANG;
                this.dungTToanMTMN.MA_KHANG = response.MA_KHANG;
                this.dungTToanMTMN.TEN_KHANG = response.TEN_KHANG;
                this.dungTToanMTMN.MA_DVIQLY = response.MA_DVIQLY;
                this.dungTToanMTMN.NGUOI_TAO = this.userName;
                this.dungTToanMTMN.NGUOI_SUA = this.userName;
                this.dungTToanMTMN.MA_CNANG = this.maChucNang;

                this.dungTToanMTMN.NGAY_KY = response.NGAY_KY;
                this.dungTToanMTMN.CONG_SUAT = response.CONG_SUAT;
                this.dungTToanMTMN.PHAN_LOAI = response.LOAI_KHANG == "0" ? "Khách hàng cá nhân" : "Khách hàng doanh nghiệp";
                this.dungTToanMTMN.DIA_CHI = response.SO_NHA ? response.SO_NHA + response.DUONG_PHO : response.DUONG_PHO;

                this.dungTToanMTMN.SAN_LUONG = response.SAN_LUONG
                this.dungTToanMTMN.SO_TIEN = response.SO_TIEN
                this.dungTToanMTMN.TIEN_GTGT = response.TIEN_GTGT
                this.dungTToanMTMN.TONG_TIEN = response.TONG_TIEN

                this.showMessage(mType.success, "Thông báo", "Tìm kiếm được k.hàng MTMN " + response.TEN_KHANG + " theo mã k.hàng " + this.maKHangTKiem);
                //Có HĐ mặt trời thì lấy thông tin mặt trời ra nào
                this.lyDoDungTT = "0";
                this.ngayDungTT = new Date();

                //Hàm này phải lấy hết thông tin ở lưới cần thiết và gán cho 
                this.dungTToanMTMNThemMoi = new CN_DUNGTTOAN_MTMN;
            }
        } catch (error) {
            this.isLoading = false;
            this.disabledCapNhat = true;
            this.showMessage(mType.error, "Thông báo", "Lỗi " + error);
        }
    }

    onSelectRowKHang(event) {
        if (this.disabledThemMoi && this.maKHangTKiem.trim() != "") {

        } else {
            this.disabledThemMoi = false;
            this.disabledTKiemNCao = true;
            this.disabledTiepTuc = true;
            this.disabledCapNhat = true;
        }

        this.disabledKPhucTToan = false;
        this.disabledUpdate = false;
    }

    onUnSelectRowKHang(event) {
        this.disabledThemMoi = false;
        this.disabledTKiemNCao = false;
        this.disabledTiepTuc = true;
        this.disabledCapNhat = true;

        this.disabledKPhucTToan = true;
        this.disabledUpdate = true;
    }

    onClickThemMoi() {
        this.isInsert = true;

        this.disabledTKiemNCao = false;
        this.disabledCapNhat = true;
        this.disabledKPhucTToan = true;
        this.disabledUpdate = true;
        this.disabledTiepTuc = true;
        this.disabledThemMoi = true;

        //clear form để tìm kiếm khách hàng
        this.dungTToanMTMN = new CN_DUNGTTOAN_MTMN;

        //Các thông tin ở dừng thanh toán
        this.ngayDungTT = new Date();
        this.csuatKTra = 0;
        this.bbanKTra = 0;
        this.lyDoDungTT = "0";
        this.lyDoDungKhac = "";
        this.maKHangTKiem = "";
    }

    onClickKPhucTToan() {
        this.showDialogKPhuc = true;

    }

    onDongYKPhuc() {
        this.showDialogKPhuc = false;
        this.KPhucDungTToanMTMN()

    }

    async KPhucDungTToanMTMN() {
        try {
            this.dungTToanMTMNSelect.LY_DO_KPHUC = this.lyDoKPhuc == "0" ? "Chủ đầu tư đã hoàn thành thủ tục" : "Do cập nhật nhầm";
            this.ngayKPhuc.setDate(1);
            this.dungTToanMTMNSelect.NGAY_KPHUC = this.datePipe.transform(this.ngayKPhuc, "dd/MM/yyyy");

            let param = {
                CN_DUNGTTOAN_MTMN: this.dungTToanMTMNSelect
            }

            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.KPHUC_CNDUNGTTOAN_MTMN, param);

            if (response && response.TYPE == "SUCCESS") {

                this.showMessage(mType.success, "Thông báo", "Khôi phục khách hàng dừng thanh toán MTMN thành công");

                //Lấy lại thông tin khách hàng dưới lưới
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Thông báo", "Khôi phục khách hàng dừng thanh toán MTMN không thành công. Lỗi " + response.MESSAGE);
            }
        } catch (error) {
            this.showMessage(mType.error, "Thông báo", "Lỗi " + error);
        }
    }

    onHuyBoKPhuc() {
        this.showDialogKPhuc = false;
    }

    onClickTKiemNCao() {
        this.showTKiemKHangNCao = true;
    }

    onEnterTKiemMaKHang(event) {
        if (event.keyCode == 13) {
            if (this.maKHangTKiem == "") {
                this.onClickTKiemNCao();
            } else {
                //Check xem Khách hàng đã dừng chưa
                if (this.CheckKHangDaDungTToanMTMN()) {
                    this.GetHopDongMTAMDungTToan();
                }
            }
        }
    }

    CheckKHangDaDungTToanMTMN(): boolean {
        let lstKHangTKiemDungTToanMTMN = this.lstDungTToanMTMN.filter(o => o.MA_KHANG == this.maKHangTKiem);
        if (lstKHangTKiemDungTToanMTMN && lstKHangTKiemDungTToanMTMN.length > 0) {
            this.showMessage(mType.warn, "Thông báo", "Khách hàng đã tồn tại dưới lưới vui lòng xem lại dưới lưới");
            return false;
        }

        return true;
    }

    onClickTiepTuc() {
        this.disabledThemMoi = false;
    }

    onClickCapNhat() {
        //Check các trường nhập trên lưới cho đúng
        if (this.ValidateDataDungTToanMTMN()) {
            if (this.isInsert) {
                //Binding data để lưu thôi
                this.BindingDataThemMoiDungTToanMTMN();

                //Lưu thôi
                this.InsertCNDungTToanMTMN();
            } else {
                this.BindingDataUpdateDungTToanMTMN();

                //Cập nhật thôi
                this.UpdateCNDungTToanMTMN();
            }
        }
    }

    async UpdateCNDungTToanMTMN() {
        try {
            let param = {
                CN_DUNGTTOAN_MTMN: this.dungTToanMTMNUpdate
            }

            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.UPDATE_CNDUNGTTOAN_MTMN, param);

            if (response && response.TYPE == "SUCCESS") {
                //Cập nhật trạng thái các nút
                this.disabledCapNhat = true;
                this.disabledLyDoKhac = true;

                this.showMessage(mType.success, "Thông báo", "Cập nhật khách hàng dừng thanh toán MTMN thành công");

                //Lấy lại thông tin khách hàng dưới lưới
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Thông báo", "cCập nhật khách hàng dừng thanh toán MTMN không thành công. Lỗi " + response.MESSAGE);
            }

        } catch (error) {
            this.showMessage(mType.error, "Thông báo", "Lỗi " + error);
        }
    }

    async InsertCNDungTToanMTMN() {
        try {
            let param = {
                CN_DUNGTTOAN_MTMN: this.dungTToanMTMNThemMoi
            }

            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.INSERT_CNDUNGTTOAN_MTMN, param);

            if (response && response.TYPE == "SUCCESS") {
                //Cập nhật trạng thái các nút
                this.disabledTiepTuc = false;
                this.disabledCapNhat = true;
                this.disabledLyDoKhac = true;
                this.disabledTKiemNCao = true;

                this.showMessage(mType.success, "Thông báo", "Thêm mới khách hàng dừng thanh toán MTMN thành công");

                //Lấy lại thông tin khách hàng dưới lưới
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Thông báo", "Thêm mới khách hàng dừng thanh toán MTMN không thành công. Lỗi " + response.MESSAGE);
            }

        } catch (error) {
            this.showMessage(mType.error, "Thông báo", "Lỗi " + error);
        }
    }

    BindingDataThemMoiDungTToanMTMN() {
        this.dungTToanMTMNThemMoi = this.dungTToanMTMN;
        this.ngayDungTT.setDate(1);
        this.dungTToanMTMNThemMoi.NGAY_DUNG = this.datePipe.transform(this.ngayDungTT, "dd/MM/yyyy");
        this.dungTToanMTMNThemMoi.CONG_SUATKT = this.csuatKTra;
        this.dungTToanMTMNThemMoi.SO_BBANKT = this.bbanKTra;
        this.dungTToanMTMNThemMoi.NGAY_KPHUC = null;
        this.dungTToanMTMNThemMoi.LY_DO_KPHUC = null;

        if (typeof this.dungTToanMTMNThemMoi.CONG_SUAT === "string" ||
            this.dungTToanMTMNThemMoi.CONG_SUAT instanceof String) {
            this.dungTToanMTMNThemMoi.CONG_SUAT = Number(this.dungTToanMTMNThemMoi.CONG_SUAT);
        }

        switch (this.lyDoDungTT) {
            case "0": {
                this.dungTToanMTMNThemMoi.LY_DO = "Vi phạm hợp đồng";
                break;
            }
            case "1": {
                this.dungTToanMTMNThemMoi.LY_DO = "Không đủ hồ sơ thanh toán";
                break;
            }
            case "2": {
                this.dungTToanMTMNThemMoi.LY_DO = this.lyDoDungKhac;
                break;
            }
        }
    }

    BindingDataUpdateDungTToanMTMN() {
        this.dungTToanMTMNUpdate = this.dungTToanMTMNSelect;

        this.ngayDungTT.setDate(1);
        this.dungTToanMTMNUpdate.NGAY_DUNG = this.datePipe.transform(this.ngayDungTT, "dd/MM/yyyy");
        this.dungTToanMTMNUpdate.CONG_SUATKT = this.csuatKTra;
        this.dungTToanMTMNUpdate.SO_BBANKT = this.bbanKTra;
        this.dungTToanMTMNUpdate.NGAY_KPHUC = null;
        this.dungTToanMTMNUpdate.LY_DO_KPHUC = null;

        switch (this.lyDoDungTT) {
            case "0": {
                this.dungTToanMTMNUpdate.LY_DO = "Vi phạm hợp đồng";
                break;
            }
            case "1": {
                this.dungTToanMTMNUpdate.LY_DO = "Không đủ hồ sơ thanh toán";
                break;
            }
            case "2": {
                this.dungTToanMTMNUpdate.LY_DO = this.lyDoDungKhac;
                break;
            }
        }
    }

    ValidateDataDungTToanMTMN(): boolean {

        if (!this.ngayDungTT) {
            this.showMessage(mType.warn, "Thông báo", "Tháng dừng không được để trống. Vui lòng chọn!");
            return false;
        }

        if (!this.csuatKTra || this.csuatKTra < 0) {
            this.showMessage(mType.warn, "Thông báo", "C.suất khi k.tra (kWh) không được để trống và phải lớn hơn 0. Vui lòng nhập!");
            return false;
        }

        if (!this.bbanKTra || this.bbanKTra.trim() == "") {
            this.showMessage(mType.warn, "Thông báo", "BB kiểm tra (số/ngày) không được để trống hoặc nhập dấu cách. Vui lòng nhập!");
            return false;
        }

        if (this.lyDoDungTT == "2" && (!this.lyDoDungKhac || this.lyDoDungKhac.trim() == "")) {
            this.showMessage(mType.warn, "Thông báo", "Nếu chọn lý do khác thì phải ghi rõ lý do. Vui lòng nhập!");
            return false;
        }

        return true;
    }

    onClickUpdate() {
        //cập nhật trạng thái nút
        this.isInsert = false;
        this.disabledCapNhat = false;

        this.ngayDungTT = moment("01/" + this.dungTToanMTMNSelect.NGAY_DUNG, "DD/MM/YYYY").toDate();
        this.csuatKTra = this.dungTToanMTMNSelect.CONG_SUATKT;
        this.bbanKTra = this.dungTToanMTMNSelect.SO_BBANKT;

        switch (this.dungTToanMTMNSelect.LY_DO) {
            case "Vi phạm hợp đồng":
                {
                    this.lyDoDungTT = "0";
                    break;
                }
            case "Không đủ hồ sơ thanh toán":
                {
                    this.lyDoDungTT = "1";
                    break;
                }
            default:
                {
                    this.lyDoDungTT = "2";
                    this.disabledLyDoKhac = false;
                    this.lyDoDungKhac = this.dungTToanMTMNSelect.LY_DO;
                    break;
                }
        }
    }

    onSelectKHang(event) {
        this.maKHangTKiem = event.MA_KHANG;
        //Check xem có HĐ mặt trời k
        this.GetHopDongMTAMDungTToan();
        this.showTKiemKHangNCao = false;
    }

    getHeightDialogTKiemKHang(): number {
        if (this.height == 0)
            return window.innerHeight * 0.5;
        else
            return this.height;
    }

    getWidthDialogTKiemKHang(): number {
        if (this.width == 0)
            return window.innerWidth * 0.95;
        else
            return this.width;
    }

    onChangeLyDoKhac() {
        this.disabledLyDoKhac = false;
    }

    onChangeLyDo() {
        this.disabledLyDoKhac = true;
        this.lyDoDungKhac = "";
    }

    checkListDuAn(evnet) { }
}
