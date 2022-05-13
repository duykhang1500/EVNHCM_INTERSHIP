package restwebservice;

import RESTmodel.DmCphiKhaosat;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import java.sql.Timestamp;

import java.util.ArrayList;

import java.util.Date;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Encoded;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import restwebservice.DAO;

import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import org.jooq.DSLContext;
import org.jooq.Query;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;


@Path("SurveyCostService")
public class SurveyCostCategoryService {
    public SurveyCostCategoryService() {
        super();
    }


    @GET
    @Produces("application/json")
    @Path("/getAll")
    public List<DmCphiKhaosat> getAll(){
        List<DmCphiKhaosat> dmCPKS = new ArrayList<DmCphiKhaosat>();
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            DSLContext create = DSL.using(conn, SQLDialect.ORACLE12C);
            
            Query selectSQL = create.select().from("DM_CPHI_KHAOSAT");
            String sql = selectSQL.getSQL();
            
            Statement statement = conn.createStatement();
            ResultSet result = statement.executeQuery(sql);
            
            while(result.next()){
                DmCphiKhaosat obj = new DmCphiKhaosat();
                obj.setMaDviqly(result.getString("MA_DVIQLY"));
                obj.setMaCphiKsat(result.getString("MA_CPHI_KSAT"));
                obj.setTenCphiKsat(result.getString("TEN_CPHI_KSAT"));
                obj.setDvt(result.getString("DVT"));
                obj.setCphiKsat(result.getBigDecimal("CPHI_KSAT"));
                obj.setHeSoKsat(result.getBigDecimal("HE_SO_KSAT"));
                obj.setNguoiTao(result.getString("NGUOI_TAO"));
                obj.setNguoiSua(result.getString("NGUOI_SUA"));
                obj.setNgayTao(result.getDate("NGAY_TAO"));
                obj.setNgaySua(result.getDate("NGAY_SUA"));
                obj.setTrangThai(result.getBigDecimal("TRANG_THAI"));
                dmCPKS.add(obj);
            }
            return dmCPKS;
        }catch(Exception e){
            e.printStackTrace();
        }
        return dmCPKS;
    }


    @POST
    @Path("/create")
    public Boolean createServeyCost(@FormParam("maDviqly") String maDonViQuanLy,
                                     @FormParam("maCphiKsat") String maChiPhiKhaoSat,
                                     @FormParam("tenCphiKsat") String tenChiPhiKhaoSat,
                                     @FormParam("dvt") String donViTinh, @FormParam("cphiKsat") int chiPhiKhaoSat,
                                     @FormParam("heSoKsat") int heSoKhaoSat, @FormParam("nguoiTao") String nguoiTao,
                                     @FormParam("nguoiSua") String nguoiSua, @FormParam("ngayTao") String ngayTao,
                                     @FormParam("ngaySua") String ngaySua, @FormParam("trangThai") int trangThai
            ){
        try{
            System.out.println(maChiPhiKhaoSat);
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            PreparedStatement checkPrimaryKey = conn.prepareStatement("SELECT * FROM DM_CPHI_KHAOSAT WHERE MA_CPHI_KSAT=?");
            checkPrimaryKey.setString(1, maChiPhiKhaoSat);
            ResultSet rs = checkPrimaryKey.executeQuery();
            if(rs.next()){
                return false;
            }
            PreparedStatement pstm = conn.prepareStatement("INSERT INTO DM_CPHI_KHAOSAT VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            pstm.setString(1, maDonViQuanLy);
            pstm.setString(2, maChiPhiKhaoSat);
            pstm.setString(3, tenChiPhiKhaoSat);
            pstm.setString(4, donViTinh);
            pstm.setInt(5, chiPhiKhaoSat);
            pstm.setInt(6, heSoKhaoSat);
            pstm.setString(7, nguoiTao);
    //            pstm.setString(8, nguoiSua);
            pstm.setString(8, null);

            pstm.setDate(9, java.sql.Date.valueOf(ngayTao));
    //            pstm.setDate(10, java.sql.Date.valueOf(ngaySua));
            pstm.setDate(10, null);
            pstm.setInt(11, trangThai);
            pstm.execute();
            return true;

        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
//        return Response.status(200).entity("Added new survey cost!").build();
    }


    @PUT
    @Path("/{maChiPhiKhaoSat}/update")
    public Boolean updateSurveyCode(@FormParam("maDonViQuanLy") String maDonViQuanLy,
                                     @FormParam("tenChiPhiKhaoSat") String tenChiPhiKhaoSat,
                                     @FormParam("donViTinh") String donViTinh,
                                     @FormParam("chiPhiKhaoSat") int chiPhiKhaoSat,
                                     @FormParam("heSoKhaoSat") int heSoKhaoSat, @FormParam("nguoiSua") String nguoiSua,
                                     @FormParam("ngaySua") String ngaySua, @FormParam("trangThai") int trangThai,
                                     @PathParam("maChiPhiKhaoSat") String maChiPhiKhaoSat
    ){
        System.out.println("Go to update");
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            String sql = "UPDATE DM_CPHI_KHAOSAT SET MA_DVIQLY=?, TEN_CPHI_KSAT=?, DVT=?, CPHI_KSAT=?, HE_SO_KSAT=?, NGUOI_SUA=?, NGAY_SUA=?, TRANG_THAI=? WHERE MA_CPHI_KSAT=?";
            PreparedStatement pstm = conn.prepareStatement(sql);
            pstm.setString(1, maDonViQuanLy);
            pstm.setString(2, tenChiPhiKhaoSat);
            pstm.setString(3, donViTinh);
            pstm.setInt(4, chiPhiKhaoSat);
            pstm.setInt(5, heSoKhaoSat);
            pstm.setString(6, nguoiSua);
            pstm.setDate(7, java.sql.Date.valueOf(ngaySua));
            pstm.setInt(8, trangThai);
            pstm.setString(9, maChiPhiKhaoSat);
            int isUpdated = pstm.executeUpdate();
            if(isUpdated > 0){
                return true;
            }
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
     
    }


    @DELETE
    @Path("/{maChiPhiKhaoSat}/delete")
    public Boolean deleteSurveyCost(@PathParam("maChiPhiKhaoSat") String maChiPhiKhaoSat){
        try{
            System.out.println("Ma Chi Phi Khao Sat " + maChiPhiKhaoSat);
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            PreparedStatement pstm = conn.prepareStatement("DELETE FROM DM_CPHI_KHAOSAT WHERE MA_CPHI_KSAT=?");
            pstm.setString(1, maChiPhiKhaoSat);
            pstm.executeUpdate();
//                return Response.status(200).entity("Delete successfully!").build();
        }catch(Exception e){
            e.printStackTrace();
        }
//        return Response.status(500).entity("Deleted failure!").build();
        return true;
           
    }


}
