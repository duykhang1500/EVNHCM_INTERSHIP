import { Component, OnInit, Input, forwardRef, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { iFunction } from '../../functions/iFunction';
import { Dropdown } from 'primeng/dropdown';
import { AutoComplete } from 'primeng/autocomplete';
import { MultiSelect } from 'primeng/multiselect';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as API from 'src/app/services/apiURL';
import { iServiceBase } from '../../components-customer';

@Component({
  selector: 'cmis-dsach-dtuong',
  templateUrl: './dsach-dtuong.component.html',
  styleUrls: ['./dsach-dtuong.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DSachDTuongComponent),
      multi: true,
    }
  ]
})
export class DSachDTuongComponent extends iFunction implements OnInit {
  @Input() isLoadLocal: boolean = true; // true : load mặc định và lưu storage , false ko load j cả
  @Input() isRefreshLocal: boolean = false; // true: lưu vào local
  @Input() defaultValue: string = "";
  @Input() disabled: boolean = false;
  @Input() filter: boolean = false;
  @Input() defaultLabel: String = "Chọn giá trị";
  @Input() selectedItemsLabel: String = "{0} giá trị chọn";
  @Input() strUIType: number = 1;
  @Input() maxSelectedLabels: number = 3;
  @Input() strTenDMuc: string = "D_SOGCS";
  @Input() strLabelName: string = "MA_SOGCS";
  @Input() strValueName: string = "TEN_SOGCS";
  @Input() strParam: string = "{NHOM:'1'}";
  @Input() BtnLoadDM: string = "BtnLoadDM";
  @Input() bindingValue: string = "";
  @Input() valueDTuong: string = "";

  @ViewChild('drd') drd: Dropdown;
  @ViewChild('auto') auto: AutoComplete;
  @ViewChild('mlt') mlt: MultiSelect;
  @ViewChild('dte') dte: ElementRef;

  @Output() onValidate: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterDM: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInit: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  isLazy: boolean = false;
  totalRecords: number = 0;
  lstDMuc: any[];//chứa thông tin từ DB
  lstCombo: any[] = [];
  selectedDMuc: any;
  selectedDMucSelected: any;

  // DANH MUC MỚI
  _CTiet_DanhMucSelected: any = "";
  _colsDMuc: any[];
  _lstDMuc: Array<any> = [];
  _lstDMucSelected: Array<any> = [];
  _controlSelected: any;
  _saveDMuc: any = {};
  _saveDMuc_Full: any = {};
  _Txttimkiem: String = "";

  // CÁC DANH MỤC CHẠY THEO CHỨC NĂNG MỚI
  _lstDanhMucMoi: String[] = [
    "D_SOGCS",
    "D_SOGCSKH",
    "D_SOGCSDN"
  ];

  _strDkTimKiemCu = "";
  _isErrorVa: boolean = true;
  _isEnter: boolean = false;
  _isValidate: boolean = false;
  strMaDviqly: string = "";

  constructor(private serviceBase: iServiceBase) {
    super();
  }

  async ngOnInit() {
    try {
      this.initBangDuLieu();
      this.strMaDviqly = this.getUserInformation()[0].SUBDIVISIONID;
      let exists: boolean = false;
      let _limit: string = this.getStorage(this.strMaDviqly + '_LIMIT');
      console.log(this.strUIType + "-" + this.strTenDMuc);
      // REMOVE LOCALSTORAGE IF NEED RELOAD
      if (this.isRefreshLocal) {
        localStorage.removeItem(this.strTenDMuc + "-" + this.strMaDviqly);
      }
      if (this.getStorage(this.strTenDMuc + "-" + this.strMaDviqly) != "") {
        exists = true;
      }
      if (this.strTenDMuc == 'D_TRAM' || this.strTenDMuc == 'D_SOGCS') {
        if (_limit != undefined) {
          let _inputQT = {
            MA_DVIQLY: this.strMaDviqly,
            NAME: "G_LIMIT"
          }

          let _rspLimit = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_ALL_PARAMETER, _inputQT);

          if (_rspLimit && _rspLimit.TYPE != 'ERROR' && _rspLimit.TYPE != 'NODATA' && _rspLimit.length > 0) {
            _limit = _rspLimit[0].PRAVALUE
            this.setStorage(this.strMaDviqly + '_LIMIT', _limit);
          } else {
            _limit = '200000';
          }
        }

        let _inputCount = {
          MA_DVIQLY: this.strMaDviqly,
          TEN_DANH_MUC: `COUNT_${this.strTenDMuc}`
        }

        this.totalRecords = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC, _inputCount) || 0;

        if (this.totalRecords > parseInt(_limit)) {
          this.isLazy = true;
          this.onInit.emit();
          this.lstCombo = [];
          return;
        } else this.isLazy = false;
      }

