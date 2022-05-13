package restwebservice;

import RESTmodel.DmVattu;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import restwebservice.DAO;

import java.sql.Connection;

import java.sql.PreparedStatement;

import java.sql.ResultSet;

import java.sql.Statement;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.PathParam;

@Path("MaterialListService")
public class MaterialListService {
    public MaterialListService() {
        super();
    }

    @GET
    @Produces(value = { "application/json", "application/xml", "text/xml" })
    @Path("/getAll")
    public List<DmVattu> getAll (){
        List<DmVattu> materialList = new ArrayList<DmVattu>();
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            String sql = "Select * from DM_VATTU";
            Statement statement = conn.createStatement();
            ResultSet result = statement.executeQuery(sql);
//            System.out.println(result.next());
            while(result.next()){
                DmVattu obj = new DmVattu();
                obj.setMaDviqly(result.getString("MA_DVIQLY"));
                obj.setMaVt(result.getString("MA_VT"));
                obj.setTen(result.getString("TEN"));
                obj.setDvt(result.getString("DVT"));
                obj.setSoPha(result.getBigDecimal("SO_PHA"));
                obj.setTrangThai(result.getBigDecimal("TRANG_THAI"));
                materialList.add(obj);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return materialList;
    }

    @POST
    @Path("/create")
    public Boolean createMaterial(@FormParam("maDviqly") String maDviqly, @FormParam("maVt") String maVtu,
                                  @FormParam("ten") String ten, @FormParam("dvt") String dvt,
                                  @FormParam("soPha") int soPha, @FormParam("trangThai") int trangThai
    ){
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            PreparedStatement checkPrimaryKey = conn.prepareStatement("SELECT * FROM DM_VATTU WHERE MA_VT=?");
            checkPrimaryKey.setString(1, maVtu);
            ResultSet rs = checkPrimaryKey.executeQuery();
            if(rs.next()){
                return false;
            }
                    PreparedStatement pstm = conn.prepareStatement("INSERT INTO DM_VATTU VALUES (?,?,?,?,?,?)");
                    pstm.setString(1, maDviqly);
                    pstm.setString(2, maVtu);
                    pstm.setString(3, ten);
                    pstm.setString(4, dvt);
                    pstm.setInt(5, soPha);
                    pstm.setInt(6, trangThai);
                    pstm.execute();
            return true;
        }catch(Exception e){
            return false;
        }
    }

    @PUT
    @Path("/{maVt}/update")
    public Boolean updateMaterial (
        @PathParam("maVt") String maVt,
        @FormParam("maDviqly") String maDviqly,
        @FormParam("ten") String ten,
        @FormParam("dvt") String dvt,
        @FormParam("soPha") int soPha,
        @FormParam("trangThai") int trangThai
        ){
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            PreparedStatement pstm = conn.prepareStatement("UPDATE DM_VATTU SET MA_DVIQLY=?, TEN = ?, DVT = ?, SO_PHA = ?, TRANG_THAI = ? WHERE MA_VT = ?");
            pstm.setString(1, maDviqly);
            pstm.setString(2, ten);
            pstm.setString(3, dvt);
            pstm.setInt(4, soPha);
            pstm.setInt(5, trangThai);
            pstm.setString(6, maVt);
            int updated = pstm.executeUpdate();
            if(updated > 0){
                return true;
            }
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return false;
    }

    @DELETE
    @Path("/{maVt}/delete")
    public Boolean deleteMaterial(@PathParam("maVt") String maVt){
        try{
            DAO dao = new DAO();
            Connection conn = dao.getConnection();
            PreparedStatement pstm = conn.prepareStatement("DELETE FROM DM_VATTU WHERE MA_VT=?");
            pstm.setString(1, maVt);
            int isDelete = pstm.executeUpdate();
            if(isDelete > 0){
                return true;
            }
        }catch(Exception e){
            return false;
        }
        return false;
    }
    
}
