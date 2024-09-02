package servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Employees;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/profileservlet")
public class ProfileServlet extends HttpServlet {
    private DatabaseServices dbservices;
    private static Logger logger = LoggerFactory.getLogger(LeaveServlet.class);
    private static final Gson gson = new Gson();
    @Override
    public void init() throws ServletException {
        dbservices = new DatabaseServicesImpl();
        logger.debug("Hey i am comming into profile");
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("LOGIN_USER_ID") == null) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("{\"error\":\"User not logged in\"}");
            return;
        }

        int userId;
        try {
            userId = (int) session.getAttribute("LOGIN_USER_ID");
        } catch (ClassCastException e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Invalid session data\"}");
            return;
        }

        try {
            List<Employees> employeesList = dbservices.getEmployeedetails(userId);
            String jsonEmployeeList = gson.toJson(employeesList);
            res.setContentType("application/json");
            res.getWriter().write(jsonEmployeeList);
        } catch (SQLException e) {
            logger.error("SQL Exception in Profile",e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Database error\"}");
        }
    }
}
