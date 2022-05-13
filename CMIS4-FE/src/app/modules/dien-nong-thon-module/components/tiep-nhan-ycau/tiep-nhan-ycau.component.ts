import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { iComponentBase, iServiceBase, mType } from 'src/app/modules/compoents-customer-module/components-customer';
import * as API from 'src/app/services/apiURL';
import * as XLSX from 'xlsx';
import { dviDiaChinh } from '../../models/dia-chinh.model';
import { tiepNhan } from '../../models/tiep-nhan.model';

@Component({
  selector: 'app-tiep-nhan-ycau',
  templateUrl: './tiep-nhan-ycau.component.html',
  styleUrls: ['./tiep-nhan-ycau.component.css']
})
export class TiepNhanYcauComponent extends iComponentBase implements OnInit {
  tienTNhanForm: FormGroup;
  isDisabledBtnThem: boolean = false;
  isDisabledBtnSua: boolean = false;
  isDisabledBtnXoa: boolean = false;
  isDisabledBtnGhi: boolean = false;
  isDisabledBtnHuy: boolean = false;
  isDisabledBtnTiep: boolean = false;
  isDisabledBtnIn: boolean = false;
  setCmisLoading: boolean = false;
  isDisabled: boolean = true;
  readonlyMaDAn: boolean = false;

  sMaDvi: string; sMaDviCtren: string; sUsername: string; sMaTo: string; sMaCNang: string; sPhanheDNT: string = 'NT';
  iThangDNT: number;
  iNamDNT: number;

  lstMaLoaiDAn: any = [];
  lstDviDiaChinh: any = [];
  lstDViDChinhFilter: Array<dviDiaChinh> = [];
  lstDViDChinh: Array<dviDiaChinh> = [];
  lstDuAnCTiet: any = [];
  dataExcelMau: any = [];
  selectedDuAn: any = [];
  lstTenFile: any = [];

  @ViewChild('MA_DUAN') MA_DUAN: ElementRef;
  @ViewChild('TEN_CTRINH') TEN_CTRINH: ElementRef;
  @ViewChild('fileUp') fileUp;
  arrayBuffer: any;
  fileDataObj: any[] = [];
  isFileUpload: boolean = false;
  file: File;
  infoFile: string = '';
  @ViewChild('inputFile') myInputVariable: ElementRef;
  sLoaiCapNhat: string = 'TU_FORM';

  constructor(private fb: FormBuilder,
    private serviceBase: iServiceBase,
    private confirmationService: ConfirmationService,
    private el: ElementRef, public msg: MessageService) {
    super(msg);
    this.createForm();
  }

  async ngOnInit() {
    this.sMaDvi = this.getUserInformation()[0].SUBDIVISIONID;
    this.sMaDviCtren = this.getUserInformation()[0].SUBDIVISIONID_U;
    this.sUsername = this.getUserInformation()[0].USERNAME;
    this.sMaTo = this.getUserInformation()[0].MA_TO;
    this.sMaCNang = this.getMenuInfo() != (undefined && this.getMenuInfo().length > 0
      && this.getMenuInfo()[0].libid != undefined) ? this.getMenuInfo()[0].libid.toString() : "";
    await this.getDanhMuc();
    this.actForm('init');
    await this.searchDuAn('ALL');
  }
  btnUpFileClick() {
    console.log(this.tienTNhanForm)
  }
  ngAfterViewInit(): void {
    this.MA_DUAN.nativeElement.focus();
    this.tienTNhanForm.controls["MA_DVIQLY"].setValue(this.sMaDvi);
    this.tienTNhanForm.controls["NGUOI_TAO"].setValue(this.sUsername);
    this.tienTNhanForm.controls["NGUOI_SUA"].setValue(this.sUsername);
    this.tienTNhanForm.controls["MA_CNANG"].setValue(this.sMaCNang || '-1');
    this.getSystemDate().forEach(element => {
      if (element.MA_DVIQLY == this.sMaDvi && element.PHAN_HE == this.sPhanheDNT) { this.iThangDNT = element.THANG; this.iNamDNT = element.NAM; };
    });
    this.tienTNhanForm.controls["THANG"].setValue(this.iThangDNT);
    this.tienTNhanForm.controls["NAM"].setValue(this.iNamDNT);

  }

