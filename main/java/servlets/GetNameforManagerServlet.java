package servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Employees;
import models.Leaves;
import models.LeavesDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/getnamesformanager")
public class GetNameforManagerServlet extends HttpServlet {
    private DatabaseServices dbservices;
    private static Logger logger = LoggerFactory.getLogger(GetNameforManagerServlet.class);

    @Override
    public void init() throws ServletException {
        dbservices = new DatabaseServicesImpl();
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

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
        List<Integer> employeesids = dbservices.getEmpUnderManager(userId);
        List<List<Employees>> employeeslist = new ArrayList<>();
        for(int i=0;i<employeesids.size();i++){
            try {
                List<Employees> employeedetails = dbservices.getEmployeedetails(employeesids.get(i));
                employeeslist.add(employeedetails);
            } catch (SQLException e) {
                logger.debug("SQL Exception when get employeedetails",e);
            }
        }

        Gson gson = new Gson();
        String jsonEmployeeList = gson.toJson(employeeslist);

        // Write JSON to response
        res.getWriter().write(jsonEmployeeList);

    }
}
