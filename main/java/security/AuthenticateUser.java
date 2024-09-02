package security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.DatabaseRepositoryImpl;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.sql.SQLException;

public class AuthenticateUser {
    private static Logger logger = LoggerFactory.getLogger(AuthenticateUser.class);
    DatabaseServices dbservices;
    public AuthenticateUser() throws SQLException, ClassNotFoundException {
        dbservices = new DatabaseServicesImpl();
    }

    public boolean Authenticate(String email, String password){
        try {
            return dbservices.AuthenticateUser(email, password);
        } catch (Exception e) {
            logger.error("Unexpected error during authentication", e);
            throw new RuntimeException("Unexpected error", e); // Rethrow or handle as needed
        }
    }
}