  createForm() {
    this.tienTNhanForm = this.fb.group({
      MA_DVIQLY: [{ value: '' }],
      NGUOI_TAO: [{ value: '' }],
      NGUOI_SUA: [{ value: '' }],
      MA_CNANG: [{ value: '' }],
      THANG: [{ value: '' }],
      NAM: [{ value: '' }],
      MA_DVIDCHINH: [{ value: '' }],
      MA_DVIDCHINH_LABLE: [{ value: '', disabled: this.isDisabled }, Validators.required],
      MA_DUAN: [{ value: '', disabled: false }, Validators.required],
      MA_LOAI_DUAN: [{ value: '', disabled: this.isDisabled }, Validators.required],
      TEN_CTRINH: [{ value: '', disabled: this.isDisabled }, Validators.required],
      SO_HO: [{ value: 1, disabled: this.isDisabled }, Validators.required],
      NAM_VH: [{ value: 2021, disabled: this.isDisabled }, Validators.required],
      DZ_110: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$')],
      DZ_HTHE: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$')],
      DZ_TTHE: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$')],
      SL_TRAM: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      DL_TBA: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$')],
      NG_NSNN: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      NG_VHPT: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      NG_VVUD: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      NG_QPT: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      NG_VTD: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      QD_NTN: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      QD_GT: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
      GT_CLAI: [{ value: 0, disabled: this.isDisabled }, Validators.pattern('[0-9\/]*')],
    })
  }

  async getDanhMuc() {
    this.getSystemDate().forEach(element => {
      if (element.MA_DVIQLY == this.sMaDvi && element.PHAN_HE == this.sPhanheDNT) { this.iThangDNT = element.THANG; this.iNamDNT = element.NAM; };
    });
    const _lstDloaiDAN: any = await this.serviceBase.getData_WithParams_Async(
      API.PHAN_HE.DIENNTHON,
      API.API_DIEN_NONG_THON.GET_D_LOAI_DUAN_DNT('D_LOAI_DUAN_DNT', 'ALL'),
      "ALL"
    );

    _lstDloaiDAN.forEach(element => {
      this.lstMaLoaiDAn.push({ label: `${element.maLoaiDuan}-${element.motaLoaiDuan}`, value: element.maLoaiDuan })
    });
    this.tienTNhanForm.controls["MA_LOAI_DUAN"].setValue(this.lstMaLoaiDAn[0].value || '');

    let _ipDviDiaChinh = {
      MA_DVIQLY: "",
      TEN_DANH_MUC: "D_DVI_DCHINH"
    };
    let response: any = await this.serviceBase.getData_AsyncByPostRequest(
      API.PHAN_HE.DANHMUC,
      API.API_DANH_MUC.GET_DANH_MUC, _ipDviDiaChinh
    );

    this.lstDViDChinh = [];
    for (var obj of response.LST_OBJ) {
      this.lstDViDChinh.push({
        MA_DVIDCHINH: obj.maDvidchinh,
        TEN_DVIDCHINH: obj.maDvidchinh + ' - ' + obj.tenDvidchinh,
        ID_DIA_CHINH: obj.idDiaChinh
      });
    }

    this.dataExcelMau = [];
    for (let i = 0; i < 5; i++) {
      this.dataExcelMau.push({
        MA_DVIQLY: this.sMaDvi,
        FILE_EXCEL: 'X',
        TEN_CTRINH: 'Công trình điện nông thôn ' + (i + 1).toString(),
        MA_LOAI_DUAN: 'QĐ41',
        MA_DVIDCHINH: '0100900343',
        SO_HO: '1',
        NAM_VH: '2021',
        SL_TRAM: '1',
        DL_TBA: '10000',
        DZ_110: '10000',
        DZ_HTHE: '10000',
        DZ_TTHE: '10000',
        NG_NSNN: '10000',
        NG_QPT: '10000',
        NG_VHPT: '10000',
        NG_VTD: '10000',
        NG_VVUD: '10000',
        QD_GT: '10000',
        QD_NTN: '10000',
        GT_CLAI: '10000',
      })
    }
  }

