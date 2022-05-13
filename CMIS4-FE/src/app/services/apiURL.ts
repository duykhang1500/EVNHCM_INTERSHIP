export class PHAN_HE {
    public static REPORT = "Report";
    public static COMMON = "Common";
    public static DICHVU = "DichVu";
    public static FILEDTU = "FileDTu";
    public static HOPDONG = "HopDong";
    public static HOSOTBI = "HoSoTBi";
    public static BDONGTBI = "BDongTBi";
    public static BDONGTTHAO = "BDongTThao";
    public static QLYSOGCS = "QLySoGCS";
    public static CHISOKHANG = "ChiSoKHang";
    public static HDONPSINH = "HDonPSinh";
    public static HDONDCHINH = "HDonDChinh";
    public static HDONDTU = "HDonDTu";
    public static TTIENCNO = "TTienCNo";
    public static NOKHODOI = "NoKhoDoi";
    public static PHIDCAT = "PhiDCat";
    public static KHONO = "KhoNo";
    public static CAYTTHAT = "CayTThat";
    public static CHISOTTHAT = "ChiSoTThat";
    public static GNHANDNANG = "GNhanDNang";
    public static QTRIHTHONG = "QTriHThong";
    public static SMS = "SMS";
    public static EMAIL = "Email";
    public static TBIHTRUONG = "TbiHTruong";
    public static KTRAGSATMBD = "KTraGSatMBD";
    public static BANLEDNANG = "BanLeDNang";
    public static DANHMUC = "DanhMuc";
    public static BCAOTHANG = "BCaoThang";
    public static BCAOLICHSU = "BCaoLichSu";
    public static QTRIDHANH = "QTriDHanh";
    public static INTERFACE = "Interface";
    public static DIENNTHON = "DienNThon";
    public static CSBT = "csapi/api";
}

//Service Điện nông thôn
export class API_DIEN_NONG_THON {
    public static GET_D_LOAI_DUAN_DNT(table: "D_LOAI_DUAN_DNT", param): string {
        return `${table}/${param}`;
    }

    public static GET_DATA_TNHAN_YCAU(
        table: "ldnt_tnhan_ycau" | "ldnt_ksat_duan" | "ldnt_qdinh_duan",
        madvqly,
        param
    ): string {
        return `${table}/${madvqly}/${param}`;
    }

    public static GET_DATABYTABLENAMEANDKEY = "getDataByTableNameAndKey";

    public static POST_DATA_TNHAN_YCAU(
        table:
            | "ldnt_tnhan_ycau"
            | "D_LOAI_DUAN_DNT"
            | "ldnt_ksat_duan"
            | "ldnt_qdinh_duan",
        method: "add" | "update" | "delete"
    ): string {
        return `${table}/${method}`;
    }
}

//Service Danh Mục
export class API_DANH_MUC {
    public static GET_DANH_MUC = "getDanhMuc";
    public static GET_DANH_MUC_LIKE_DK = "getDanhMuc_likedk";
    public static VALIDATE_DANH_MUC = "validateDanhMuc";
    public static GET_ALL_PARAMETER = "getAllParameter";
    public static GET_LOAIHOPDONG = "getLoaiHopDong";
    public static GET_HTTT = "getHttt";
    public static GET_PTTT = "getPttt";

    public static GET_VATTU_BY_DONVI = "select_DmVTu";
    public static GET_NHANCONG_BY_DONVI = "select_DmVTu";
    public static INSERT_VATTU = "";

    //My task doing
    public static INSERT_SURVEY_COST = "create";
}

//Service QTHT
export class API_QTHT {
    public static GET_USER_LOGIN = "getNguoiDung";
    public static GET_DVI_QLY = "getDDViQLy";
    public static GET_MENU_OF_USER = "getMenuOfUser";
    public static GET_VERSION = "getVersion";
    public static GET_ALL_PARAMETER = "getAllParameter";
    public static GET_THANG_NAM_LV = "getThangNamLV";
}

//Service Dịch vụ
export class API_DICH_VU {}

//Service Hợp đồng
export class API_HOP_DONG {
    public static GET_HOPDONG_MTAM_DUNGTTOAN = "GetHopDongMTAMDungTToan";
    public static TIMKIEM_KHACHHANG = "timKiemKhachHang";
}

//Service Thu tiền chấm nợ
export class API_TTIEN_CNO {
    public static GET_ALLCNDUNGTTOAN_MTMN = "GetAllCNDungTToanMTMN";
    public static INSERT_CNDUNGTTOAN_MTMN = "InsertCNDungTToanMTMN";
    public static KPHUC_CNDUNGTTOAN_MTMN = "KPhucCNDungTToanMTMN";
    public static UPDATE_CNDUNGTTOAN_MTMN = "UpdateCNDungTToanMTMN";
}
