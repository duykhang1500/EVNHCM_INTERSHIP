package restwebservice;

import java.sql.Connection;
import java.sql.DriverManager;

public class DAO {
    public DAO() {
        super();
    }
    
    public Connection getConnection(){
            String userName = "HOMEUSER";
            String password = "password2";
            String url = "jdbc:oracle:thin:@localhost:1521:ORCL";
            Connection conn = null;
            try{
                conn = DriverManager.getConnection(url, userName, password);
                if(conn != null){
                    System.out.println("COnnetc to db success!");

                    return conn;
                }else{
                    System.out.println("Failed to connect.");
                }
            }catch(Exception e){
                 e.printStackTrace();
            }
            return null;    
        }
}