  actForm(state: 'reset' | 'disable' | 'enable' | 'enableExceptMaDuAn' | 'init' | 'btnThemClick' | 'disableExceptMaDuAn' | 'luuThanhCong' | 'btnSuaClick' | 'xoaThanhCong' | 'docFileThanhCong' | 'luuTuFileThanhCong') {
    switch (state) {
      case 'reset':
        this.tienTNhanForm.reset();
        break;
      case 'disable':
        this.tienTNhanForm.disable();
        break;
      case 'enable':
        this.tienTNhanForm.enable();
        break;
      case 'enableExceptMaDuAn':
        this.tienTNhanForm.enable();
        this.tienTNhanForm.controls["MA_DUAN"].disable();
        break;
      case 'disableExceptMaDuAn':
        this.tienTNhanForm.disable();
        this.readonlyMaDAn = false;
        this.tienTNhanForm.controls["MA_DUAN"].enable();
        break;
      case 'init':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = true;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = true;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = false;
        this.readonlyMaDAn = false;
        this.tienTNhanForm.controls["MA_DUAN"].enable();
        this.tienTNhanForm.controls["MA_DUAN"].setValue('');
        this.tienTNhanForm.controls["SO_HO"].setValue(1);
        this.tienTNhanForm.controls["NAM_VH"].setValue(2021);
        this.tienTNhanForm.controls['TEN_CTRINH'].setValue('');
        this.tienTNhanForm.controls['DL_TBA'].setValue(0);
        this.tienTNhanForm.controls['DZ_110'].setValue(0);
        this.tienTNhanForm.controls['DZ_HTHE'].setValue(0);
        this.tienTNhanForm.controls['DZ_TTHE'].setValue(0);
        this.tienTNhanForm.controls['GT_CLAI'].setValue(0);
        this.tienTNhanForm.controls['NG_NSNN'].setValue(0);
        this.tienTNhanForm.controls['NG_QPT'].setValue(0);
        this.tienTNhanForm.controls['NG_VHPT'].setValue(0);
        this.tienTNhanForm.controls['NG_VTD'].setValue(0);
        this.tienTNhanForm.controls['NG_VVUD'].setValue(0);
        this.tienTNhanForm.controls['QD_GT'].setValue(0);
        this.tienTNhanForm.controls['QD_NTN'].setValue(0);
        this.tienTNhanForm.controls['SL_TRAM'].setValue(1);
        this.tienTNhanForm.controls["MA_LOAI_DUAN"].setValue(this.lstMaLoaiDAn && this.lstMaLoaiDAn.length > 0 ? this.lstMaLoaiDAn[0].value : '');
        break;
      case 'btnThemClick':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = false;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = true;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = true;
        this.readonlyMaDAn = false;
        this.readonlyMaDAn = false;
        this.sLoaiCapNhat = 'TU_FORM';
        this.tienTNhanForm.controls["MA_DUAN"].setValue('');
        break;
      case 'luuThanhCong':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = true;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = false;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = false;
        break;
      case 'xoaThanhCong':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = true;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = false;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = false;
        break;
      case 'btnSuaClick':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = false;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = false;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = true;
        this.sLoaiCapNhat = 'TU_FORM';
        break;
      case 'docFileThanhCong':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = false;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = true;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = true;
        break;
      case 'luuTuFileThanhCong':
        this.isDisabledBtnHuy = false;
        this.isDisabledBtnGhi = true;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnTiep = false;
        this.isDisabledBtnXoa = true;
        this.isDisabledBtnThem = true;
        break;
    }
  }
  async searchDuAn(maDuAn) {
    try {
      this.setCmisLoading = true;
      this.lstDuAnCTiet = []

      let rsp: any = await this.serviceBase.getData_WithParams_Async(
        API.PHAN_HE.DIENNTHON,
        API.API_DIEN_NONG_THON.GET_DATA_TNHAN_YCAU('ldnt_tnhan_ycau', this.sMaDvi, maDuAn),
        maDuAn
      );

      if (!rsp || rsp.TYPE == 'ERROR' || rsp.TYPE == 'NODATA') {
        this.showMessage(mType.warn, "Tìm kiếm", "Mã dự án không tồn tại!");
        this.setCmisLoading = false;
        return;
      }
      else {
        rsp.forEach(element => {
          this.lstDuAnCTiet.push({
            MA_DVIQLY: element.maDviqly,
            MA_DUAN: element.maDuan,
            TEN_CTRINH: element.tenCtrinh,
            MA_LOAI_DUAN: element.maLoaiDuan,
            MA_DVIDCHINH: element.maDvidchinh,
            SO_HO: element.soHo,
            NAM_VH: element.namVh,
            SL_TRAM: element.slTram,
            DL_TBA: element.dlTba,
            DZ_110: element.dz110,
            DZ_HTHE: element.dzHthe,
            DZ_TTHE: element.dzTthe,
            NG_NSNN: element.ngNsnn,
            NG_QPT: element.ngQpt,
            NG_VHPT: element.ngVhpt,
            NG_VTD: element.ngVtd,
            NG_VVUD: element.ngVvud,
            QD_GT: element.qdGt,
            QD_NTN: element.qdNtn,
            GT_CLAI: element.gtClai,
          })
        });
      }
      this.actForm('init');
      this.setCmisLoading = false;
      this.readonlyMaDAn = false;
      this.clearFileUpload();

      console.log(this.lstDuAnCTiet);
      this.showMessage(mType.success, "Tìm kiếm!", "Thành công");
    } catch (error) {
      console.log(error);
      this.setCmisLoading = false;
    }
  }
  async checkListDuAn(event?) {
    this.actForm('luuThanhCong');

    if (event != undefined) {
      this.bindingFormValue(event.data);
      if (event.data.FILE_EXCEL == 'X') {
        this.isDisabledBtnGhi = false;
        this.isDisabledBtnSua = true;
        this.isDisabledBtnXoa = true;
      } else {
        this.isDisabledBtnSua = false;
        this.isDisabledBtnXoa = false;
      }
    }
    let lstKieuNhap = [];
    if (this.lstDuAnCTiet.length > 0) {
      this.lstDuAnCTiet.forEach(element => {
        if (element.IS_SELECTED == "1") {
          if (element.FILE_EXCEL == undefined) {
            if (lstKieuNhap.indexOf('TU_FORM') === -1) {
              lstKieuNhap.push('TU_FORM');
            }
          }
          else {
            if (lstKieuNhap.indexOf('FILE_EXCEL') === -1) {
              lstKieuNhap.push('FILE_EXCEL')
            }
          }
        }
      });
    }
    if (lstKieuNhap.length > 1) {
      this.showMessage(mType.warn, "Thông báo", "Nếu chọn dòng nhập từ file excel thì không chọn dòng dữ liệu khác kiểu nhập trên lưới để thao tác và ngược lại");
      return;
    }
    this.isDisabledBtnHuy = false;
  }
  bindingFormValue(data) {
    try {
      this.tienTNhanForm.controls['MA_DUAN'].setValue(data.MA_DUAN);
      this.tienTNhanForm.controls['MA_DVIQLY'].setValue(data.MA_DVIQLY);
      this.tienTNhanForm.controls['THANG'].setValue(data.THANG == undefined ? this.iThangDNT : data.THANG);
      this.tienTNhanForm.controls['NAM'].setValue(data.NAM == undefined ? this.iNamDNT : data.NAM);
      this.tienTNhanForm.controls['NGUOI_TAO'].setValue(data.NGUOI_TAO == undefined ? this.sUsername : data.NGUOI_TAO);

      this.tienTNhanForm.controls['TEN_CTRINH'].setValue(data.TEN_CTRINH);
      this.tienTNhanForm.controls['NAM_VH'].setValue(data.NAM_VH);
      this.tienTNhanForm.controls['SO_HO'].setValue(data.SO_HO);
      this.tienTNhanForm.controls['DL_TBA'].setValue(data.DL_TBA);
      this.tienTNhanForm.controls['DZ_110'].setValue(data.DZ_110);
      this.tienTNhanForm.controls['DZ_HTHE'].setValue(data.DZ_HTHE);
      this.tienTNhanForm.controls['DZ_TTHE'].setValue(data.DZ_TTHE);
      this.tienTNhanForm.controls['GT_CLAI'].setValue(data.GT_CLAI);
      this.tienTNhanForm.controls['NG_NSNN'].setValue(data.NG_NSNN);
      this.tienTNhanForm.controls['NG_QPT'].setValue(data.NG_QPT);
      this.tienTNhanForm.controls['NG_VHPT'].setValue(data.NG_VHPT);
      this.tienTNhanForm.controls['NG_VTD'].setValue(data.NG_VTD);
      this.tienTNhanForm.controls['NG_VVUD'].setValue(data.NG_VVUD);
      this.tienTNhanForm.controls['QD_GT'].setValue(data.QD_GT);
      this.tienTNhanForm.controls['QD_NTN'].setValue(data.QD_NTN);
      this.tienTNhanForm.controls['SL_TRAM'].setValue(data.SL_TRAM);

      this.tienTNhanForm.controls['MA_LOAI_DUAN'].setValue(data.MA_LOAI_DUAN);
      let _diachinh = this.lstDViDChinh.filter(p => p.MA_DVIDCHINH == data.MA_DVIDCHINH);
      if (_diachinh.length > 0) {
        this.tienTNhanForm.controls['MA_DVIDCHINH_LABLE'].setValue(_diachinh[0]);
      }
      this.tienTNhanForm.controls['MA_DVIDCHINH'].setValue(data.MA_DVIDCHINH);

    } catch (error) {
      console.log(error);
    }
  }

