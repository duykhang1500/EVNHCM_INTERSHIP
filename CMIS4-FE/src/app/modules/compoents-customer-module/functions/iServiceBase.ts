import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import * as API from "src/app/services/apiURL";
import { Material } from "../../danh-muc-module/models/dmuc-vat-tu/vat-tu.model";

@Injectable()
export class iServiceBase {
    strConfig: any = [];
    strCSBT: string = "";
    IP_API_GATEWAY: string = "";
    Version: string = "";
    ApiKey: string;

    //Đường dẫn UTL các service
    private Url_Report: string = "";
    private Url_Common: string = "";
    private Url_DichVu: string = "";
    private Url_FileDTu: string = "";
    private Url_HopDong: string = "";
    private Url_HoSoTBi: string = "";
    private Url_BDongTBi: string = "";
    private Url_BDongTThao: string = "";
    private Url_QLySoGCS: string = "";
    private Url_ChiSoKHang: string = "";
    private Url_HDonPSinh: string = "";
    private Url_HDonDChinh: string = "";
    private Url_HDonDTu: string = "";
    private Url_TTienCNo: string = "";
    private Url_NoKhoDoi: string = "";
    private Url_PhiDCat: string = "";
    private Url_KhoNo: string = "";
    private Url_CayTThat: string = "";
    private Url_ChiSoTThat: string = "";
    private Url_GNhanDNang: string = "";
    private Url_QTriHThong: string = "";
    private Url_SMS: string = "";
    private Url_Email: string = "";
    private Url_TbiHTruong: string = "";
    private Url_KTraGSatMBD: string = "";
    private Url_BanLeDNang: string = "";
    private Url_DanhMuc: string = "";
    private Url_BCaoThang: string = "";
    private Url_BCaoLichSu: string = "";
    private Url_QTriDHanh: string = "";
    private Url_Interface: string = "";
    private Url_DienNThon: string = "";
    private Url_CSBT: string = "";

    constructor(private httpClient: HttpClient) {}

    // ================================================== MY TASK FOR INTERNSHIP =================================//
    private apiURL = `/REST_API-RESTWebService-context-root/resources/SurveyCostService`;

    async getDataAPI(url = ""): Promise<any> {
        try {
            const res = await this.httpClient
                .get(`${this.apiURL}/${url}`)
                .toPromise();
            return res;
        } catch (e) {
            console.log(e);
        }
    }

