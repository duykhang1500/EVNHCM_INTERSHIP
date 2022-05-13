import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as API from 'src/app/services/apiURL';
import { ShareData } from '../../components-customer';
import { iComponentBase, mType } from '../../functions/iComponentBase.component';
import { iServiceBase } from '../../functions/iServiceBase';
import { TTinKHang } from '../../models/thong-tin-khach-hang.model';

@Component({
  selector: 'cmis-tim-kiem-khach-hang',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tim-kiem-khach-hang.component.html',
  styles: [`
    .p-datatable-scrollable-body  {
      overflow-y: hidden !important;
    }
  
  `]
})

export class TimKiemKhachHangComponent extends iComponentBase implements OnInit, AfterViewInit {
  _sMaDvi = this.getUserInformation()[0].SUBDIVISIONID;
  _lstLoaiHopDong: any = [];
  _lstLoaiHopDongSelected: any = [];
  _lstKHSelected: any = [];
  _lstKH: any = [];
  _lstNhomKH: any = [];
  _lstNhomKHSelected: any = [];
  _lstHttt: any = [];
  _lstHtttSelected: any = [];
  _lstPttt: any = [];
  _lstPtttSelected: any = [];
  [x: string]: any;
  // Loại tìm kiếm
  _lstLoaiTimKiem: any[];
  _loaiTimKiem: any;
  // Là hợp đồng thanh lý
  _isHopDongThanhLy: boolean = false;
  _lstLoaiHD: any[] = new Array();
  // Giá trị tìm kiếm
  _giaTriTimKiem: any = '';
  // Đơn vị quản lý
  _lstDonViQuanLy: any[];
  _donViQuanLy: any;
  // Danh sách tìm kiếm
  _lstDSTimKiem: TTinKHang[] = new Array();
  listDSTimKiemStorage: TTinKHang[] = new Array();
  _khachHangSelected: TTinKHang;
  // Disable Button TimKiem
  _disableBtnTimKiem: boolean = false;
  // Danh sách cột trong bản tìm kiếm
  _colsKetQuaTimKiem: any[];
  _itemsCxtMenu: any[];
  _userInfo: any[];
  _nghiepvu: any;
  displayDialog: boolean = false;
  checked: boolean = false;
  checkedOnlyHetHLuc: boolean = false;
  _hdongData: any;
  _exportData: any[];
  _phanHe: String = "HOP_DONG";
  _displayDialog: boolean = false;
  timTheoNgayKy: boolean;

  @Input() lblNghiepvu: string = '';
  @Input() hideColDialog: boolean = true;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor(private serviceBase: iServiceBase,
    private _route: Router,
    public dataSrv: ShareData,
    msg: MessageService,) {
    super(msg);
    this._userInfo = this.getUserInformation();
    this._nghiepvu = this.getSystemParam()[0].param;
  }