  validForm() {
    for (const key of Object.keys(this.tienTNhanForm.controls)) {
      if (this.tienTNhanForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(('[formcontrolname="' + key + '"]'));
        key == 'MA_DVIDCHINH_LABLE' ? this.showMessage(mType.warn, "Kiểm tra", "Chưa nhập đơn vị địa chính") : invalidControl.focus(); // chưa focus autocomplete được
        return false;
      }
    }
    return true;
  }

  btnThemClick() {
    this.clearFileUpload();
    this.actForm('enableExceptMaDuAn');
    this.actForm('btnThemClick');
    this.TEN_CTRINH.nativeElement.focus();
  }

  btnSuaClick() {
    this.actForm('enable');
    this.actForm('btnSuaClick');
  }

  btnXoaDuLieuClick() {
    try {
      this.confirmationService.confirm({
        message: `Bạn có chắc chắn xóa dự án điện nông thôn?`,
        header: 'Xác nhận',
        key: "cfIn",
        icon: 'fa fa-question-circle',
        accept: () => {
          this.setCmisLoading = true;
          let _input = [];
          this.selectedDuAn.forEach(element => {
            _input.push(element.MA_DUAN)
          });
          // let _input = [this.tienTNhanForm.controls["MA_DUAN"].value];
          this.serviceBase.postData(API.PHAN_HE.DIENNTHON, API.API_DIEN_NONG_THON.POST_DATA_TNHAN_YCAU('ldnt_tnhan_ycau', 'delete'), _input)
            .subscribe((rsp: any) => {
              if (rsp && rsp.TYPE == 'DELETED') {
                this.showMessage(mType.success, 'Thông báo', 'Đã xóa thông tin dự án thành công');
                this.lstDuAnCTiet = this.xoaPhanTuTrongMang(this.lstDuAnCTiet, this.selectedDuAn);
                this.actForm('xoaThanhCong');
              } else {
                this.showMessage(mType.error, "Thông báo!", "Mã dự án không tồn tại!");
              }
              this.setCmisLoading = false;
            });
        }
      });
    } catch (error) {
      console.log(error);
      this.setCmisLoading = false;
      this.showMessage(mType.error, "Lỗi!", error);
    }
  }