    deleteAPI(id: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.apiURL}/${id}/delete`);
    }

    public postDataAPI(url, formData): Observable<any> {
        console.log("Form Data: ", formData);
        try {
            const body = new HttpParams()
                .set("maDviqly", formData.maDviqly)
                .set("maCphiKsat", formData.maCphiKsat)
                .set("tenCphiKsat", formData.tenCphiKsat)
                .set("dvt", formData.dvt)
                .set("cphiKsat", formData.cphiKsat)
                .set("heSoKsat", formData.heSoKsat)
                .set("nguoiTao", formData.nguoiTao)
                .set("ngayTao", formData.ngayTao)
                .set("trangThai", formData.trangThai);
            return this.httpClient.post(
                `${this.apiURL}/${url}`,
                body.toString(),
                {
                    headers: new HttpHeaders().set(
                        "Content-Type",
                        "application/x-www-form-urlencoded"
                    ),
                }
            );
            // .pipe(
            //     catchError((err) => {
            //         console.log("Catch err: ", err);
            //         return throwError(err);
            //     })
            // );
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public updateAPI(id, formData) {
        console.log("Form data update", formData);
        const body = new HttpParams()
            .set("maDonViQuanLy", formData.maDviqly)
            .set("tenChiPhiKhaoSat", formData.tenCphiKsat)
            .set("donViTinh", formData.dvt)
            .set("chiPhiKhaoSat", formData.cphiKsat)
            .set("heSoKhaoSat", formData.heSoKsat)
            .set("nguoiSua", formData.nguoiSua)
            .set("ngaySua", formData.ngaySua)
            .set("trangThai", formData.trangThai);
        return this.httpClient.put<any>(`${this.apiURL}/${id}/update`, body, {
            headers: new HttpHeaders().set(
                "Content-Type",
                "application/x-www-form-urlencoded"
            ),
        });
    }

    /* Material API*/
    // TODO:
    private apiURLMaterial = `/REST_API-RESTWebService-context-root/resources/MaterialListService`;

    async getMaterialList(): Promise<any> {
        try {
            const res = await this.httpClient
                .get(`${this.apiURLMaterial}/getAll`)
                .toPromise();
            console.log("Dánh sách vật tư: ", res);
            return res;
        } catch (e) {
            console.log(e);
        }
    }

    createMaterial(material: Material): Observable<any> {
        console.log("Vật tư: ", material);
        const body = new HttpParams()
            .set("maDviqly", material.maDviqly)
            .set("maVt", material.maVt)
            .set("ten", material.ten)
            .set("soPha", material.soPha)
            .set("trangThai", material.trangThai)
            .set("dvt", material.dvt);

        return this.httpClient.post<Material>(
            `${this.apiURLMaterial}/create`,
            body.toString(),
            {
                headers: new HttpHeaders().set(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                ),
            }
        );
    }

    updateMaterial(material: Material): Observable<any> {
        const body = new HttpParams()
            .set("maDviqly", material.maDviqly)
            .set("ten", material.ten)
            .set("soPha", material.soPha)
            .set("trangThai", material.trangThai)
            .set("dvt", material.dvt);
        return this.httpClient.put(
            `${this.apiURLMaterial}/${material.maVt}/update`,
            body,
            {
                headers: new HttpHeaders().set(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                ),
            }
        );
    }

    deleteMaterial(material: Material): Observable<any> {
        return this.httpClient.delete<any>(
            `${this.apiURLMaterial}/${material.maVt}/delete`
        );
    }

    //============================================================================================================== //

    async getDataByURL_Async(url, api, inputData): Promise<any> {
        try {
            url = `${url}${api}`;
            const response = await this.httpClient
                .post(url, inputData)
                .toPromise();
            document.body.style.cursor = "default";
            return response;
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    async getData_Async(service, api): Promise<any> {
        //Get IP và URL
        service = await this.getURLService(service);

        if (service == null) {
            return null;
        }

        let url = `${service}${api}`;
        const response = await this.httpClient.get(url).toPromise();
        document.body.style.cursor = "default";
        return response;
    }

    async getData_AsyncByPostRequest(service, api, inputData): Promise<any> {
        try {
            //Get IP và URL
            service = await this.getURLService(service);

            if (service == null) {
                return null;
            }

            let url = `${service}${api}`;
            const response = await this.httpClient
                .post(url, inputData)
                .toPromise();
            document.body.style.cursor = "default";
            return response;
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    async getData_WithParams_Async(service, api, Params): Promise<any> {
        //Get IP và URL
        service = await this.getURLService(service);

        if (service == null) {
            return null;
        }

        let url = `${service}${api}`;
        const response = await this.httpClient
            .get(url, { params: Params })
            .pipe(catchError(this.handleError))
            .toPromise();
        document.body.style.cursor = "default";
        return response;
    }

    public getData(service, api): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient.get(url).pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public getDataByPostRequest(service, api, inputData): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .post(url, inputData)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public getData_WithParams(service, api, Params): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .get(url, { params: Params })
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    // public getDataBlob_NoAsync(service, api) : Observable<any> {
    //     try {
    //         let requestOptions = this.grantRequestOptionsFormData();
    //         requestOptions.responseType = 3;
    //         document.body.style.cursor = 'default';
    //         return this.httpClient.get(url, requestOptions).pipe(catchError(this.handleError));
    //     } catch (error) {
    //         document.body.style.cursor = 'default';
    //         console.log(error);
    //         return null;
    //     }
    // }

    async postData_Async(service, api, inputData): Promise<any> {
        try {
            //Get IP và URL
            service = await this.getURLService(service);

            if (service == null) {
                return null;
            }

            let url = `${service}${api}`;
            const response = await this.httpClient
                .post(url, inputData)
                .toPromise();
            document.body.style.cursor = "default";
            return response;
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public postData(service, api, inputData): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .post(url, inputData)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public postFormData(service, api, inputData): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .post(url, inputData)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public postData_URL(service, api, inputData): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .post(url, inputData)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    // public postBlobData_NoAsync(service, api, inputData): Observable<any> {
    //     try {
    //let url = `${service}${api}`;
    //         let requestOptions = this.grantRequestOptions();
    //         requestOptions.responseType = 3;
    //         document.body.style.cursor = 'default';
    //         return this.httpClient.post(url, inputData, requestOptions).pipe(catchError(this.handleError));
    //     } catch (error) {
    //         document.body.style.cursor = 'default';
    //         console.log(error);
    //         return null;
    //     }
    // }

    // async postBlobData_Async(service, api, inputData): Promise<any> {
    //     try {
    // let url = `${service}${api}`;
    //         let requestOptions = this.grantRequestOptions();
    //         requestOptions.responseType = 3;
    //         const response = await this.httpClient.post(url, inputData, requestOptions).toPromise();
    //         document.body.style.cursor = 'default';
    //         return response;
    //     } catch (error) {
    //         document.body.style.cursor = 'default';
    //         console.log(error);
    //         return null;
    //     }
    // }

    // async getBlobData_Async(service, api): Promise<any> {
    //     try {
    // let url = `${service}${api}`;
    //         let requestOptions = this.grantRequestOptions();
    //         requestOptions.responseType = 3;
    //         const response = await this.httpClient.get(url, requestOptions).toPromise();
    //         document.body.style.cursor = 'default';
    //         return response;
    //     } catch (error) {
    //         document.body.style.cursor = 'default';
    //         console.log(error);
    //         return null;
    //     }
    // }

    async putData_Async(service, api, inputData): Promise<any> {
        try {
            //Get IP và URL
            service = await this.getURLService(service);

            if (service == null) {
                return null;
            }

            let url = `${service}${api}`;
            const response = await this.httpClient
                .put(url, inputData)
                .toPromise();
            document.body.style.cursor = "default";
            return response;
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public putData(service, api, inputData): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .put(url, inputData)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    async deleteData_Async(service, api): Promise<any> {
        //Get IP và URL
        service = await this.getURLService(service);

        if (service == null) {
            return null;
        }

        let url = `${service}${api}`;
        const response = await this.httpClient.delete(url).toPromise();
        document.body.style.cursor = "default";
        return response;
    }

    public deleteData(service, api): Observable<any> {
        try {
            //Get IP và URL
            service = this.getURLService(service);

            let url = `${service}${api}`;
            document.body.style.cursor = "default";
            return this.httpClient
                .delete(url)
                .pipe(catchError(this.handleError));
        } catch (error) {
            document.body.style.cursor = "default";
            console.log(error);
            return null;
        }
    }

    public upload_Async(service, api, inputData) {
        //Get IP và URL
        service = this.getURLService(service);

        let url = `${service}${api}`;
        return new HttpRequest("POST", url, inputData);
    }

    getURLService(phanhe) {
        try {
            if (sessionStorage.getItem(phanhe) != undefined) {
                switch (phanhe) {
                    case "DichVu": {
                        return sessionStorage.getItem("DichVu").toString();
                    }
                    case "FileDTu": {
                        return sessionStorage.getItem("FileDTu").toString();
                    }
                    case "HopDong": {
                        return sessionStorage.getItem("HopDong").toString();
                    }
                    case "HoSoTBi": {
                        return sessionStorage.getItem("HoSoTBi").toString();
                    }
                    case "BDongTBi": {
                        return sessionStorage.getItem("BDongTBi").toString();
                    }
                    case "BDongTThao": {
                        return sessionStorage.getItem("BDongTThao").toString();
                    }
                    case "QLySoGCS": {
                        return sessionStorage.getItem("QLySoGCS").toString();
                    }
                    case "ChiSoKHang": {
                        return sessionStorage.getItem("ChiSoKHang").toString();
                    }
                    case "HDonPSinh": {
                        return sessionStorage.getItem("HDonPSinh").toString();
                    }
                    case "HDonDChinh": {
                        return sessionStorage.getItem("HDonDChinh").toString();
                    }
                    case "HDonDTu": {
                        return sessionStorage.getItem("HDonDTu").toString();
                    }
                    case "TTienCNo": {
                        return sessionStorage.getItem("TTienCNo").toString();
                    }
                    case "NoKhoDoi": {
                        return sessionStorage.getItem("NoKhoDoi").toString();
                    }
                    case "PhiDCat": {
                        return sessionStorage.getItem("PhiDCat").toString();
                    }
                    case "KhoNo": {
                        return sessionStorage.getItem("KhoNo").toString();
                    }
                    case "CayTThat": {
                        return sessionStorage.getItem("CayTThat").toString();
                    }
                    case "ChiSoTThat": {
                        return sessionStorage.getItem("ChiSoTThat").toString();
                    }
                    case "GNhanDNang": {
                        return sessionStorage.getItem("GNhanDNang").toString();
                    }
                    case API.PHAN_HE.QTRIHTHONG: {
                        return sessionStorage
                            .getItem(API.PHAN_HE.QTRIHTHONG)
                            .toString();
                    }
                    case "SMS": {
                        return sessionStorage.getItem("SMS").toString();
                    }
                    case "Email": {
                        return sessionStorage.getItem("Email").toString();
                    }
                    case "TbiHTruong": {
                        return sessionStorage.getItem("TbiHTruong").toString();
                    }
                    case "KTraGSatMBD": {
                        return sessionStorage.getItem("KTraGSatMBD").toString();
                    }
                    case "BanLeDNang": {
                        return sessionStorage.getItem("BanLeDNang").toString();
                    }
                    case "DanhMuc": {
                        return sessionStorage.getItem("DanhMuc").toString();
                    }
                    case "BCaoThang": {
                        return sessionStorage.getItem("BCaoThang").toString();
                    }
                    case "BCaoLichSu": {
                        return sessionStorage.getItem("BCaoLichSu").toString();
                    }
                    case "QTriDHanh": {
                        return sessionStorage.getItem("QTriDHanh").toString();
                    }
                    case "Common": {
                        return sessionStorage.getItem("Common").toString();
                    }
                    case "Report": {
                        return sessionStorage.getItem("Report").toString();
                    }
                    case "Interface": {
                        return sessionStorage.getItem("Interface").toString();
                    }
                    case "DienNThon": {
                        return sessionStorage.getItem("DienNThon").toString();
                    }
                    case "CSBT": {
                        return sessionStorage.getItem("CSBT").toString();
                    }
                    default: {
                        return "";
                    }
                }
            } else {
                let result = "";
                this.getServiceList().then((response) => {
                    // Lấy IP được cấu hình
                    this.strConfig = response.UIConfig;
                    this.strCSBT = response.CSBT;
                    this.IP_API_GATEWAY = response.APIGATEWAY;
                    this.ApiKey = response.APIKEY;
                    this.Version = response.Version;

                    this.Url_DichVu = this.IP_API_GATEWAY + "serviceDichVu/";
                    this.Url_FileDTu = this.IP_API_GATEWAY + "serviceFileDTu/";
                    this.Url_HopDong = this.IP_API_GATEWAY + "serviceHopDong/";
                    this.Url_HoSoTBi = this.IP_API_GATEWAY + "serviceHoSoTBi/";
                    this.Url_BDongTBi =
                        this.IP_API_GATEWAY + "serviceBDongTBi/";
                    this.Url_BDongTThao =
                        this.IP_API_GATEWAY + "serviceBDongTThao/";
                    this.Url_QLySoGCS =
                        this.IP_API_GATEWAY + "serviceQLySoGCS/";
                    this.Url_ChiSoKHang =
                        this.IP_API_GATEWAY + "serviceChiSoKHang/";
                    this.Url_HDonPSinh =
                        this.IP_API_GATEWAY + "serviceHDonPSinh/";
                    this.Url_HDonDChinh =
                        this.IP_API_GATEWAY + "serviceHDonDChinh/";
                    this.Url_HDonDTu = this.IP_API_GATEWAY + "serviceHDonDTu/";
                    this.Url_TTienCNo =
                        this.IP_API_GATEWAY + "serviceTTienCNo/";
                    this.Url_NoKhoDoi =
                        this.IP_API_GATEWAY + "serviceNoKhoDoi/";
                    this.Url_PhiDCat = this.IP_API_GATEWAY + "servicePhiDCat/";
                    this.Url_KhoNo = this.IP_API_GATEWAY + "serviceKhoNo/";
                    this.Url_CayTThat =
                        this.IP_API_GATEWAY + "serviceCayTThat/";
                    this.Url_ChiSoTThat =
                        this.IP_API_GATEWAY + "serviceChiSoTThat/";
                    this.Url_GNhanDNang =
                        this.IP_API_GATEWAY + "serviceGNhanDNang/";
                    this.Url_QTriHThong =
                        this.IP_API_GATEWAY +
                        "ServiceQTriHThong-QTriHThong-context-root/resources/serviceQTriHThong/";
                    this.Url_SMS = this.IP_API_GATEWAY + "serviceSMS/";
                    this.Url_Email = this.IP_API_GATEWAY + "serviceEmail/";
                    this.Url_TbiHTruong =
                        this.IP_API_GATEWAY + "serviceTbiHTruong/";
                    this.Url_KTraGSatMBD =
                        this.IP_API_GATEWAY + "serviceKTraGSatMBD/";
                    this.Url_BanLeDNang =
                        this.IP_API_GATEWAY + "serviceBanLeDNang/";
                    this.Url_DanhMuc =
                        this.IP_API_GATEWAY +
                        "ServiceDanhMuc-DanhMuc-context-root/resources/serviceDanhMuc/";
                    this.Url_BCaoThang =
                        this.IP_API_GATEWAY + "serviceBCaoThang/";
                    this.Url_BCaoLichSu =
                        this.IP_API_GATEWAY + "serviceBCaoLichSu/";
                    this.Url_QTriDHanh =
                        this.IP_API_GATEWAY + "serviceQTriDHanh/";
                    this.Url_Report = this.IP_API_GATEWAY + "serviceReport/";
                    this.Url_Common = this.IP_API_GATEWAY + "serviceCommon/";
                    this.Url_Interface =
                        this.IP_API_GATEWAY + "serviceInterface/";
                    this.Url_DienNThon =
                        this.IP_API_GATEWAY + "serviceDienNThon/";
                    this.Url_CSBT = this.strCSBT + "/csapi/api/";

                    switch (phanhe) {
                        case "DichVu": {
                            result = this.Url_DichVu;
                            break;
                        }
                        case "FileDTu": {
                            result = this.Url_FileDTu;
                            break;
                        }
                        case "HopDong": {
                            result = this.Url_HopDong;
                            break;
                        }
                        case "HoSoTBi": {
                            result = this.Url_HoSoTBi;
                            break;
                        }
                        case "BDongTBi": {
                            result = this.Url_BDongTBi;
                            break;
                        }
                        case "BDongTThao": {
                            result = this.Url_BDongTThao;
                            break;
                        }
                        case "QLySoGCS": {
                            result = this.Url_QLySoGCS;
                            break;
                        }
                        case "ChiSoKHang": {
                            result = this.Url_ChiSoKHang;
                            break;
                        }
                        case "HDonPSinh": {
                            result = this.Url_HDonPSinh;
                            break;
                        }
                        case "HDonDChinh": {
                            result = this.Url_HDonDChinh;
                            break;
                        }
                        case "HDonDTu": {
                            result = this.Url_HDonDTu;
                            break;
                        }
                        case "TTienCNo": {
                            result = this.Url_TTienCNo;
                            break;
                        }
                        case "NoKhoDoi": {
                            result = this.Url_NoKhoDoi;
                            break;
                        }
                        case "PhiDCat": {
                            result = this.Url_PhiDCat;
                            break;
                        }
                        case "KhoNo": {
                            result = this.Url_KhoNo;
                            break;
                        }
                        case "CayTThat": {
                            result = this.Url_CayTThat;
                            break;
                        }
                        case "ChiSoTThat": {
                            result = this.Url_ChiSoTThat;
                            break;
                        }
                        case "GNhanDNang": {
                            result = this.Url_GNhanDNang;
                            break;
                        }
                        case API.PHAN_HE.QTRIHTHONG: {
                            result = this.Url_QTriHThong;
                            break;
                        }
                        case "SMS": {
                            result = this.Url_SMS;
                            break;
                        }
                        case "Email": {
                            result = this.Url_Email;
                            break;
                        }
                        case "TbiHTruong": {
                            result = this.Url_TbiHTruong;
                            break;
                        }
                        case "KTraGSatMBD": {
                            result = this.Url_KTraGSatMBD;
                            break;
                        }
                        case "BanLeDNang": {
                            result = this.Url_BanLeDNang;
                            break;
                        }
                        case "DanhMuc": {
                            result = this.Url_DanhMuc;
                            break;
                        }
                        case "BCaoThang": {
                            result = this.Url_BCaoThang;
                            break;
                        }
                        case "BCaoLichSu": {
                            result = this.Url_BCaoLichSu;
                            break;
                        }
                        case "QTriDHanh": {
                            result = this.Url_QTriDHanh;
                            break;
                        }
                        case "Common": {
                            result = this.Url_Report;
                            break;
                        }
                        case "Report": {
                            result = this.Url_Common;
                            break;
                        }
                        case "Interface": {
                            result = this.Url_Interface;
                            break;
                        }
                        case "DienNThon": {
                            result = this.Url_DienNThon;
                            break;
                        }
                        case "CSBT": {
                            result = this.Url_CSBT;
                            break;
                        }
                    }

                    //set vào sessionStorage để lấy dùng lần sau
                    this.setSessionStorage();
                });

                return result;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    //Lấy Ip cấu hình ở file này
    async getServiceList(): Promise<any> {
        return await this.httpClient
            .get("assets/config/IPService.json")
            .pipe(catchError(this.handleError))
            .toPromise();
    }

    protected setSessionStorage() {
        sessionStorage.setItem("IP_UI", this.strConfig.IP_UI.toString());
        sessionStorage.setItem("VERSION", this.Version);
        sessionStorage.setItem("APIKEY", this.ApiKey);
        sessionStorage.setItem(
            "PROJECT_NAME",
            this.strConfig.PROJECT_NAME.toString()
        );
        sessionStorage.setItem("DichVu", this.Url_DichVu);
        sessionStorage.setItem("FileDTu", this.Url_FileDTu);
        sessionStorage.setItem("HopDong", this.Url_HopDong);
        sessionStorage.setItem("HoSoTBi", this.Url_HoSoTBi);
        sessionStorage.setItem("BDongTBi", this.Url_BDongTBi);
        sessionStorage.setItem("BDongTThao", this.Url_BDongTThao);
        sessionStorage.setItem("QLySoGCS", this.Url_QLySoGCS);
        sessionStorage.setItem("ChiSoKHang", this.Url_ChiSoKHang);
        sessionStorage.setItem("HDonPSinh", this.Url_HDonPSinh);
        sessionStorage.setItem("HDonDChinh", this.Url_HDonDChinh);
        sessionStorage.setItem("HDonDTu", this.Url_HDonDTu);
        sessionStorage.setItem("TTienCNo", this.Url_TTienCNo);
        sessionStorage.setItem("NoKhoDoi", this.Url_NoKhoDoi);
        sessionStorage.setItem("PhiDCat", this.Url_PhiDCat);
        sessionStorage.setItem("KhoNo", this.Url_KhoNo);
        sessionStorage.setItem("CayTThat", this.Url_CayTThat);
        sessionStorage.setItem("ChiSoTThat", this.Url_ChiSoTThat);
        sessionStorage.setItem("GNhanDNang", this.Url_GNhanDNang);
        sessionStorage.setItem("QTriHThong", this.Url_QTriHThong);
        sessionStorage.setItem("SMS", this.Url_SMS);
        sessionStorage.setItem("Email", this.Url_Email);
        sessionStorage.setItem("TbiHTruong", this.Url_TbiHTruong);
        sessionStorage.setItem("KTraGSatMBD", this.Url_KTraGSatMBD);
        sessionStorage.setItem("BanLeDNang", this.Url_BanLeDNang);
        sessionStorage.setItem("DanhMuc", this.Url_DanhMuc);
        sessionStorage.setItem("BCaoThang", this.Url_BCaoThang);
        sessionStorage.setItem("BCaoLichSu", this.Url_BCaoLichSu);
        sessionStorage.setItem("QTriDHanh", this.Url_QTriDHanh);
        sessionStorage.setItem("Report", this.Url_Report);
        sessionStorage.setItem("Common", this.Url_Common);
        sessionStorage.setItem("Interface", this.Url_Interface);
        sessionStorage.setItem("DienNThon", this.Url_DienNThon);
        sessionStorage.setItem("CSBT", this.Url_CSBT);
    }

    protected extractData(res: Response): any {
        let body = res;
        return body || {};
    }

    protected extractDataNoLoading(res: Response): any {
        let body = res;
        return body || {};
    }

    protected extractDataWParams(res: Response): any {
        let body = res;
        return body || {};
    }

    // protected handleError(error: Response | any): any {
    //     let errMsg;
    //     if (error instanceof Response) {
    //         const body = JSON.stringify(error) || '';
    //         const err = JSON.parse(body).error || '';
    //         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //     } else {
    //         errMsg = error.message ? error.message : error.toString();
    //     }
    //     console.log(errMsg);
    //     return Observable.throw(errMsg);
    // }

    protected handleErrorWParams(error: Response | any): any {
        let errMsg;
        if (error instanceof Response) {
            const body = JSON.parse(JSON.stringify(error)) || "";
            const err = body.error;
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = "Unknown error!";
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }
}
