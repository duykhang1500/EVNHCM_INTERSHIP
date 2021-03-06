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
            { label: '??i???n m???t tr???i m??i nh??' },
            { label: 'C???p nh???t d???ng thanh to??n ??i???n m???t tr???i', routerLink: ['/Home/DungThanhToanMTMN'] }
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
        this.titleService.setTitle("C???p nh???t d???ng thanh to??n ??i???n m???t tr???i");
    }

    ngOnInit() {
        //l???y danh s??ch kh??ch h??ng d???ng thanh to??n
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

                //X??? l?? l???i th??ng d???ng
                this.lstDungTToanMTMN.forEach(item => {
                    let lstNgayDung = item.NGAY_DUNG.split("/");
                    item.NGAY_DUNG = lstNgayDung[1] + "/" + lstNgayDung[2];
                });
            } else {
                this.showMessage(mType.warn, "Th??ng b??o", "Kh??ng c?? kh??ch h??ng d???ng thanh to??n");
            }
        } catch (error) {
            this.isLoading = false;
            this.showMessage(mType.error, "Th??ng b??o", "L???i " + error);
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
                this.showMessage(mType.warn, "Th??ng b??o", "Kh??ch h??ng kh??ng c?? H???p ?????ng m???t tr???i m??i nh??. Vui l??ng t??m ki???m k.h??ng MTMN" + response.MESSAGE);
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
                this.dungTToanMTMN.PHAN_LOAI = response.LOAI_KHANG == "0" ? "Kh??ch h??ng c?? nh??n" : "Kh??ch h??ng doanh nghi???p";
                this.dungTToanMTMN.DIA_CHI = response.SO_NHA ? response.SO_NHA + response.DUONG_PHO : response.DUONG_PHO;

                this.dungTToanMTMN.SAN_LUONG = response.SAN_LUONG
                this.dungTToanMTMN.SO_TIEN = response.SO_TIEN
                this.dungTToanMTMN.TIEN_GTGT = response.TIEN_GTGT
                this.dungTToanMTMN.TONG_TIEN = response.TONG_TIEN

                this.showMessage(mType.success, "Th??ng b??o", "T??m ki???m ???????c k.h??ng MTMN " + response.TEN_KHANG + " theo m?? k.h??ng " + this.maKHangTKiem);
                //C?? H?? m???t tr???i th?? l???y th??ng tin m???t tr???i ra n??o
                this.lyDoDungTT = "0";
                this.ngayDungTT = new Date();

                //H??m n??y ph???i l???y h???t th??ng tin ??? l?????i c???n thi???t v?? g??n cho 
                this.dungTToanMTMNThemMoi = new CN_DUNGTTOAN_MTMN;
            }
        } catch (error) {
            this.isLoading = false;
            this.disabledCapNhat = true;
            this.showMessage(mType.error, "Th??ng b??o", "L???i " + error);
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

        //clear form ????? t??m ki???m kh??ch h??ng
        this.dungTToanMTMN = new CN_DUNGTTOAN_MTMN;

        //C??c th??ng tin ??? d???ng thanh to??n
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
            this.dungTToanMTMNSelect.LY_DO_KPHUC = this.lyDoKPhuc == "0" ? "Ch??? ?????u t?? ???? ho??n th??nh th??? t???c" : "Do c???p nh???t nh???m";
            this.ngayKPhuc.setDate(1);
            this.dungTToanMTMNSelect.NGAY_KPHUC = this.datePipe.transform(this.ngayKPhuc, "dd/MM/yyyy");

            let param = {
                CN_DUNGTTOAN_MTMN: this.dungTToanMTMNSelect
            }

            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.KPHUC_CNDUNGTTOAN_MTMN, param);

            if (response && response.TYPE == "SUCCESS") {

                this.showMessage(mType.success, "Th??ng b??o", "Kh??i ph???c kh??ch h??ng d???ng thanh to??n MTMN th??nh c??ng");

                //L???y l???i th??ng tin kh??ch h??ng d?????i l?????i
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Th??ng b??o", "Kh??i ph???c kh??ch h??ng d???ng thanh to??n MTMN kh??ng th??nh c??ng. L???i " + response.MESSAGE);
            }
        } catch (error) {
            this.showMessage(mType.error, "Th??ng b??o", "L???i " + error);
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
                //Check xem Kh??ch h??ng ???? d???ng ch??a
                if (this.CheckKHangDaDungTToanMTMN()) {
                    this.GetHopDongMTAMDungTToan();
                }
            }
        }
    }

    CheckKHangDaDungTToanMTMN(): boolean {
        let lstKHangTKiemDungTToanMTMN = this.lstDungTToanMTMN.filter(o => o.MA_KHANG == this.maKHangTKiem);
        if (lstKHangTKiemDungTToanMTMN && lstKHangTKiemDungTToanMTMN.length > 0) {
            this.showMessage(mType.warn, "Th??ng b??o", "Kh??ch h??ng ???? t???n t???i d?????i l?????i vui l??ng xem l???i d?????i l?????i");
            return false;
        }

        return true;
    }

    onClickTiepTuc() {
        this.disabledThemMoi = false;
    }

    onClickCapNhat() {
        //Check c??c tr?????ng nh???p tr??n l?????i cho ????ng
        if (this.ValidateDataDungTToanMTMN()) {
            if (this.isInsert) {
                //Binding data ????? l??u th??i
                this.BindingDataThemMoiDungTToanMTMN();

                //L??u th??i
                this.InsertCNDungTToanMTMN();
            } else {
                this.BindingDataUpdateDungTToanMTMN();

                //C???p nh???t th??i
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
                //C???p nh???t tr???ng th??i c??c n??t
                this.disabledCapNhat = true;
                this.disabledLyDoKhac = true;

                this.showMessage(mType.success, "Th??ng b??o", "C???p nh???t kh??ch h??ng d???ng thanh to??n MTMN th??nh c??ng");

                //L???y l???i th??ng tin kh??ch h??ng d?????i l?????i
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Th??ng b??o", "cC???p nh???t kh??ch h??ng d???ng thanh to??n MTMN kh??ng th??nh c??ng. L???i " + response.MESSAGE);
            }

        } catch (error) {
            this.showMessage(mType.error, "Th??ng b??o", "L???i " + error);
        }
    }

    async InsertCNDungTToanMTMN() {
        try {
            let param = {
                CN_DUNGTTOAN_MTMN: this.dungTToanMTMNThemMoi
            }

            let response = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.TTIENCNO, API.API_TTIEN_CNO.INSERT_CNDUNGTTOAN_MTMN, param);

            if (response && response.TYPE == "SUCCESS") {
                //C???p nh???t tr???ng th??i c??c n??t
                this.disabledTiepTuc = false;
                this.disabledCapNhat = true;
                this.disabledLyDoKhac = true;
                this.disabledTKiemNCao = true;

                this.showMessage(mType.success, "Th??ng b??o", "Th??m m???i kh??ch h??ng d???ng thanh to??n MTMN th??nh c??ng");

                //L???y l???i th??ng tin kh??ch h??ng d?????i l?????i
                this.GetAllCNDungTToanMTMN();
            } else {
                this.showMessage(mType.error, "Th??ng b??o", "Th??m m???i kh??ch h??ng d???ng thanh to??n MTMN kh??ng th??nh c??ng. L???i " + response.MESSAGE);
            }

        } catch (error) {
            this.showMessage(mType.error, "Th??ng b??o", "L???i " + error);
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
                this.dungTToanMTMNThemMoi.LY_DO = "Vi ph???m h???p ?????ng";
                break;
            }
            case "1": {
                this.dungTToanMTMNThemMoi.LY_DO = "Kh??ng ????? h??? s?? thanh to??n";
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
                this.dungTToanMTMNUpdate.LY_DO = "Vi ph???m h???p ?????ng";
                break;
            }
            case "1": {
                this.dungTToanMTMNUpdate.LY_DO = "Kh??ng ????? h??? s?? thanh to??n";
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
            this.showMessage(mType.warn, "Th??ng b??o", "Th??ng d???ng kh??ng ???????c ????? tr???ng. Vui l??ng ch???n!");
            return false;
        }

        if (!this.csuatKTra || this.csuatKTra < 0) {
            this.showMessage(mType.warn, "Th??ng b??o", "C.su???t khi k.tra (kWh) kh??ng ???????c ????? tr???ng v?? ph???i l???n h??n 0. Vui l??ng nh???p!");
            return false;
        }

        if (!this.bbanKTra || this.bbanKTra.trim() == "") {
            this.showMessage(mType.warn, "Th??ng b??o", "BB ki???m tra (s???/ng??y) kh??ng ???????c ????? tr???ng ho???c nh???p d???u c??ch. Vui l??ng nh???p!");
            return false;
        }

        if (this.lyDoDungTT == "2" && (!this.lyDoDungKhac || this.lyDoDungKhac.trim() == "")) {
            this.showMessage(mType.warn, "Th??ng b??o", "N???u ch???n l?? do kh??c th?? ph???i ghi r?? l?? do. Vui l??ng nh???p!");
            return false;
        }

        return true;
    }

    onClickUpdate() {
        //c???p nh???t tr???ng th??i n??t
        this.isInsert = false;
        this.disabledCapNhat = false;

        this.ngayDungTT = moment("01/" + this.dungTToanMTMNSelect.NGAY_DUNG, "DD/MM/YYYY").toDate();
        this.csuatKTra = this.dungTToanMTMNSelect.CONG_SUATKT;
        this.bbanKTra = this.dungTToanMTMNSelect.SO_BBANKT;

        switch (this.dungTToanMTMNSelect.LY_DO) {
            case "Vi ph???m h???p ?????ng":
                {
                    this.lyDoDungTT = "0";
                    break;
                }
            case "Kh??ng ????? h??? s?? thanh to??n":
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
        //Check xem c?? H?? m???t tr???i k
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