  btnTiepTucClick() {
    this.actForm('init');
    this.actForm('disableExceptMaDuAn');
    this.MA_DUAN.nativeElement.focus();
  }

  btnHuyClick() {
    this.clearFileUpload();
    this.actForm('init');
    this.actForm('disableExceptMaDuAn');
    this.MA_DUAN.nativeElement.focus();
    this.sLoaiCapNhat = 'TU_FORM';
    let lstExcel = this.lstDuAnCTiet.filter(x => x.FILE_EXCEL == 'X');
    this.lstDuAnCTiet = this.xoaPhanTuTrongMang(this.lstDuAnCTiet, lstExcel);
  }

  btnCapNhatClick() {
    if (this.sLoaiCapNhat == 'TU_FILE') {
      this.capNhatTuFile();
    } else {
      this.capNhatTuForm();
    }
  }
  async capNhatTuForm() {
    try {
      this.setCmisLoading = true;
      if (!this.validForm()) {
        this.setCmisLoading = false;
        return;
      }
      let input: Array<tiepNhan> = [this.tienTNhanForm.value];
      if (this.tienTNhanForm.controls["MA_DUAN"].value && this.tienTNhanForm.controls["MA_DUAN"].value.length > 0) {
        const rspUpdate: any = await this.serviceBase.postData_Async(API.PHAN_HE.DIENNTHON, API.API_DIEN_NONG_THON.POST_DATA_TNHAN_YCAU('ldnt_tnhan_ycau', 'update'), input);
        if (!rspUpdate || rspUpdate.TYPE == 'ERROR' || rspUpdate.TYPE == 'NODATA') {
          this.showMessage(mType.error, "Lỗi!", rspUpdate.MESSAGE);
          this.setCmisLoading = false;
          return;
        }
        this.showMessage(mType.success, "Cập nhật thành công!", rspUpdate.MESSAGE);
        let lstUpDate = this.lstDuAnCTiet.filter(x => x.MA_DUAN == input[0].MA_DUAN);
        this.lstDuAnCTiet = this.xoaPhanTuTrongMang(this.lstDuAnCTiet, lstUpDate);
        this.lstDuAnCTiet.unshift(input[0]);
      } else {
        const rspAdd: any = await this.serviceBase.postData_Async(
          API.PHAN_HE.DIENNTHON,
          API.API_DIEN_NONG_THON.POST_DATA_TNHAN_YCAU('ldnt_tnhan_ycau', 'add'),
          input);

        if (!rspAdd || rspAdd.TYPE == 'ERROR') {
          this.showMessage(mType.error, "Lỗi!", rspAdd.MESSAGE);
          this.setCmisLoading = false;
          return;
        }
        this.showMessage(mType.success, "Thêm dự án thành công!", rspAdd.MESSAGE[0].MA_DUAN);
        input[0].MA_DUAN = rspAdd.MESSAGE[0].MA_DUAN;
        this.lstDuAnCTiet.unshift(input[0]);
        this.MA_DUAN.nativeElement.focus();
      }
      this.actForm('luuThanhCong');
      this.setCmisLoading = false;
    } catch (error) {
      this.setCmisLoading = false;
      console.log(error);
    }
  }

