package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
@WebServlet("/validatecokkie")
public class ValidateCookie extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute("LOGIN_USER_ID") != null) {
            // Session is valid
            resp.getWriter().write("{\"message\": \"valid\"}");
        } else {
            // Session is invalid or does not exist
            resp.getWriter().write("{\"message\": \"isnotvalid\"}");
        }
    }
}