      // DK1: NẾU KHÔNG PHẢI LÀ DANH MỤC MỚI HOẠC ĐƯỢC CẤU HÌNH LOADLOCAL THI LOAD DEFAULT
      if (this._lstDanhMucMoi.indexOf(this.strTenDMuc) == -1) {
        // NẾU KHÔNG TỒN TẠI  DK1.1
        if (!exists) {
          let param = {
            TEN_DANH_MUC: this.strTenDMuc,
            MA_DVIQLY: this.strMaDviqly,
            PARAM: this.strTenDMuc == "D_TKHOAN_DVI" ? "" : this.strParam
          };

          this.serviceBase.getDataByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC, param).subscribe((response: any) => {
            if (response.strError) {
              console.log(response.strError);
              return;
            }
            if (response.LST_OBJ.length > 0) {
              response.LST_OBJ.forEach(element => {
                element.validFrom = this.formatDateToString(new Date(element.validFrom));
                element.validTo = this.formatDateToString(new Date(element.validTo));
              });
            }
            this.setStorage(this.strTenDMuc + "-" + this.strMaDviqly, JSON.stringify(response));
            this.lstDMuc = response.LST_OBJ;
            this.lstCombo = [];
            if (this.defaultValue.trim().length > 0) {
              this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
            }
            if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
              this.lstDMuc.forEach(element => {
                this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element })
              });
            }
            let pa = this;
            setTimeout(function () {
              pa.onInit.emit();
            }, 50);
          }, error => {
            console.log(error);
          });
        }
        else { // NẾU CÓ TỒN TẠI THÌ LOAD TRONG LOCALSTORAGE DK1.2
          let strExists: string = this.getStorage(this.strTenDMuc + "-" + this.strMaDviqly);
          let data: any = JSON.parse(strExists);
          this.lstDMuc = data.LST_OBJ;
          this.lstCombo = [];
          if (this.defaultValue.trim().length > 0) {
            this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
          }
          if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
            this.lstDMuc.forEach(element => {
              this.lstCombo.push({
                label: element[this.strValueName] + " - " + element[this.strLabelName],
                value: element[this.strValueName],
                item: element
              });
            });

            if (this.valueDTuong != "") {
              this.selectedDMuc = this.valueDTuong;
            }
          }
          let pa = this;
          setTimeout(function () {
            pa.onInit.emit();
          }, 50);
        }
      } else {
        // NEU LA DANH MỤC MÓI THÌ KIỂM TRA CÓ SET LOADLOCAL HAY KO
        if (this.isLoadLocal) {
          // NẾU KHÔNG TỒN TẠI  DK2
          if (!exists) {
            let param = {
              TEN_DANH_MUC: this.strTenDMuc,
              MA_DVIQLY: this.strMaDviqly,
              PARAM: ""
            };

            this.serviceBase.getDataByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC, param).subscribe((response: any) => {
              if (response.strError)
                console.log(response.strError);
              else {
                if (response.LST_OBJ.length > 0) {
                  response.LST_OBJ.forEach(element => {
                    element.validFrom = this.formatDateToString(new Date(element.validFrom));
                    element.validTo = this.formatDateToString(new Date(element.validTo));
                  });
                }
                this.setStorage(this.strTenDMuc + "-" + this.strMaDviqly, JSON.stringify(response));
                this.lstDMuc = response.LST_OBJ;
                this.lstCombo = [];
                if (this.defaultValue.trim().length > 0) {
                  this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
                }
                if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
                  this.lstDMuc.forEach(element => {
                    this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element })
                  });
                }
                let pa = this;
                setTimeout(function () {
                  pa.onInit.emit();
                }, 50);
              }
            }, error => {
              console.log(error);
            });

          }
          else { // NẾU CÓ TỒN TẠI THÌ LOAD TRONG LOCALSTORAGE DK1.2
            let strExists: string = this.getStorage(this.strTenDMuc + "-" + this.strMaDviqly);
            let data: any = JSON.parse(strExists);
            this.lstDMuc = data.LST_OBJ;
            this.lstCombo = [];
            if (this.defaultValue.trim().length > 0) {
              this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
            }
            if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
              this.lstDMuc.forEach(element => {
                this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
              });
            }
            let pa = this;
            setTimeout(function () {
              pa.onInit.emit();
            }, 50);
          }
        } else {
          this.lstCombo = [];
          let pa = this;
          setTimeout(function () {
            pa.onInit.emit();
          }, 50);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // HAM CUA COMPONENT CŨ
  resetData(input: any) {
    try {
      if (this.isLazy) return;
      // NEU KHONG PHAI LA DANH MUC MOI THI LOAD MAC DINH THEO CACH CU
      if (this._lstDanhMucMoi.indexOf(this.strTenDMuc) == -1) {
        if (this.strTenDMuc == "D_TKHOAN_DVI") {
          this.strParam = ""
        }

        let param = {
          TEN_DANH_MUC: this.strTenDMuc,
          MA_DVIQLY: this.strMaDviqly,
          PARAM: this.strParam
        };

        this.serviceBase.getDataByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC, param).subscribe((response: any) => {
          if (response.strError)
            console.log(response.strError);
          else {
            if (response.LST_OBJ.length > 0) {
              response.LST_OBJ.forEach(element => {
                element.validFrom = this.formatDateToString(new Date(element.validFrom));
                element.validTo = this.formatDateToString(new Date(element.validTo));
              });
            }
            this.setStorage(this.strTenDMuc + "-" + this.strMaDviqly, JSON.stringify(response));
            this.lstDMuc = response.LST_OBJ;
            this.lstCombo = [];
            if (this.defaultValue.trim().length > 0) {
              this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
            }
            this.lstDMuc.forEach(element => {
              this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element })
            });
            if (this.onReset) {
              this.onReset.emit();
            }
          }
        }, error => {
          console.log(error);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  formatDateToString(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
  }

  initBangDuLieu() {
    //ADD NEW TABLE DANH MUC
    this._colsDMuc = [];
    switch (this.strTenDMuc) {
      case 'D_NGANH_NGHE_DIST': {
        this._colsDMuc.push({ field: 'MA_NN', header: 'Mã NN', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'TEN_NN', header: 'Tên NN', style: { 'width': '200px' }, filter: true });
        break;
      }
      case 'D_SOGCS': {
        this._colsDMuc.push({ field: 'maSogcs', header: 'Mã sổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenSogcs', header: 'Tên sổ', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'soKy', header: 'Số kỳ', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'ngayGhi', header: 'Ngày ghi', style: { 'width': '80px' }, filter: true });
        break;
      }
      case 'D_SOGCSDN': {
        this._colsDMuc.push({ field: 'maSogcs', header: 'Mã sổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenSogcs', header: 'Tên sổ', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'soKy', header: 'Số kỳ', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'ngayGhi', header: 'Ngày ghi', style: { 'width': '80px' }, filter: true });
        break;
      }
      case 'D_SOGCSKH': {
        this._colsDMuc.push({ field: 'maSogcs', header: 'Mã sổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenSogcs', header: 'Tên sổ', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'soKy', header: 'Số kỳ', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'ngayGhi', header: 'Ngày ghi', style: { 'width': '80px' }, filter: true });
        break;
      }
      case 'TK_D_SOGCS': {
        this._colsDMuc.push({ field: 'maSogcs', header: 'Mã sổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenSogcs', header: 'Tên sổ', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'soKy', header: 'Số kỳ', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'ngayGhi', header: 'Ngày ghi', style: { 'width': '80px' }, filter: true });
        break;
      }
      case 'D_TO': {
        this._colsDMuc.push({ field: 'maTo', header: 'Mã tổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenTo', header: 'Tên tổ', style: { 'width': '300px' } });
        this._colsDMuc.push({ field: 'trangThai', header: 'Trạng thái', style: { 'width': '60px' }, filter: true });
        break;
      }
      case 'TK_D_TO': {
        this._colsDMuc.push({ field: 'maTo', header: 'Mã tổ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenTo', header: 'Tên tổ', style: { 'width': '300px' } });
        this._colsDMuc.push({ field: 'trangThai', header: 'Trạng thái', style: { 'width': '60px' }, filter: true });
        break;
      }
      case 'D_NHANG': {
        this._colsDMuc.push({ field: 'MA_NHANG', header: 'Mã ngân hàng', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'SO_TKHOAN', header: 'Số tài khoản', style: { 'width': '120px' } });
        this._colsDMuc.push({ field: 'TEN_NHANG', header: 'Tên ngân hàng', style: { 'width': '260px' }, filter: true });
        this._colsDMuc.push({ field: 'DIA_CHI', header: 'Địa chỉ', style: { 'width': '260px' }, filter: true });
        break;
      }
      case 'TK_D_NHANG': {
        this._colsDMuc.push({ field: 'MA_NHANG', header: 'Mã ngân hàng', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'SO_TKHOAN', header: 'Số tài khoản', style: { 'width': '120px' } });
        this._colsDMuc.push({ field: 'TEN_NHANG', header: 'Tên ngân hàng', style: { 'width': '260px' }, filter: true });
        this._colsDMuc.push({ field: 'DIA_CHI', header: 'Địa chỉ', style: { 'width': '260px' }, filter: true });
        break;
      }
      case 'D_TRAM': {
        this._colsDMuc.push({ field: 'maTram', header: 'Mã trạm', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenTram', header: 'Tên trạm', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'loaiTram', header: 'Loại trạm', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'csuatTram', header: 'Công suất', style: { 'width': '80px' } });
        break;
      }
      case 'D_LO_CAP_DAP': {
        this._colsDMuc.push({ field: 'MA_LO', header: 'Mã lộ', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'TEN_LO', header: 'Tên lộ', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'LOAI_LO', header: 'Loại lộ', style: { 'width': '80px' }, filter: true });
        this._colsDMuc.push({ field: 'TEN_CAPDA', header: 'Cấp điện áp', style: { 'width': '80px' } });
        break;
      }
      case 'D_DVI_DCHINH': {
        this._colsDMuc.push({ field: 'idDiaChinh', header: 'Id địa chính', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'maDvidchinh', header: 'Mã địa chính', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenDvidchinh', header: 'Tên địa chính', style: { 'width': '200px' } });
        this._colsDMuc.push({ field: 'ngayHluc', header: 'Ngày hiệu lực', style: { 'width': '80px' } });
        break;
      }
      case 'D_NHOM_NN': {
        this._colsDMuc.push({ field: 'maNhomnn', header: 'Mã nhóm NN', style: { 'width': '100px' }, sortable: true, filter: true });
        this._colsDMuc.push({ field: 'tenNhomnn', header: 'Tên nhóm NN', style: { 'width': '350px' }, filter: true });
        this._colsDMuc.push({ field: 'moTa', header: 'Mô tả' });
        break;
      }
      case 'D_PUBLIC_KEY': {
        this._colsDMuc.push({ field: 'idKey', header: 'ID KEY', style: { 'width': '10%' }, filter: true });
        this._colsDMuc.push({ field: 'signName', header: 'Tên người ký', style: { 'width': '40%' }, filter: true });
        this._colsDMuc.push({ field: 'validFrom', header: 'Hiệu lực từ ngày', style: { 'width': '15%' }, filter: true });
        this._colsDMuc.push({ field: 'validTo', header: 'Hiệu lực đến ngày', style: { 'width': '15%' }, filter: true });
        this._colsDMuc.push({ field: 'congCu', header: 'Công cụ', style: { 'width': '20%' }, filter: true });
        break;
      }
    }
  }

  ngAfterViewInit() {
    //this.onInit.emit();
  }

  // HAM CUA COMPONENT CŨ
  search(event: any) {
    if (this.isLazy) return;
    console.log(event);
    this.lstCombo = [];
    if (this.defaultValue.trim().length > 0) {
      this.lstCombo.push({ label: this.defaultValue, value: '-1', item: '' });
    }
    if (event.query && event.query.toString().length > 0) {
      this.lstDMuc.forEach(element => {
        if (!element[this.strValueName] || !element[this.strLabelName]) {
          console.log('Chưa nhập value/label name');
          return;
        }
        let strAll = element[this.strValueName] + " - " + element[this.strLabelName];
        if (strAll.toLowerCase().indexOf(event.query.toString().toLowerCase()) >= 0)
          this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
      });
    }
    else {
      this.lstDMuc.forEach(element => {
        this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
      });
      if (this.defaultVal() != undefined) {
        this.selectedDMuc = this.defaultVal();
        this.propagateChange(this.selectedDMuc);
        if (this.onChange)
          this.onChange.emit(this.defaultVal());
      }
    }
  }

  onChangeTram(event) {
    console.log("dtuong onChangeTram", event);
    this.onChange.emit(event);
  }

  // SET SELECTED DANH MỤC
  public setSelectedItem(value: any) {
    if (this.isLazy) {
      this.bindingValue = value;
      return;
    }
    console.log("SELECTED DANH MỤC", this.strTenDMuc, value);
    if (this._lstDanhMucMoi.indexOf(this.strTenDMuc) == -1) {
      let result = undefined;
      try {
        if (value && value.length > 0) {
          let sel = this.lstDMuc.filter(c => c[this.strValueName] == value);
          if (sel && sel.length > 0) {
            if (this.strUIType == 1) {
              this.selectedDMuc = value;
              result = { label: sel[0][this.strValueName] + " - " + sel[0][this.strLabelName], value: sel[0][this.strValueName], item: sel[0] };
            }
            else {
              this.selectedDMuc = { label: sel[0][this.strValueName] + " - " + sel[0][this.strLabelName], value: sel[0][this.strValueName], item: sel[0] };
              result = this.selectedDMuc;
            }
          }
          else {
            // neu ko co dư liệu thì get dư liệu từ server khi là danh mục mới
            this.selectedDMuc = this.defaultVal();
            result = this.selectedDMuc;
          }
        }
        else {
          this.selectedDMuc = this.defaultVal();
          result = this.selectedDMuc;
        }
        this.propagateChange(this.selectedDMuc);

      }
      catch (e) {
        console.log(e);
        this.selectedDMuc = this.defaultVal();
        this.propagateChange(this.selectedDMuc);
        result = this.selectedDMuc;
      }
      if (this.onChange)
        this.onChange.emit(result);
    } else {
      try {
        if (value && value.length > 0) {
          this.LoadData_ByMaDT(value);
        } else {
          this.selectedDMuc = this.defaultVal();
          this.propagateChange(this.selectedDMuc);
          this.onChange.emit(this.selectedDMuc);
        }
      } catch (e) {
        this.selectedDMuc = this.defaultVal();
        this.propagateChange(this.selectedDMuc);
        this.onChange.emit(this.selectedDMuc);
      }
    }
  }

  public setSelectedIndex(value: number) {
    try {
      if (this.isLazy) return;
      if (value && value >= 0) {
        let sel = this.lstDMuc[value];
        this.selectedDMuc = sel;
      }
      else {
        this.selectedDMuc = this.defaultVal();
      }
      this.propagateChange(this.selectedDMuc);

    }
    catch (e) {
      console.log(e);
      this.selectedDMuc = this.defaultVal();
      this.propagateChange(this.selectedDMuc);
    }
  }

  defaultVal() {
    let def = this.strUIType == 1 ? "" : undefined;
  }

  showSelect(event: any) {
    if (this.isLazy) return;
    this.propagateChange(this.selectedDMuc);
    if (this.selectedDMuc) {
      if (this.onChange) {
        if (this.strUIType == 1) {
          let selectedItem = this.lstDMuc.filter(task => task[this.strValueName] == this.selectedDMuc);
          let ret = { label: selectedItem[0][this.strValueName] + " - " + selectedItem[0][this.strLabelName], value: selectedItem[0][this.strValueName], item: selectedItem[0] };
          this.onChange.emit(ret);
        }
        else
          this.onChange.emit(this.selectedDMuc);
      }
    }
    else {
      if (this.onChange)
        this.onChange.emit(this.defaultVal());
    }

  }

  private propagateChange = (_: any) => { };

  // XỬ LÝ DỮ LIỆU TRUYỀN VÀO NGMODEL
  writeValue(obj: any) {
    if (this.isLazy) return;
    this.selectedDMuc = obj;
    console.log(`gia tri truyen vao writeValue ${this.strUIType} - ${this.strTenDMuc}`, obj);
    if (this.strUIType == 1 && this.isLoadLocal == false) {
      this.selectedDMucSelected = obj == undefined ? "" : obj.toString();
    }
    if (this.strUIType == 2 && this.isLoadLocal == false) {
      if (obj && obj.value) {
        this.selectedDMucSelected = obj.value.toString();
      } else this.selectedDMucSelected = "";
      console.log("gia tri set", this.selectedDMucSelected);
    }
    if (this.strUIType == 3 && this.isLoadLocal == false) {
      if (obj != undefined) {
        for (let item of obj) {
          this.selectedDMucSelected += item.maSogcs + ";";
        }
        if (this.selectedDMucSelected.indexOf(";") != -1)
          this.selectedDMucSelected = this.selectedDMucSelected.substr(0, this.selectedDMucSelected.length - 1);

      } else this.selectedDMucSelected = "";
    }
  }

  registerOnChange(fn: any) { this.propagateChange = fn; }

  registerOnTouched(fn: any) { }

  // CHON DANH MUC
  btnDanhMuc_click(event, overlaypanel: OverlayPanel) {
    // kiem tra list chon
    this.getDanhMucWithOverlay(event, overlaypanel);
  }

  private getDanhMucWithOverlay(event: any, overlaypanel: OverlayPanel) {
    try {
      let exists: boolean = false;
      // NEU DA CO THI LOAD DANH MỤC SẴN CÓ
      // NEU THAY DOI DIEU KIEN TIM KIEM THI LOAD LAI LIST SAVE DANH MUC
      let strDkTimKiemMoi = "";
      if (this.strUIType != 3) strDkTimKiemMoi = this.selectedDMucSelected.trim();
      else {
        if (this.selectedDMucSelected.trim().indexOf(';') < 0) {
          strDkTimKiemMoi = this.selectedDMucSelected.trim();
        }
      }
      console.log(this._strDkTimKiemCu + " - " + strDkTimKiemMoi)
      if (this._strDkTimKiemCu.trim() != strDkTimKiemMoi) {
        this._saveDMuc = {};
        if (this._lstDMuc.length > 0) {
          this._lstDMuc.forEach(element => {
            element.IS_SELECTED = 0;
          });
          this._lstDMucSelected = [];
        }
      }
      this._lstDMuc = [];

      console.log("savefull", this._saveDMuc_Full);
      console.log("save", this._saveDMuc);
      // KIỂM TRA NẾU ĐIỀU KIỆN TÌM KIẾM LÀ FULL
      if (strDkTimKiemMoi.trim() == "") {
        //2.2.1
        if (this._saveDMuc_Full[this.strTenDMuc]) {
          this._saveDMuc = this._saveDMuc_Full;
          console.log("2.2.1")
        } else {
          //2.2.2

          let exists: boolean = false;
          if (this.getStorage(this.strTenDMuc + "-" + this.strMaDviqly) != "") {
            exists = true;
          }
          if (exists) {
            console.log("2.2.2")
            let strExists: string = this.getStorage(this.strTenDMuc + "-" + this.strMaDviqly);

            let data: any = JSON.parse(strExists);
            console.log("data storage", data);
            this._saveDMuc_Full[this.strTenDMuc] = data.LST_OBJ;
            this._saveDMuc[this.strTenDMuc] = data.LST_OBJ;
            console.log("2.2.2")
          }
        }
      }

      //2.2.3
      console.log("_saveDMuc", this._saveDMuc);
      if (this._saveDMuc[this.strTenDMuc]) {
        console.log("2.2.3")
        this._strDkTimKiemCu = strDkTimKiemMoi;
        this._lstDMuc = this._saveDMuc[this.strTenDMuc];

        // GAN LIST COMBO CHO THAO TAC CU
        this.lstCombo = [];
        if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
          this.lstDMuc.forEach(element => {
            this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
          });
        }

        overlaypanel.toggle(event);
        return;
      }
      else {
        console.log("2.2.3")
        // CHƯA CÓ TRONG LOCALSTORAGE THÌ LOAD MỚI TỪ SERVER
        this._controlSelected = event;
        var inputData = { TEN_DANH_MUC: this.strTenDMuc, MA_DVIQLY: this.strMaDviqly, PARAM: strDkTimKiemMoi };

        this.serviceBase.getDataByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC_LIKE_DK, inputData).subscribe((rsp: any) => {
          if (this.strTenDMuc == 'D_PUBLIC_KEY') {
            rsp.LST_OBJ.forEach(element => {
              element.validFrom = this.formatDateToString(new Date(element.validFrom));
              element.validTo = this.formatDateToString(new Date(element.validTo));
            });
          }
          this._strDkTimKiemCu = strDkTimKiemMoi;

          if (rsp.strError != '') {
            overlaypanel.hide();
            this.setTrangThaiTK(false);
            return;
          }
          if (rsp.LST_OBJ.length == 0) {
            overlaypanel.hide();
            this.setTrangThaiTK(false);
            return;
          }

          this._lstDMuc = rsp.LST_OBJ;
          this._saveDMuc[this.strTenDMuc] = this._lstDMuc;

          // GAN LIST COMBO CHO THAO TAC CU
          this.lstCombo = [];
          if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
            this.lstDMuc.forEach(element => {
              this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
            });
          }

          if (strDkTimKiemMoi == "") {
            this.setStorage(this.strTenDMuc + "-" + this.strMaDviqly, JSON.stringify(rsp));
          }
          if (strDkTimKiemMoi == "") { // LƯU BẢNG FULL
            this._saveDMuc_Full[this.strTenDMuc] = this._lstDMuc;
          }
          overlaypanel.toggle(this._controlSelected);
        }, error => {
          overlaypanel.hide();
          console.log("getDanhMuc", error);
        });

      }
    } catch (error) {
      console.error(error);
    }
  }

  daoChon_onChange() {
    this._lstDMucSelected = this.daoGiaTriChon(this._lstDMucSelected, this._lstDMuc);
  }

  public daoGiaTriChon(lstSelected, lstAllData) {
    let lstReturn = new Array();

    for (let e of lstAllData) {
      e.IS_SELECTED = "0";
      if (lstSelected.indexOf(e) < 0) {
        e.IS_SELECTED = "1";
        lstReturn.push(e);
      }
    }
    return lstReturn;
  }

  btnChon_click(overlaypanel: OverlayPanel) {
    this.setTrangThaiTK(true);
    if (this.strUIType == 3) {
      this.selectedDMuc = [];
    }
    else if (this.strUIType == 2) {
      this.selectedDMuc = null;
    }
    //this._strDSDuLieu = "";
    this.selectedDMucSelected = "";

    if (this._lstDMucSelected == null) {
      this.propagateChange(this.selectedDMuc);
      this.onChange.emit(this.selectedDMuc);
      overlaypanel.hide();
      this._isValidate = false;
      return;
    }
    if (this._lstDMucSelected.length == 0) {
      this.propagateChange(this.selectedDMuc);
      this.onChange.emit(this.selectedDMuc);
      this._isValidate = false;
      overlaypanel.hide();
      return;
    }

    // NEU LA MULTISELECT
    if (this._lstDMucSelected.length > 0) {
      for (let item of this._lstDMucSelected) {
        if (this.selectedDMucSelected.indexOf(item.maSogcs) == -1) {
          switch (this.strTenDMuc) {
            case "D_SOGCS": {
              if (this.strUIType == 3) {
                this.selectedDMucSelected += item.maSogcs + ";";
                this.selectedDMuc.push(item.maSogcs);
              }
              else if (this.strUIType == 2) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
              }
              else if (this.strUIType == 1) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc += item.maSogcs;
              }
              break;
            }
            case "D_TRAM": {
              if (this.strUIType == 3) {
                this.selectedDMucSelected += item.maTram + ";";
                this.selectedDMuc.push(item.maTram);
              }
              else if (this.strUIType == 2) {
                this.selectedDMucSelected = item.maTram;
                this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
              }
              else if (this.strUIType == 1) {
                this.selectedDMucSelected = item.maTram;
                this.selectedDMuc += item.maTram;
              }
              break;
            }
            case "D_SOGCSKH": {
              if (this.strUIType == 3) {
                this.selectedDMucSelected += item.maSogcs + ";";
                this.selectedDMuc.push(item.maSogcs);
              }
              else if (this.strUIType == 2) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
              }
              else if (this.strUIType == 1) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc += item.maSogcs;
              }
              break;
            }
            case "D_SOGCSDN": {
              if (this.strUIType == 3) {
                this.selectedDMucSelected += item.maSogcs + ";";
                this.selectedDMuc.push(item.maSogcs);
              }
              else if (this.strUIType == 2) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
              }
              else if (this.strUIType == 1) {
                this.selectedDMucSelected = item.maSogcs;
                this.selectedDMuc += item.maSogcs;
              }
              break;
            }
            case "TK_D_SOGCS":
              {
                this.selectedDMuc += item.maSogcs + ";";
                break;
              }
            case "D_DVI_DCHINH":
              {
                this.selectedDMucSelected += item.idDiaChinh + ";";
                this.selectedDMuc.push(item.idDiaChinh);
                break;
              }

          };
        }
      }
      if (this.selectedDMucSelected.indexOf(";") != -1)
        this.selectedDMucSelected = this.selectedDMucSelected.substr(0, this.selectedDMucSelected.length - 1);

    }
    else { // NEU KO PHAI LA MULTISELECT
      switch (this.strTenDMuc) {
        case "D_SOGCS": {
          if (this.strUIType == 3) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
          }
          else if (this.strUIType == 2) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
          }
          else if (this.strUIType == 1) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = this._lstDMucSelected["maSogcs"];
          }
          break;
        }
        case "D_TRAM": {
          if (this.strUIType == 3) {
            this.selectedDMucSelected += this._lstDMucSelected["maTram"];
            this.selectedDMuc.push(this._lstDMucSelected["maTram"]);
          }
          else if (this.strUIType == 2) {
            this.selectedDMucSelected += this._lstDMucSelected["maTram"];
            this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
          }
          else if (this.strUIType == 1) {
            this.selectedDMucSelected += this._lstDMucSelected["maTram"];
            this.selectedDMuc = this._lstDMucSelected["maTram"];
          }
          break;
        }
        case "D_SOGCSKH": {
          if (this.strUIType == 3) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
          }
          else if (this.strUIType == 2) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
          }
          else if (this.strUIType == 1) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = this._lstDMucSelected["maSogcs"];
          }
          break;
        }
        case "D_SOGCSDN": {
          if (this.strUIType == 3) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
          }
          else if (this.strUIType == 2) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
          }
          else if (this.strUIType == 1) {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            this.selectedDMuc = this._lstDMucSelected["maSogcs"];
          }
          break;
        }
        case "TK_D_SOGCS":
          {
            this.selectedDMucSelected += this._lstDMucSelected["maSogcs"];
            break;
          }
        case "D_DVI_DCHINH":
          {
            this.selectedDMucSelected += this._lstDMucSelected["idDiaChinh"];
            this.selectedDMuc.push(this._lstDMucSelected["idDiaChinh"]);
            break;
          }
        default:
          {
            this.selectedDMucSelected += this._lstDMucSelected[this.strValueName];
            if (this.strUIType == 3)
              this.selectedDMuc.push(this._lstDMucSelected[this.strValueName]);
            else if (this.strUIType == 2)
              this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
            else if (this.strUIType == 1)
              this.selectedDMuc = this._lstDMucSelected[this.strValueName];
            break;
          }
      };
      if (this.selectedDMucSelected.indexOf(";") != -1)
        this.selectedDMucSelected = this.selectedDMucSelected.substr(0, this.selectedDMucSelected.length - 1);
    }


    //NEU LA UI 3 VÀ QUÁ NHIỀU ĐỐI TƯỢNG THÌ LÀM GỌN
    if (this.strUIType == 3) {
      if (this._lstDMucSelected.length > 10) {
        this.selectedDMucSelected = this._lstDMucSelected.length.toString() + " đối tượng: (" + this.selectedDMucSelected + ")";
      }
    }

    // HIỆU LỰC VÀ EMIT GIÁ TRỊ
    this.propagateChange(this.selectedDMuc);
    this.onChange.emit(this.selectedDMuc);
    overlaypanel.hide();
    this._isValidate = true;
  }

  enterStrDanhMuc(e, overlaypanel: OverlayPanel) {
    //console.log(e);
    this.setTrangThaiTK(true);

    let keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode == 13) {
      this.selectedDMucSelected = this.selectedDMucSelected.toUpperCase();
      //VALIDATE DU LIEU
      if (this.selectedDMucSelected.trim() == "") {
        this._isValidate = false;
        if (this._lstDMuc.length > 0) {
          this._lstDMuc.forEach(element => {
            element.IS_SELECTED = 0;
          });
          this._lstDMucSelected = [];
        }
        this.enterDM.emit(this._lstDMucSelected);
        this.selectedDMuc = this.defaultVal();
        this.propagateChange(this.selectedDMuc);
      } else {
        this._isEnter = true;
        this.ValidateStrTK();
        //this.enterDanhMuc.emit(this.selectedDMuc);
      }
    } else {
      if (keyCode == 32) {
        this.selectedDMucSelected = this.selectedDMucSelected.toUpperCase();
        e.preventDefault();
        var a = document.getElementById(this.BtnLoadDM);
        //let sdf = document.getElementById('buttonxem') as HTMLButtonElement;
        a.dispatchEvent(new MouseEvent('click', { shiftKey: false }))
      } else {
        this.selectedDMuc = this.defaultVal();
        this.propagateChange(this.selectedDMuc);
        this._isValidate = false;

      }
    }

  }

  setTrangThaiTK(trangthaitk) {
    if (!trangthaitk) {

      this.dte.nativeElement.style.color = 'red';
      // this.dte.nativeElement.style.border =  'red';
    } else {
      this.dte.nativeElement.style.color = 'black';
      //this.dte.nativeElement.style.border.color = 'black';
    }
  }

  async ValidateStrTK() {
    this.selectedDMucSelected = this.selectedDMucSelected.toUpperCase();
    let onchangeValue = undefined;
    if (!this._isValidate) {
      // let ChuoiTk = this.selectedDMucSelected.trim().toString().sp
      let strval = this.selectedDMucSelected.trim();

      // NẾU KO CÓ DỮ LIỆU TÌM KIẾM THÌ XUẤT LUÔN
      if (strval == "") {
        this.selectedDMuc = [];
        this._isValidate = false;

        this.propagateChange(this.selectedDMuc);
        this.onChange.emit(onchangeValue);
        //NẾU LÀ VALIDATE THÌ EMIT VALIDATE NẾU ENTER THÌ EMIT ENTER
        if (!this._isEnter) {
          console.log("validate");
          this.onValidate.emit(this._isValidate);
        } else {
          console.log("enter");
          this.enterDM.emit(this.selectedDMuc);
          this._isEnter = false;
        }
        return "";
      }

      var inputData = { TEN_DANH_MUC: this.strTenDMuc, MA_DVIQLY: this.strMaDviqly, PARAM: strval };
      let rsp = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.VALIDATE_DANH_MUC, inputData);
      {
        console.log("List validate", rsp);
        let ListVal = rsp.ListVaL;
        let ListErr = rsp.ListErr;

        if (rsp.TYPE == 'ERROR' || ListErr != "") {
          this.selectedDMuc = [];
          this._isValidate = false;
          this.setTrangThaiTK(this._isValidate);
        }


        if (rsp.TYPE != 'ERROR' && ListVal.length != undefined && ListVal.length != 0 && ListVal != []) {
          // NEU CO DU LIEU THI REFRESH LIST
          this._saveDMuc = {};
          if (this._lstDMuc.length > 0) {
            this._lstDMuc.forEach(element => {
              element.IS_SELECTED = 0;
            });
            this._lstDMucSelected = [];
          }

          // GAN DU LIEU TRA VE
          this._lstDMuc = ListVal;
          this._lstDMucSelected = this._lstDMuc;
          this._saveDMuc[this.strTenDMuc] = this._lstDMuc;
          this._strDkTimKiemCu = this.selectedDMucSelected;

          // GAN LIST COMBO CHO THAO TAC CU
          this.lstCombo = [];
          if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
            this.lstDMuc.forEach(element => {
              this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
            });
          }

          // SET UP DU LIEU TRA RA FORM CHA
          // NEU LA MULTISELECT
          this.selectedDMuc = [];
          if (this._lstDMucSelected.length > 0) {
            for (let item of this._lstDMucSelected) {
              switch (this.strTenDMuc) {
                case "D_SOGCS": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  break;
                }
                case "D_SOGCSKH": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  break;
                }
                case "D_SOGCSDN": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  break;
                }
              };

            }
          }
          else { // NEU KO PHAI LA MULTISELECT
            switch (this.strTenDMuc) {
              case "D_SOGCS": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
              case "D_SOGCSKH": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
              case "D_SOGCSDN": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
            };
          }

          if (ListErr == "")
            this._isValidate = true;

        } else {
          this.selectedDMuc = [];
          this._isValidate = false;
        }

        this.setTrangThaiTK(this._isValidate);
        this.propagateChange(this.selectedDMuc);
        this.onChange.emit(onchangeValue);
        //NẾU LÀ VALIDATE THÌ EMIT VALIDATE NẾU ENTER THÌ EMIT ENTER
        if (!this._isEnter) {
          console.log("validate");
          this.onValidate.emit(this._isValidate);
        } else {
          console.log("enter");
          this.enterDM.emit(this.selectedDMuc);
          this._isEnter = false;
        }
        console.log("ListErr", ListErr);
        return ListErr;

      }
    } else {
      this.propagateChange(this.selectedDMuc);
      console.log("selected item", this.selectedDMuc);
      this.onChange.emit(this.selectedDMuc);
      //NẾU LÀ VALIDATE THÌ EMIT VALIDATE NẾU ENTER THÌ EMIT ENTER
      if (!this._isEnter) {
        console.log("validate");
        this.onValidate.emit(this._isValidate);
      } else {
        console.log("enter");
        this.enterDM.emit(this.selectedDMuc);
        this._isEnter = false;
      }
      return "";
    }
  }

  async LoadData_ByMaDT(MaDoiTuong) {
    this.selectedDMucSelected = MaDoiTuong;
    this.selectedDMucSelected = this.selectedDMucSelected.toUpperCase();
    this._isValidate = false;
    let onchangeValue = undefined;
    if (!this._isValidate) {
      // let ChuoiTk = this.selectedDMucSelected.trim().toString().sp
      let strval = this.selectedDMucSelected.trim();

      if (strval == "") {
        this.selectedDMuc = [];
        this._isValidate = false;

        this.propagateChange(this.selectedDMuc);
        this.onChange.emit(onchangeValue);
        //NẾU LÀ VALIDATE THÌ EMIT VALIDATE NẾU ENTER THÌ EMIT ENTER
        if (!this._isEnter) {
          console.log("validate");
          this.onValidate.emit(this._isValidate);
        } else {
          console.log("enter");
          this.enterDM.emit(this.selectedDMuc);
          this._isEnter = false;
        }
        return this.selectedDMuc;
      }

      var inputData = { TEN_DANH_MUC: this.strTenDMuc, MA_DVIQLY: this.strMaDviqly, PARAM: strval };
      let rsp = await this.serviceBase.getData_AsyncByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.VALIDATE_DANH_MUC, inputData);
      {
        console.log("List validate", rsp);
        let ListVal = rsp.ListVaL;
        let ListErr = rsp.ListErr;

        if (rsp.TYPE == 'ERROR' || ListErr != "") {
          this.selectedDMuc = [];
          this._isValidate = false;
          this.setTrangThaiTK(this._isValidate);
        }


        if (rsp.TYPE != 'ERROR' && ListVal.length != undefined && ListVal.length != 0 && ListVal != []) {
          // NEU CO DU LIEU THI REFRESH LIST
          this._saveDMuc = {};
          if (this._lstDMuc.length > 0) {
            this._lstDMuc.forEach(element => {
              element.IS_SELECTED = 0;
            });
            this._lstDMucSelected = [];
          }

          // GAN DU LIEU TRA VE
          this._lstDMuc = ListVal;
          this._lstDMucSelected = this._lstDMuc;
          this._saveDMuc[this.strTenDMuc] = this._lstDMuc;
          this._strDkTimKiemCu = this.selectedDMucSelected;

          // GAN LIST COMBO CHO THAO TAC CU
          this.lstCombo = [];
          if (this.lstDMuc != undefined && this.lstDMuc.length > 0) {
            this.lstDMuc.forEach(element => {
              this.lstCombo.push({ label: element[this.strValueName] + " - " + element[this.strLabelName], value: element[this.strValueName], item: element });
            });
          }

          // SET UP DU LIEU TRA RA FORM CHA
          // NEU LA MULTISELECT
          this.selectedDMuc = [];
          if (this._lstDMucSelected.length > 0) {
            for (let item of this._lstDMucSelected) {
              switch (this.strTenDMuc) {
                case "D_SOGCS": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  break;
                }
                case "D_SOGCSKH": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  break;
                }
                case "D_SOGCSDN": {
                  if (this.strUIType == 3) {
                    this.selectedDMuc.push(item.maSogcs);
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  else if (this.strUIType == 2) {
                    this.selectedDMuc = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  else if (this.strUIType == 1) {
                    this.selectedDMuc += item.maSogcs;
                    onchangeValue = { label: item[this.strValueName] + " - " + item[this.strLabelName], value: item[this.strValueName], item: item };

                  }
                  break;
                }
              };

            }
          }
          else { // NEU KO PHAI LA MULTISELECT
            switch (this.strTenDMuc) {
              case "D_SOGCS": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };

                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
              case "D_SOGCSKH": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
              case "D_SOGCSDN": {
                if (this.strUIType == 3) {
                  this.selectedDMuc.push(this._lstDMucSelected["maSogcs"]);
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 2) {
                  this.selectedDMuc = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                else if (this.strUIType == 1) {
                  this.selectedDMuc = this._lstDMucSelected["maSogcs"];
                  onchangeValue = { label: this._lstDMucSelected[this.strValueName] + " - " + this._lstDMucSelected[this.strLabelName], value: this._lstDMucSelected[this.strValueName], item: this._lstDMucSelected };
                }
                break;
              }
            };
          }

          if (ListErr == "")
            this._isValidate = true;

        } else {
          onchangeValue = [];
          this.selectedDMuc = [];
          this._isValidate = false;
        }

        this.setTrangThaiTK(this._isValidate);
        this.propagateChange(this.selectedDMuc);
        this.onChange.emit(onchangeValue);
        //NẾU LÀ VALIDATE THÌ EMIT VALIDATE NẾU ENTER THÌ EMIT ENTER
        if (!this._isEnter) {
          console.log("validate");
          this.onValidate.emit(this._isValidate);
        } else {
          console.log("enter");
          this.enterDM.emit(this.selectedDMuc);
          this._isEnter = false;
        }
        console.log("return list on child", ListVal);
        return ListVal;

      }
    }
  }
}
/** MÔ TẢ NGHIỆP VỤ

1. Khởi tạo:
  - Nếu thuộc danh mục cũ - vẫn load và lưu local storage như cũ
  - Nếu thuộc danh mục mới + isLoadLocal = true - vẫn load và lưu local storage như cũ
  ==> các form hiệu chỉnh xong sẽ truyền isLoadLocal = false để disable load ban đầu đi
  (mặc định về sau sẽ không làm việc với local storage)

2. Thao tác : bấm dấu + hoặc dùng phím Space Bar
  2.1- Nếu ko có dữ liệu mã được điền vào ô text ==> select full
    2.2.1- Nếu có trong Savedanhmuc  ==> get từ savedanhmuc
    2.2.2- Nếu có trong local storage  ==> get từ local storage ==> savedanhmuc
    2.2.3- Nếu không tồn tại lịch sử thì get từ server ==> save localstorage ==> savedanhmuc
    save vào listdm_full

  2.2-  Nếu có dữ liệu:
    2.2.1- Nếu điều kiện tìm kiếm giống điều kiện tìm kiếm trước ==> get dữ liệu từ savedanhmuc
    2.2.2- Nếu khác ==> get dữ liệu từ server ==> savedanhmuc
      > Nếu có dữ liệu : show dialog chọn
      > Nêu ko có báo lỗi tìm kiếm (red color)
3. Thao tác chọn sổ : show danh sách mã sổ được chọn và set isValidate = true
    Nếu có thay đổi trong textbox hiển thị thì set lại isValidate = false
4. Thao tác Enter (xác nhận dữ liệu)
  3.1- Nếu isValidate = true ==> emit ra form cha this.onValidate.emit(true);
  3.2- Nếu isValidate = false ==> kiểm tra dữ liệu textbox
      > Nếu false: báo lỗi ra textbox +  this.onValidate.emit(this._isValidate);
      > nếu true: emit ra form cha this.onValidate.emit(true);


5. Form cha bỏ qua các bước cần thiết và bấm nút thao tác (1 action trên form cha)
  => gọi hàm ValidateStrTK ở component , hứng ở onValidate của component (true/false)


 */