  async capNhatTuFile() {
    try {
      this.setCmisLoading = true;
      let input: Array<tiepNhan> = this.chuanHoaLstExcel();
      const rspAdd: any = await this.serviceBase.postData_Async(
        API.PHAN_HE.DIENNTHON,
        API.API_DIEN_NONG_THON.POST_DATA_TNHAN_YCAU('ldnt_tnhan_ycau', 'add'),
        input);

      if (!rspAdd || rspAdd.TYPE == 'ERROR') {
        this.showMessage(mType.error, "Lỗi!", rspAdd.MESSAGE);
        this.setCmisLoading = false;
        return;
      }
      this.showMessage(mType.success, "Thông báo!", "Thêm mới dự án thành công");
      this.lstDuAnCTiet.forEach(element => {
        if (element.FILE_EXCEL == 'X') {
          let lstResultFilter = rspAdd.MESSAGE.filter(x => x.ROWID == element.ROWID);
          if (lstResultFilter.length > 0) {
            element.IS_SELECTED = "0"
            element.FILE_EXCEL = undefined;
            element.MA_DUAN = lstResultFilter[0].MA_DUAN;
          }
        }
      });
      this.actForm('luuTuFileThanhCong');
      this.setCmisLoading = false;
    } catch (error) {
      this.setCmisLoading = false;
      console.log(error);
    }
  }