  ngOnInit() {
    // init loại tìm kiếm
    this.getMultiData();
    this._lstLoaiTimKiem = [];

    this._lstLoaiTimKiem.push({ label: 'Mã khách hàng', value: { id: 3, name: 'Mã khách hàng' } });
    this._lstLoaiTimKiem.push({ label: 'Mã số GCS', value: { id: 0, name: 'Mã số GCS' } });
    this._lstLoaiTimKiem.push({ label: 'Mã ghi chữ (KVực + STT)', value: { id: 1, name: 'Mã ghi chữ (KVực + STT)' } });
    this._lstLoaiTimKiem.push({ label: 'Mã trạm', value: { id: 2, name: 'Mã trạm' } });
    this._lstLoaiTimKiem.push({ label: 'Tên khách hàng', value: { id: 4, name: 'Tên khách hàng' } });
    this._lstLoaiTimKiem.push({ label: 'Địa chỉ dùng điện', value: { id: 5, name: 'Địa chỉ dùng điện' } });
    this._lstLoaiTimKiem.push({ label: 'Số điện thoại khách hàng', value: { id: 6, name: 'Số điện thoại khách hàng' } });
    this._lstLoaiTimKiem.push({ label: 'Mã hợp đồng', value: { id: 7, name: 'Mã hợp đồng' } });
    this._lstLoaiTimKiem.push({ label: 'Mã điểm đo', value: { id: 8, name: 'Mã điểm đo' } });
    this._lstLoaiTimKiem.push({ label: 'Số công tơ', value: { id: 9, name: 'Số công tơ' } });
    this._lstLoaiTimKiem.push({ label: 'Nhóm khách hàng', value: { id: 10, name: 'Nhóm khách hàng' } });
    this._lstLoaiTimKiem.push({ label: 'Ngày ký hợp đồng', value: { id: 13, name: 'Ngày ký hợp đồng' } });

    this._loaiTimKiem = this._lstLoaiTimKiem[0].value;
    this.timTheoNgayKy = false;

    // init đơn vị quản lý
    this._lstDonViQuanLy = [];
    this._lstDonViQuanLy.push({ label: this._userInfo[0].SUBDIVISIONNAME, value: { id: 1, MaDVQL: this._userInfo[0].SUBDIVISIONID } });
    this._donViQuanLy = this._lstDonViQuanLy[0].value;

    this._itemsCxtMenu = [
      { label: 'Xem chi tiết', icon: 'fa-info-circle', command: (event) => this.viewInfo(this._khachHangSelected) },
      { label: 'Xóa dòng', icon: 'fa-close', command: (event) => this.delete(this._khachHangSelected) }
    ];
    // init cột trong bản kết quả tìm kiếm
    this._colsKetQuaTimKiem = [
      { field: 'MA_KHANG', header: 'Mã KH' },
      { field: 'TEN_KHANG', header: 'Tên KH' },
      { field: 'MaHopDong', header: 'Mã hợp đồng' },
      { field: 'MASO_THUE', header: 'Mã số thuế' },
      { field: 'MaDiemDo', header: 'Mã điểm đo' },
      { field: 'DiaDiemDungDien', header: 'Địa điểm dùng điện' },
      { field: 'SoHo', header: 'Số hộ' },
      { field: 'MaSoGCS', header: 'Mã số GCS' },
      { field: 'KhuVucSTT', header: 'Khu vực-STT' },
      { field: 'SoCot', header: 'Số cột' },
      { field: 'SoCongTo', header: 'Số công tơ' },
      { field: 'SoPha', header: 'Số pha' },
      { field: 'MA_KHANGThanhToan', header: 'Mã KH thanh toán' },
      { field: 'LoaiKH', header: 'Loại KH' },
      { field: 'DiaChiKH', header: 'Địa chỉ KH' },
      { field: 'NhomKH', header: 'Nhóm KH' },
      { field: 'Website', header: 'Website' },
      { field: 'Email', header: 'Email' },
      { field: 'SDTSms', header: 'SĐT SMS' },
      { field: 'LoaiHD', header: 'Loại hợp đồng' },
      { field: 'LoaiDiemDo', header: 'Loại điểm đo' },
      { field: 'MucDich', header: 'Mục đích' },
      { field: 'KiMuCSPK', header: 'Kí mua CSPK' },
      { field: 'MaCongTo', header: 'Mã công tơ' },
      { field: 'MaTram', header: 'Mã trạm' },
      { field: 'MaLo', header: 'Mã lộ' },
      { field: 'MaTo', header: 'Mã tổ' },
    ];

    this._lstDSTimKiem = [];

    this._lstHttt = [];

    this._lstKH.push({ value: "ALL", label: "Tất cả" });
    this._lstKH.push({ value: "0", label: "0: Khách hàng cá nhân" });
    this._lstKH.push({ value: "1", label: "1: Khách hàng tổ chức" });
    this._lstKHSelected = this._lstKH[0].value;
  }

  changeCachTimKiem(evt) {
    if (evt.value.id == 13) {
      this.timTheoNgayKy = true
    }
    else {
      this.timTheoNgayKy = false
    }
  }

