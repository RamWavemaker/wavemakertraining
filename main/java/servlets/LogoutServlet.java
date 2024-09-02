package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/logoutservlet")
public class LogoutServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false); // false to avoid creating a new session
        if (session != null) {
            session.invalidate(); // Invalidate the session
        }

        for(Cookie cookie : req.getCookies()){
            if ("SESSIONID".equals(cookie.getName())) {
                cookie.setValue(""); // Clear the value
                cookie.setPath("/"); // Make sure it matches the path used to create the cookie
                cookie.setMaxAge(0); // Expire the cookie immediately
                resp.addCookie(cookie); // Add the cleared cookie to the response
                break;
            }
        }

        resp.setContentType("text/plain");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write("Logout successful");

        // Redirect to the home page or login page after logout
        String path = req.getContextPath() + "/";
        resp.sendRedirect(path);
    }
}