  xoaPhanTuTrongMang(arr1: any, arr2: any) {
    while (arr1.length > 0 && arr2.length > 0) {
      let item = arr2[0];
      arr1.splice(arr1.indexOf(item), 1);
      arr2.splice(0, 1);
    }
    return arr1;
  }

  searchDiaChinh(event) {
    this.lstDViDChinhFilter = [];
    if (this.lstDViDChinh && this.lstDViDChinh.length > 0) {
      let query = event.query;
      if (query.toString().trim() == "")
        this.lstDViDChinhFilter = this.lstDViDChinh;
      else {
        for (let i = 0; i < this.lstDViDChinh.length; i++) {
          let dvidchinh = this.lstDViDChinh[i];
          if (dvidchinh.TEN_DVIDCHINH.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) {
            this.lstDViDChinhFilter.push(dvidchinh);
          }
        }
      }
    }
  }

  onSelectDiaChinh(event) {
    this.tienTNhanForm.controls['MA_DVIDCHINH'].setValue(event.MA_DVIDCHINH.toString());
  }

  chuanHoaLstExcel(): Array<tiepNhan> {
    let result: Array<tiepNhan> = [];
    let data = this.selectedDuAn;
    data.forEach(element => {
      result.push(
        {
          ROWID: element.ROWID,
          MA_DVIQLY: element.MA_DVIQLY,
          MA_DUAN: '',
          MA_CNANG: this.sMaCNang || "-1",
          MA_DVIDCHINH: element.MA_DVIDCHINH,
          MA_LOAI_DUAN: element.MA_LOAI_DUAN,
          TEN_CTRINH: element.TEN_CTRINH,
          NGUOI_SUA: this.sUsername,
          NGUOI_TAO: this.sUsername,
          THANG: this.iThangDNT,
          NAM: this.iNamDNT,
          SO_HO: parseInt(element.SO_HO),
          NAM_VH: parseInt(element.NAM_VH),
          SL_TRAM: parseFloat(element.SL_TRAM),
          DL_TBA: parseFloat(element.DL_TBA),
          DZ_110: parseFloat(element.DZ_110),
          DZ_HTHE: parseFloat(element.DZ_HTHE),
          DZ_TTHE: parseFloat(element.DZ_TTHE),
          NG_NSNN: parseFloat(element.NG_NSNN),
          NG_QPT: parseFloat(element.NG_NSNN),
          NG_VHPT: parseFloat(element.NG_VHPT),
          NG_VTD: parseFloat(element.NG_VTD),
          NG_VVUD: parseFloat(element.NG_VVUD),
          QD_GT: parseFloat(element.QD_GT),
          QD_NTN: parseFloat(element.QD_NTN),
          GT_CLAI: parseFloat(element.GT_CLAI),
        }
      )
    });

    return result;
  }

