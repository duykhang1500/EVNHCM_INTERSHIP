package RESTmodel;

import java.io.Serializable;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@NamedQueries({ @NamedQuery(name = "DmVattu.findAll", query = "select o from DmVattu o") })
@Table(name = "DM_VATTU")
public class DmVattu implements Serializable {
    private static final long serialVersionUID = 2678838811798310808L;
    @Column(length = 20)
    private String dvt;
    @Column(name = "MA_DVIQLY", length = 6)
    private String maDviqly;
    @Id
    @Column(name = "MA_VT", nullable = false, length = 25)
    private String maVt;
    @Column(name = "SO_PHA")
    private BigDecimal soPha;
    private String ten;
    @Column(name = "TRANG_THAI")
    private BigDecimal trangThai;

    public DmVattu() {
    }

    public DmVattu(String dvt, String maDviqly, String maVt, BigDecimal soPha, String ten, BigDecimal trangThai) {
        this.dvt = dvt;
        this.maDviqly = maDviqly;
        this.maVt = maVt;
        this.soPha = soPha;
        this.ten = ten;
        this.trangThai = trangThai;
    }

    public String getDvt() {
        return dvt;
    }

    public void setDvt(String dvt) {
        this.dvt = dvt;
    }

    public String getMaDviqly() {
        return maDviqly;
    }

    public void setMaDviqly(String maDviqly) {
        this.maDviqly = maDviqly;
    }

    public String getMaVt() {
        return maVt;
    }

    public void setMaVt(String maVt) {
        this.maVt = maVt;
    }

    public BigDecimal getSoPha() {
        return soPha;
    }

    public void setSoPha(BigDecimal soPha) {
        this.soPha = soPha;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public BigDecimal getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(BigDecimal trangThai) {
        this.trangThai = trangThai;
    }
}
