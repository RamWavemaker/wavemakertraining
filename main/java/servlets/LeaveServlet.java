package servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Leaves;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.DatabaseServices;
import services.DatabaseServicesImpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static repository.DatabaseRepositoryImpl.logger;
@WebServlet("/leaveServlet")
public class LeaveServlet extends HttpServlet {
    private DatabaseServices dbservices;
    private static Logger logger = LoggerFactory.getLogger(LeaveServlet.class);

    @Override
    public void init() throws ServletException {
        dbservices = new DatabaseServicesImpl();
        logger.debug("Hey i am comming into leaveservlet");
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        // Retrieve session and user ID
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

        // Fetch the list of leaves
        List<Leaves> leavesList = dbservices.getLeaves(userId);

        // Convert the list to JSON
        Gson gson = new Gson();
        String jsonLeavesList = gson.toJson(leavesList);

        // Write JSON to response
        res.getWriter().write(jsonLeavesList);
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws  IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        StringBuilder stringBuilder = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
        }

        String jsonString = stringBuilder.toString();
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(jsonString);
        } catch (Exception e) {
            logger.error("Invalid JSON format", e);
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "Invalid JSON format");
            res.getWriter().write(errorJson.toString());
            return;
        }

        HttpSession session = req.getSession(false);
        logger.debug(String.valueOf((int) session.getAttribute("LOGIN_USER_ID")));
        String fromdateString = jsonObject.optString("fromdate", null);
        String todateString = jsonObject.optString("todate", null);
        String AppliedDateString = jsonObject.optString("Applieddate",null);
        int employeeId = (int) session.getAttribute("LOGIN_USER_ID");
        int loginid = (int) session.getAttribute("LOGIN_USER_ID");
        String leaveType = jsonObject.optString("leavetype",null);
        String leaveComment = jsonObject.optString("leavecomment",null);

        if (fromdateString == null || todateString == null || employeeId == -1 || loginid == -1) {
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "Missing or invalid parameters");
            res.getWriter().write(errorJson.toString());
            return;
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            java.util.Date fromDateUtil = dateFormat.parse(fromdateString);
            java.util.Date toDateUtil = dateFormat.parse(todateString);
            java.util.Date AppliedDateUtil = dateFormat.parse(AppliedDateString);
            Date fromDateSql = new Date(fromDateUtil.getTime());
            Date toDateSql = new Date(toDateUtil.getTime());
            Date AppliedDateSql = new Date(AppliedDateUtil.getTime());
            int leaveid = dbservices.addLeaves(fromDateSql, toDateSql,AppliedDateSql,employeeId, loginid,leaveType,leaveComment);
            JSONObject responseJson = new JSONObject();
            responseJson.put("leaveid", leaveid);
            res.getWriter().write(responseJson.toString());
        } catch (ParseException e) {
            logger.error("Date parsing error", e);
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "Invalid date format");
            res.getWriter().write(errorJson.toString());
        }catch (Exception e) {
            logger.error("Error while adding leave", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "Unexpected error: " + e.getMessage());
            res.getWriter().write(errorJson.toString());
        }
    }

}
