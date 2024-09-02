package servlets;

import com.google.gson.Gson;
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
import java.util.List;
@WebServlet("/pendingleavesServlet")
public class GetPendingLeaveServlet extends HttpServlet {
    private DatabaseServices dbservices;
    private static Logger logger = LoggerFactory.getLogger(GetPendingLeaveServlet.class);

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

        List<Leaves> leavesList = dbservices.getPendingRequests(userId);

        Gson gson = new Gson();
        String jsonLeavesList = gson.toJson(leavesList);

        // Write JSON to response
        res.getWriter().write(jsonLeavesList);
    }
}
