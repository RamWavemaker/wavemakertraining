package servlets;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.DatabaseRepositoryImpl;
import security.AuthenticateUser;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.IOException;
import java.sql.SQLException;
@WebServlet("/loginservlet")
public class LoginServlet extends HttpServlet {
    private static Logger logger = LoggerFactory.getLogger(LoginServlet.class);
    private AuthenticateUser authenticateUser;
    private DatabaseServices dbservices;

    @Override
    public void init(ServletConfig config) throws ServletException {
        dbservices = new DatabaseServicesImpl();
        try {
            authenticateUser = new AuthenticateUser();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        String Email = req.getParameter("email");
        String Password = req.getParameter("password");

        if (authenticateUser == null) {
            logger.error("AuthenticateUser instance is null");
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"message\": \"Authentication service is not available\"}");
            return;
        }

        boolean isAuthenticated = false;

        try{
//            dbservices.AuthenticateUser(Email,Password);
            isAuthenticated = authenticateUser.Authenticate(Email,Password);
        } catch (Exception e) {
            logger.error("Authentication error", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"message\": \"Authentication error\"}");
            return;
        }

        if(isAuthenticated){
            try {
                int loginuserid = dbservices.getLoginId(Email);
                logger.debug("User ID is: {}", loginuserid);

                HttpSession session = req.getSession();
                session.setAttribute("LOGIN_USER_ID",loginuserid);
                String sessionid = session.getId();
                Cookie sessionCookie = new Cookie("SESSIONID", sessionid);
                sessionCookie.setHttpOnly(true);
                sessionCookie.setSecure(true);
                res.addCookie(sessionCookie);

                res.getWriter().write("Login successful!"+sessionid);
                String path = req.getContextPath() + "/index.html";
                res.sendRedirect(path);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }else{
            String path = req.getContextPath() + "/";
            res.sendRedirect(path);
        }

    }
}
