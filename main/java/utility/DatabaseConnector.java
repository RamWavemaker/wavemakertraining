package utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnector {
    private static Logger logger = LoggerFactory.getLogger(DatabaseConnector.class);
    private static final String URL = "jdbc:mysql://localhost:3306/LEAVE_MANAGEMENT";
    private static final String USER = "root";
    private static final String PASSWORD = "Wavemaker@Ram123";

    private Connection conn = null;

    public DatabaseConnector() throws SQLException, ClassNotFoundException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            logger.info("Database connected successfully!");
        } catch (ClassNotFoundException e) {
            logger.error("MySQL JDBC Driver not found: ", e);
            throw e;
        } catch (SQLException e) {
            logger.error("Connection failed: ", e);
            throw e;
        }
    }

    public Connection getConnection() {
        return conn;
    }

    public void closeConnection() {
        if (conn != null) {
            try {
                conn.close();
                logger.info("Database connection closed.");
            } catch (SQLException e) {
                logger.error("Failed to close the connection: ", e);
            }
        }
    }
}
