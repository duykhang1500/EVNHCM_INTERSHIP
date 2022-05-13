package RESTmodel;

import java.io.Serializable;

import java.math.BigDecimal;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@NamedQueries({ @NamedQuery(name = "DmCphiKhaosat.findAll", query = "select o from DmCphiKhaosat o") })
@Table(name = "DM_CPHI_KHAOSAT")
public class DmCphiKhaosat implements Serializable {
    private static final long serialVersionUID = 1383254766726970134L;
    @Column(name = "CPHI_KSAT")
    private BigDecimal cphiKsat;
    private String dvt;
    @Column(name = "HE_SO_KSAT")
    private BigDecimal heSoKsat;
    @Id
    @Column(name = "MA_CPHI_KSAT", nullable = false, length = 20)
    private String maCphiKsat;
    @Column(name = "MA_DVIQLY", length = 6)
    private String maDviqly;
    @Temporal(TemporalType.DATE)
    @Column(name = "NGAY_SUA")
    private Date ngaySua;
    @Temporal(TemporalType.DATE)
    @Column(name = "NGAY_TAO")
    private Date ngayTao;
    @Column(name = "NGUOI_SUA", length = 50)
    private String nguoiSua;
    @Column(name = "NGUOI_TAO", length = 50)
    private String nguoiTao;
    @Column(name = "TEN_CPHI_KSAT")
    private String tenCphiKsat;
    @Column(name = "TRANG_THAI")
    private BigDecimal trangThai;

    public DmCphiKhaosat() {
    }

    public DmCphiKhaosat(BigDecimal cphiKsat, String dvt, BigDecimal heSoKsat, String maCphiKsat, String maDviqly,
                         Date ngaySua, Date ngayTao, String nguoiSua, String nguoiTao, String tenCphiKsat,
                         BigDecimal trangThai) {
        this.cphiKsat = cphiKsat;
        this.dvt = dvt;
        this.heSoKsat = heSoKsat;
        this.maCphiKsat = maCphiKsat;
        this.maDviqly = maDviqly;
        this.ngaySua = ngaySua;
        this.ngayTao = ngayTao;
        this.nguoiSua = nguoiSua;
        this.nguoiTao = nguoiTao;
        this.tenCphiKsat = tenCphiKsat;
        this.trangThai = trangThai;
    }

    public BigDecimal getCphiKsat() {
        return cphiKsat;
    }

    public void setCphiKsat(BigDecimal cphiKsat) {
        this.cphiKsat = cphiKsat;
    }

    public String getDvt() {
        return dvt;
    }

    public void setDvt(String dvt) {
        this.dvt = dvt;
    }

    public BigDecimal getHeSoKsat() {
        return heSoKsat;
    }

    public void setHeSoKsat(BigDecimal heSoKsat) {
        this.heSoKsat = heSoKsat;
    }

    public String getMaCphiKsat() {
        return maCphiKsat;
    }

    public void setMaCphiKsat(String maCphiKsat) {
        this.maCphiKsat = maCphiKsat;
    }

    public String getMaDviqly() {
        return maDviqly;
    }

    public void setMaDviqly(String maDviqly) {
        this.maDviqly = maDviqly;
    }

    public Date getNgaySua() {
        return ngaySua;
    }

    public void setNgaySua(Date ngaySua) {
        this.ngaySua = ngaySua;
    }

    public Date getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(Date ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getNguoiSua() {
        return nguoiSua;
    }

    public void setNguoiSua(String nguoiSua) {
        this.nguoiSua = nguoiSua;
    }

    public String getNguoiTao() {
        return nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getTenCphiKsat() {
        return tenCphiKsat;
    }

    public void setTenCphiKsat(String tenCphiKsat) {
        this.tenCphiKsat = tenCphiKsat;
    }

    public BigDecimal getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(BigDecimal trangThai) {
        this.trangThai = trangThai;
    }
}
