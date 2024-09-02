package servlets;

import Enums.LeaveType;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Leaves;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@WebServlet("/limitedleavesperuser")
public class LimitedLeavesPerUser extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(LimitedLeavesPerUser.class);
    private DatabaseServices dbservices;

    @Override
    public void init() throws ServletException {
        dbservices = new DatabaseServicesImpl();
        logger.debug("Initialized LimitedLeavesPerUser servlet");
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("LOGIN_USER_ID") == null) {
            logger.warn("Unauthorized access attempt: session or user ID missing");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("{\"error\":\"User not logged in\"}");
            return;
        }

        int userId;
        try {
            userId = (int) session.getAttribute("LOGIN_USER_ID");
        } catch (ClassCastException e) {
            logger.error("ClassCastException: Invalid session data", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Invalid session data\"}");
            return;
        }

        List<Map.Entry<Leaves.LeaveType, Integer>> limitedLeavesByType = dbservices.getLimitedLeavesByType();

        Gson gson = new GsonBuilder().create();

        try {
            String json = gson.toJson(limitedLeavesByType);
            res.getWriter().write(json);
        } catch (Exception e) {
            logger.error("Error converting data to JSON", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Internal server error\"}");
        }
    }
}
