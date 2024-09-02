package servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Leaves;
import org.json.JSONException;
import org.json.JSONObject;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/managerservlet")
public class ManagerServlet extends HttpServlet{
    private DatabaseServices dbservices;

    @Override
    public void init(){
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

        int Managerid;
        try {
            Managerid = (int) session.getAttribute("LOGIN_USER_ID");
        } catch (ClassCastException e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Invalid session data\"}");
            return;
        }

        try {
            List<Integer> listOfEmp = dbservices.getEmpUnderManager(Managerid);
            List<Leaves> leavesOfEmp = dbservices.getLeavesOfEmployees(listOfEmp);
            leavesOfEmp.sort((l1,l2) -> Integer.compare(l2.getId(), l1.getId()));

            Gson gson = new Gson();
            String jsonLeavesList = gson.toJson(leavesOfEmp);

            // Write JSON to response
            res.setStatus(HttpServletResponse.SC_OK);
            res.getWriter().write(jsonLeavesList);
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"An error occurred while processing the request\"}");
            e.printStackTrace(); // Log exception details for debugging
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {   //approving requests
        // Read the request body
        StringBuilder body = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
        }

        // Parse JSON
        try {
            JSONObject json = new JSONObject(body.toString());
            int leaveId = json.getInt("leaveid");
            Leaves.Status status = Leaves.Status.valueOf(json.getString("status").toUpperCase());

            // Call the ApproveRequest method
            boolean success = dbservices.StatusChange(status, leaveId);

            if (success) {
                res.setStatus(HttpServletResponse.SC_OK);
                res.getWriter().write(new JSONObject().put("message", "Leave request updated successfully").toString());
            } else {
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                res.getWriter().write(new JSONObject().put("message", "Failed to update leave request").toString());
            }
        } catch (JSONException e) {
            res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON format");
        } catch (IllegalArgumentException e) {
            res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid status value");
        }
    }

}