  viewInfo(infoKH: TTinKHang) {
    this._displayDialog = true;
    let strMesg: string = 'Mã KH: ' + infoKH.MA_KHANG + ' - ' + infoKH.TEN_KHANG;
    this.showMessage(mType.info, 'Xem thông tin khách hàng', strMesg);
  }

  delete(infoKH: TTinKHang) {
    let index = -1;
    for (let i = 0; i < this._lstDSTimKiem.length; i++) {
      if (this._lstDSTimKiem[i].MA_KHANG == infoKH.MA_KHANG) {
        index = i;
        break;
      }
    }
    this._lstDSTimKiem.splice(index, 1);

    let strMesg: string = 'Mã KH: ' + infoKH.MA_KHANG + ' - ' + infoKH.TEN_KHANG;
    this.showMessage(mType.success, 'Xóa thành công', strMesg);
  }

  CheckOnlyHetHLuc(event) {
    if (event) {
      if (!this.checked) {
        this.showMessage(mType.warn, 'Thông báo', 'Vui lòng chọn "Hiển thị thông tin hết lực" để lọc!');
        this.checkedOnlyHetHLuc = false;
        return;
      }

      if (this._lstDSTimKiem == undefined || this._lstDSTimKiem.length == 0) {
        this.showMessage(mType.warn, 'Thông báo', 'Vui lòng chọn "Hiển thị thông tin hết lực" và tìm kiếm để lọc!');
        this.checkedOnlyHetHLuc = false;
        return;
      }

      //Lưu lại ds đã tìm trước đó
      this.listDSTimKiemStorage = this._lstDSTimKiem;

      let lstKHangThanhLy = this._lstDSTimKiem.filter(item => item.NGAY_HHLUC != "");
      this._lstDSTimKiem = lstKHangThanhLy;
      this._exportData = lstKHangThanhLy;
    } else {
      if (this.listDSTimKiemStorage != undefined && this.listDSTimKiemStorage.length > 0) {
        this._lstDSTimKiem = this.listDSTimKiemStorage;
        this._exportData = this.listDSTimKiemStorage;
      }
    }
  }

  timKiemKhachHangClick() {
    if (!this._loaiTimKiem) {
      this.showMessage(mType.error, 'Chưa chọn cách tìm kiếm', 'Vui lòng chọn cách tìm kiếm');
      return;
    }
    if (this._loaiTimKiem.id == 13) {
      this._giaTriTimKiem = typeof (this._giaTriTimKiem) == 'string' ? this._giaTriTimKiem : this.formatDate(this._giaTriTimKiem)
    }
    this._giaTriTimKiem = this._giaTriTimKiem.trim();
    if (!this._giaTriTimKiem || 0 === this._giaTriTimKiem.length) {
      this.showMessage(mType.warn, 'Không có giá trị tìm kiếm', 'Vui lòng điền giá trị tìm kiếm');
      return;
    }

    this.checkedOnlyHetHLuc = false;

    this._disableBtnTimKiem = true;
    document.body.style.cursor = "wait";
    this._lstDSTimKiem = new Array();
    this._exportData = null;
    this.showMessage(mType.info, 'Đang tìm kiếm...', 'Tim giá trị: ' + this._giaTriTimKiem);
    let strInput = {
      "strMaDViQLy": this._donViQuanLy.MaDVQL,
      "nLoaiTimKiem": this._loaiTimKiem.id,
      "strGiaTriTimKiem": this._giaTriTimKiem,
      "bGetHetHLuc": this.checked,
      "strNhomKhang": this._lstNhomKHSelected,
      "strLoaiKhang": this._lstKHSelected,
      "strHTTT": this._lstHtttSelected,
      "strPTTT": this._lstPtttSelected,
      "strLoaiHDong": this._lstLoaiHopDongSelected,
    };

    this.serviceBase.getDataByPostRequest(API.PHAN_HE.HOPDONG, API.API_HOP_DONG.TIMKIEM_KHACHHANG, strInput).subscribe((data: any) => {
      document.body.style.cursor = "default";
      this._disableBtnTimKiem = false;
      if (data && data.length > 0) {
        this._lstDSTimKiem = data;
        this._exportData = data;

        this.showMessage(mType.success, 'Tìm kiếm thành công', 'Tìm được ' + this._lstDSTimKiem.length + ' giá trị');
      }
      else {
        this.showMessage(mType.error, 'Tìm kiếm thất bại', 'Không tìm được giá trị tương ứng!');
        return;
      }

      if (data.length < 1000) {
        this.dataSrv.storage = strInput;
      }
    });
  }