  btnDownFileMauClick() {
    try {
      let _strTenFile = this.sMaDvi + "_DienNongThon_FileMau.xlsx";
      this.Savefiletodisk(this.dataExcelMau, _strTenFile);

    } catch (error) {
      console.log(error);
    }
  }
  btnXuatFileDuAn() {
    try {
      if (this.selectedDuAn.length == 0) {
        this.showMessage(mType.warn, "Thông báo", "Cần chọn dự án để xuất thông tin")
        return;
      }
      let _strTenFile = this.sMaDvi + "ThongTinDuAn.xlsx";
      this.Savefiletodisk(this.selectedDuAn, _strTenFile);

    } catch (error) {
      console.log(error);
    }
  }


  vaLidExcel() {
    let _resKey = "Giá trị ";
    for (const key of Object.keys(this.dataExcelMau[0])) {
      for (let i = 0; i < this.lstDuAnCTiet.length; i++) {
        const element = this.lstDuAnCTiet[i];
        if (!element[key]) {
          _resKey = _resKey.concat(key.toString()).concat(' ');
        }
      }
    }
    if (_resKey.length > 12) {
      this.showMessage(mType.warn, "Thông báo", _resKey + "Không hợp lệ!");
      return false;
    }
    this.showMessage(mType.info, "Kiểm tra", "File hợp lệ!");
    return true;
  }
  public Savefiletodisk(listfail: any[], fileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listfail);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });
    saveAs(data, fileName);
  }

  clickChangeFile() {
    this.fileUp.nativeElement.value = "";
    this.clearFileUpload();
  }
  incomingfile(event) {
    this.isFileUpload = true;
    this.file = event.target.files[0];
    this.infoFile = this.file.name + ' - ' + (this.file.size / 1024).toFixed(2) + ' KB';
    this.uploadFile()
  }
  clearFileUpload() {
    this.isFileUpload = false;
    this.infoFile = '';
    this.myInputVariable.nativeElement.value = '';
  }
  async uploadFile() {

    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = async () => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.fileDataObj = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let dataJson = JSON.stringify(this.fileDataObj);
      let lstExcel = JSON.parse(dataJson, (key, val) => (
        typeof val !== 'object' && val !== null ? String(val) : val
      ));
      lstExcel.forEach((element, index) => {
        element.ROWID = 'ROW_' + (index + 1).toString();
        let lstSub = this.lstDuAnCTiet.map((_arrayElement) => Object.assign({}, _arrayElement));
        lstSub.unshift(element);
        this.lstDuAnCTiet = lstSub.map((_arrayElement) => Object.assign({}, _arrayElement));
      });
      this.sLoaiCapNhat = 'TU_FILE'
      return;
    }
  }
  getnumber(num: number) {
    if (num < 10) {
      return '00' + num;
    } else if (num < 100) {
      return '0' + num;
    } else return num;
  }

  getformatnumber(num: number) {
    if (num == undefined || num == null) {
      return '';
    }
    let numstr = num.toString();
    let numbertp = numstr.substring(numstr.indexOf('.'), numstr.length);
    let numcheck = num - Math.round(num);

    if (numcheck != 0) {
      let num1 = Math.round(num);
      return this.getformatnumberint(num1) + numbertp;
    } else return this.getformatnumberint(num);
  }

  getformatnumberint(num: number) {
    let strnum = '';
    while (num > 999) {
      strnum = this.getnumber(num % 1000) + ',' + strnum;
      // ////console.log(strnum);
      num = Math.floor(num /= 1000);
    }
    return (num + ',' + strnum).substring(0, (num + ',' + strnum).length - 1);
  }
}
