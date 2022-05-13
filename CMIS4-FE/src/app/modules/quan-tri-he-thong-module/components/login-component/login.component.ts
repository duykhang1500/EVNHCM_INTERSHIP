import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { User } from "../../models/user.model";
import * as API from "src/app/services/apiURL";
import { DatePipe } from "@angular/common";
import {
    iComponentBase,
    mType,
    iServiceBase,
} from "src/app/modules/compoents-customer-module/components-customer";

@Component({
    selector: "cmis-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends iComponentBase implements OnInit {
    submitted: boolean;
    siteKey: any = "";
    description: string;
    isOn: boolean = navigator.onLine;
    isOnline: boolean = false;
    strIP: any;
    strURL_WebDvu: string;

    userName: any;
    password: any;

    constructor(
        private router: Router,
        public http: HttpClient,
        public messageService: MessageService,
        private iServiceBase: iServiceBase,
        private datePipe: DatePipe
    ) {
        super(messageService);
    }

    async getIPService(): Promise<any> {
        let url = "assets/config/IPService.json";
        const response = await this.http.get(url).toPromise();
        return response;
    }

    isLogged(): Promise<boolean> {
        if (Storage != undefined) {
            if (sessionStorage.getItem("SESSIONID")) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    logout(user: User) {
        sessionStorage.removeItem(user.username);
    }

    async ngOnInit() {
        this.setStorage("DNS", "0");
        this.isLogged().then((result: boolean) => {
            if (result) {
                let dviinfo = localStorage.getItem("DVI_LOGIN");
                let tendvilogin = localStorage.getItem("TEN_DVI_LOGIN");
                let userinfo = localStorage.getItem("USER_INFO");
                let thamsoinfo = localStorage.getItem("THAM_SO_HT");
                let thangnaminfo = localStorage.getItem("THANG_NAM_HT");
                let sessioninfo = sessionStorage.getItem("SESSIONID");
                localStorage.clear();
                localStorage.setItem("DVI_LOGIN", dviinfo);
                localStorage.setItem("TEN_DVI_LOGIN", tendvilogin);
                localStorage.setItem("USER_INFO", userinfo);
                localStorage.setItem("THAM_SO_HT", thamsoinfo);
                localStorage.setItem("THANG_NAM_HT", thangnaminfo);
                localStorage.setItem("SESSIONID", sessioninfo);

                this.router.navigate(["/Home"]);
            } else {
                this.router.navigate(["/login"]);
            }
        });

        if (!sessionStorage.getItem(API.PHAN_HE.QTRIHTHONG)) {
            await this.iServiceBase.getURLService(API.PHAN_HE.QTRIHTHONG);
        }

        let response1 = await this.getIPService();
        this.siteKey = response1.SiteKey;
    }

    public loadInfoSys(): void {}

    async onSubmit() {
        // this.router.navigate(["/Home"]);
        this.submitted = true;

        let parram = {
            USER_NAME: this.userName,
            PASSWORD: this.password,
        };

        //Load thông tin người dùng
        let response = await this.iServiceBase.getData_AsyncByPostRequest(
            API.PHAN_HE.QTRIHTHONG,
            API.API_QTHT.GET_USER_LOGIN,
            parram
        );
        if (response && response.TYPE) {
            this.showMessage(
                mType.error,
                "Thông báo",
                "Đăng nhập thất bại. Vui lòng kiểm tra lại"
            );

            let dnsStorager = this.getStorage("DNS");
            if (dnsStorager && dnsStorager == "") {
                dnsStorager++;
                this.setStorage("DNS", dnsStorager);
            } else {
                if (dnsStorager == "3" && this.isOn == true) {
                    let response1 = await this.getIPService();
                    this.strIP = response1.SiteKey;
                    this.isOnline = true;
                } else {
                    dnsStorager++;
                    this.isOnline = false;
                    this.setStorage("DNS", dnsStorager);
                }
            }
            return;
        }

        if (Storage != undefined) {
            localStorage.clear();
            localStorage.setItem("USER_INFO", JSON.stringify(response));
            localStorage.setItem(
                "SESSIONID",
                response ? response[0].SESSIONID : ""
            );
            localStorage.setItem(
                "DVI_LOGIN",
                response ? response[0].SUBDIVISIONID : ""
            );
            localStorage.setItem(
                "TEN_DVI_LOGIN",
                response ? response[0].SUBDIVISIONNAME : ""
            );
            localStorage.setItem(
                "TIME_LOGIN",
                this.datePipe.transform(new Date(), "dd/MM/yyyy")
            );

            //Nếu log out thì xóa cái này ở session đi
            sessionStorage.setItem(
                "SESSIONID",
                response ? response[0].SESSIONID : ""
            );

            //Load thang nam lam viec
            let param = {
                MA_DVIQLY: response ? response[0].SUBDIVISIONID : "",
            };
            let responseThangLviec =
                await this.iServiceBase.getData_AsyncByPostRequest(
                    API.PHAN_HE.QTRIHTHONG,
                    API.API_QTHT.GET_THANG_NAM_LV,
                    param
                );

            if (responseThangLviec) {
                localStorage.setItem(
                    "THANG_NAM_HT",
                    JSON.stringify(responseThangLviec)
                );
            }

            //Load thông số hệ thống
            let responseThamSoHeThong =
                await this.iServiceBase.getData_AsyncByPostRequest(
                    API.PHAN_HE.QTRIHTHONG,
                    API.API_QTHT.GET_ALL_PARAMETER,
                    param
                );
            if (responseThamSoHeThong) {
                localStorage.setItem(
                    "THAM_SO_HT",
                    JSON.stringify(responseThamSoHeThong)
                );
            }
        }

        this.router.navigate(["/Home"]);
    }

    onEnterTKiemMaKHang(event) {
        if (event.keyCode == 13) {
            this.onSubmit();
        }
    }
}