  formatDate(date: Date): string {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  ngAfterViewInit() {
    if (this.dataSrv.storage != undefined) {
      this._disableBtnTimKiem = true;
      document.body.style.cursor = "wait";
      this._lstDSTimKiem = new Array();
      this._exportData = null;
      this.showMessage(mType.info, 'Đang tìm kiếm...', 'Tim giá trị: ' + this._giaTriTimKiem);
      let strInput = this.dataSrv.storage;

      this.serviceBase.getDataByPostRequest(API.PHAN_HE.HOPDONG, API.API_HOP_DONG.TIMKIEM_KHACHHANG, strInput).subscribe((data: any) => {
        document.body.style.cursor = "default";
        this._disableBtnTimKiem = false;
        if (data.length > 0) {
          this._lstDSTimKiem = data;
          this._exportData = data;
          this.showMessage(mType.success, 'Tìm kiếm thành công', 'Tìm được ' + data.length + ' giá trị');
        }
        else {
          this.showMessage(mType.error, 'Tìm kiếm thất bại', 'Không tìm được giá trị tương ứng!');
          return;
        }

        if (data.length < 1000) {
          this.dataSrv.storage = strInput;
        }
      });
    }
  }

  chonKhachHangClick() {
    // if(this._khachHangSelected != null){
    //   let strMesg: string = 'Mã KH: ' + this._khachHangSelected.MA_KHANG + ' - ' + this._khachHangSelected.TEN_KHANG;
    //   this.showMessage(mType.info, 'Đã chọn khách hàng:', strMesg);
    // }
    // this._route.navigate(['/ApGia']);
    this.onSelect.emit(this._khachHangSelected);
  }

  onUnSelectRowKHang(event) {
    let data = event.data;
    data.IS_SELECTED = "0";
  }

  onRowSelect(event: any) {
    let data = event.data;
    data.IS_SELECTED = "1";
    if (this._displayDialog === true) {
      this._displayDialog = false;
    }
    for (let item of this._lstLoaiHD) {
      if (data["MA_LOAIHD"] === item.maLoaihd) {
        data["MA_LOAIHD"] = item.tenLoaihd;
        break;
      }
    }

    let lstMaHDong = [];
    lstMaHDong.push(data.MA_HDONG);
    let lstMaKHang = [];
    lstMaKHang.push(data.MA_KHANG);
    let lstMaDDo = [];
    lstMaDDo.push(data.MA_DDO);
    let paramInput = { lstMaHDong: lstMaHDong, lstMaKHang: lstMaKHang, lstMaDDo: lstMaDDo, LOAI_HDONG: data.MA_LOAIHD };
    this._hdongData = paramInput;
    // let x = { MA_DVIQLY: "PA04TP", MA_DVICTREN: "PA04",  lstMaHDong: lstMaHDong, lstMaKHang: lstMaKHang, exportType:"docx"};
  }

  closeDiaglogClick() {
    this.displayDialog = false;
  }

  onDialogHide() {
  }

  btnThucHienTiep(event) {
    try {
      this.onSelect.emit(event);

    } catch (error) {
      console.log(error);
    }
  }

  txtGiatriTkiem_keyPress(event: any) {
    //Enter
    if (event.keyCode == 13) {
      this.timKiemKhachHangClick();
    }
  }

  getWidth(): number {
    return window.innerWidth * 0.9;
  }

  onChangeLoaiHopDong(event) {
    console.log(event)
  }

  onChangeNhomKH(event) {
    console.log(event)
  }

  onChangeHTTT(event) {

  }

  onChangePTTT(event) {

  }

  getMultiData() {
    this._lstNhomKH = [];
    this._lstNhomKHSelected = [];
    this._lstHttt = [];
    this._lstHtttSelected = [];
    this._lstPttt = [];
    this._lstPtttSelected = [];
    this._lstLoaiHopDong = [];
    this._lstLoaiHopDongSelected = [];

    let varlist =
    {
      MA_DVIQLY: this._sMaDvi,
      TEN_DANH_MUC: "D_NHOM_KHANG"
    };

    this.serviceBase.getDataByPostRequest(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_DANH_MUC, varlist).subscribe(results => {
      if (results !== null) {
        if (results.TYPE) {
          (results.TYPE === "NODATA") ?
            this.showMessage(mType.warn, "Thông báo", "Không tìm thấy dữ liệu nhóm khách hàng!") :
            this.showMessage(mType.error, "Lỗi", "Lỗi khi lấy dữ liệu nhóm khách hàng: " + results.MESSAGE);
        } else {
          for (let obj of results.LST_OBJ) {
            this._lstNhomKH.push({ label: obj["moTa"], value: obj["manhomKhang"] });
          }
          this._lstNhomKH.unshift({ label: "Tất cả", value: "ALL" });
          this._lstNhomKHSelected = this._lstNhomKH[0].value;
        }
      }
    });

    this.serviceBase.getData(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_HTTT).subscribe(results => {
      if (results !== null) {
        if (results.TYPE) {
          (results.TYPE === "NODATA") ?
            this.showMessage(mType.warn, "Thông báo", "Không tìm thấy dữ liệu hình thức thanh toán!") :
            this.showMessage(mType.error, "Lỗi", "Lỗi khi lấy dữ liệu hình thức thanh toán: " + results.MESSAGE);
        } else {
          for (let obj of results) {
            this._lstHttt.push({ label: obj["TEN_HTTT"], value: obj["MA_HTTT"] });
          }
          this._lstHttt.unshift({ label: "Tất cả", value: "ALL" });
          this._lstHtttSelected = this._lstHttt[0].value;
        }
      }
    });

    this.serviceBase.getData(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_PTTT).subscribe(results => {
      if (results !== null) {
        if (results.TYPE) {
          (results.TYPE === "NODATA") ?
            this.showMessage(mType.warn, "Thông báo", "Không tìm thấy dữ liệu phương thức thanh toán!") :
            this.showMessage(mType.error, "Lỗi", "Lỗi khi lấy dữ liệu phương thức thanh toán: " + results.MESSAGE);
        } else {
          for (let obj of results) {
            this._lstPttt.push({ label: obj["TEN_PTTT"], value: obj["MA_PTTT"] });
          }
          this._lstPttt.unshift({ label: "Tất cả", value: "ALL" });
          this._lstPtttSelected = this._lstPttt[0].value;
        }
      }
    });

    this.serviceBase.getData(API.PHAN_HE.DANHMUC, API.API_DANH_MUC.GET_LOAIHOPDONG).subscribe(results => {
      if (results !== null) {
        if (results.TYPE) {
          (results.TYPE === "NODATA") ?
            this.showMessage(mType.warn, "Thông báo", "Không tìm thấy dữ liệu loại hợp đồng!") :
            this.showMessage(mType.error, "Lỗi", "Lỗi khi lấy dữ liệu loại hợp đồng: " + results.MESSAGE);
        } else {
          for (let obj of results) {
            this._lstLoaiHopDong.push({ label: obj["TEN_LOAIHD"], value: obj["MA_LOAIHD"] });
          }
          this._lstLoaiHopDong.unshift({ label: "Tất cả", value: "ALL" });
          this._lstLoaiHopDongSelected = this._lstLoaiHopDong[0].value;
        }
      }
    });
  }
}
