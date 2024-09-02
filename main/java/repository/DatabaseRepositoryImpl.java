package repository;

import models.Employees;
import models.Leaves;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utility.DatabaseConnector;

import java.sql.*;
import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class DatabaseRepositoryImpl implements DatabaseRepository{
    public static final Logger logger = LoggerFactory.getLogger(DatabaseRepositoryImpl.class);
    DatabaseConnector db = null;
    Connection conn;
    public DatabaseRepositoryImpl() throws SQLException, ClassNotFoundException {
        db = new DatabaseConnector();
        conn = db.getConnection();
    }

    public boolean AuthenticateUser(String Email,String Password){
        String query = "SELECT * FROM LOGIN WHERE EMAIL_ID = ? AND PASSWORD = ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setString(1, Email);
            pst.setString(2, Password);
            try (ResultSet rs = pst.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            logger.error("Error while authenticating user", e);
            return false;
        }
    }

    public int getLoginId(String Email) throws SQLException {
        logger.debug("Entered get UserId method with email: {}", Email);
        String query = "SELECT ID FROM LOGIN WHERE EMAIL_ID = ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setString(1,Email);

            try(ResultSet rs = pst.executeQuery()){
                if (rs.next()) {
                    int userId = rs.getInt("ID");
                    logger.debug("The user ID is: {}", userId);
                    return userId;
                } else {
                    return -1;
                }
            }
        }
    }



    public int addLeaves(Date fromDate, Date toDate,Date AppliedDate, int employeeId, int loginId,String leaveType, String leaveComment) throws SQLException {
        logger.debug("Adding leave for Employee ID: {}", employeeId);

        // SQL query to insert a new leave record
        String query = "INSERT INTO LEAVES (FROM_DATE, TO_DATE,APPLIED_DATE, EMPLOYEE_ID, LOGIN_ID,LEAVE_TYPE,LEAVE_COMMENT) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement pst = conn.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS)) {
            pst.setDate(1, fromDate);
            pst.setDate(2, toDate);
            pst.setDate(3,AppliedDate);
            pst.setInt(4, employeeId);
            pst.setInt(5, loginId);
            pst.setString(6,leaveType);
            pst.setString(7,leaveComment);

            int affectedRows = pst.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Insertion failed, no rows affected.");
            }

            try (ResultSet generatedKeys = pst.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1); // Return the generated ID
                } else {
                    throw new SQLException("Creating leave failed, no ID obtained.");
                }
            }
        } catch (SQLException e) {
            logger.error("SQL Exception occurred while adding leave", e);
            throw new SQLException("Database error occurred while adding leave", e);
        }
    }

    @Override
    public List<Leaves> getLeaves(int userid) {
        logger.debug("Getting loggedInUser by id: {}", userid);
        String query = "SELECT * FROM LEAVES WHERE LOGIN_ID = ?";
        List<Leaves> leavesList = new ArrayList<>();
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setInt(1,userid);
            ResultSet resultSet = pst.executeQuery();
            while(resultSet.next()){
                Leaves leaves = new Leaves();
                leaves.setId(resultSet.getInt("ID"));
                leaves.setFromDate(resultSet.getDate("FROM_DATE"));
                leaves.setToDate(resultSet.getDate("TO_DATE"));
                leaves.setAppliedDate(resultSet.getDate("APPLIED_DATE"));
                leaves.setLoginid(resultSet.getInt("LOGIN_ID"));
                leaves.setStatus(Leaves.Status.valueOf(resultSet.getString("Status")));
                leaves.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                leaves.setLeaveType(Leaves.LeaveType.valueOf(resultSet.getString("LEAVE_TYPE")));
                leaves.setLeaveComment(resultSet.getString("LEAVE_COMMENT"));
                leavesList.add(leaves);
            }
        }catch (SQLException e){
            logger.debug(e.toString());
        }
        return leavesList;
    }

    public List<Leaves> getLeavesOfEmployees(List<Integer> empIds) {
        List<Leaves> leavesList = new ArrayList<>();
        if (empIds == null || empIds.isEmpty()) {
            return leavesList;
        }

        // Create a string of placeholders for the prepared statement
        StringBuilder placeholders = new StringBuilder();
        for (int i = 0; i < empIds.size(); i++) {
            if (i > 0) {
                placeholders.append(",");
            }
            placeholders.append("?");
        }

        String query = "SELECT * FROM LEAVES WHERE EMPLOYEE_ID IN (" + placeholders.toString() + ")";

        try (PreparedStatement pst = conn.prepareStatement(query)) {
            // Set the parameters for the prepared statement
            for (int i = 0; i < empIds.size(); i++) {
                pst.setInt(i + 1, empIds.get(i));
            }

            try (ResultSet resultSet = pst.executeQuery()) {
                while (resultSet.next()) {
                    Leaves leaves = new Leaves();
                    leaves.setId(resultSet.getInt("ID"));
                    leaves.setFromDate(resultSet.getDate("FROM_DATE"));
                    leaves.setToDate(resultSet.getDate("TO_DATE"));
                    leaves.setAppliedDate(resultSet.getDate("APPLIED_DATE"));
                    leaves.setLoginid(resultSet.getInt("LOGIN_ID"));
                    leaves.setStatus(Leaves.Status.valueOf(resultSet.getString("STATUS")));
                    leaves.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                    leaves.setLeaveType(Leaves.LeaveType.valueOf(resultSet.getString("LEAVE_TYPE")));
                    leaves.setLeaveComment(resultSet.getString("LEAVE_COMMENT"));
                    leavesList.add(leaves);
                }
            } catch (SQLException e) {
                logger.error("Error processing result set", e);
            }
        } catch (SQLException e) {
            logger.error("SQL Exception during query execution", e);
        }

        return leavesList;
    }


    public List<Integer> getEmpUnderManager(int managerId) {
        List<Integer> empIds = new ArrayList<>();
        String query = "SELECT ID FROM EMPLOYEES WHERE MANAGER_ID = ?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, managerId);
            try (ResultSet resultSet = pst.executeQuery()) {
                while (resultSet.next()) {
                    empIds.add(resultSet.getInt("ID"));
                }
            }
        } catch (SQLException e) {
            logger.error("SQL Exception while getting employees under manager", e);
        }
        return empIds;
    }

    public boolean StatusChange(Leaves.Status newStatus, int leaveId) {
        String query = "UPDATE LEAVES SET STATUS = ? WHERE ID = ?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setString(1, newStatus.name()); // Use the name() method to get the string representation of the enum
            pst.setInt(2, leaveId);
            int affectedRows = pst.executeUpdate();
            return affectedRows > 0; // Return true if the update was successful
        } catch (SQLException e) {
            logger.error("Error occurred while updating leave status", e);
            return false;
        }
    }

    public List<Leaves> getPendingRequests(int userid){
        List<Leaves> pendingLeaves = new ArrayList<>();
        String query = "SELECT * FROM LEAVES WHERE STATUS ='PENDING' AND EMPLOYEE_ID = ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setInt(1,userid);
            ResultSet resultSet = pst.executeQuery();
            while(resultSet.next()){
                Leaves leave = new Leaves();
                leave.setId(resultSet.getInt("ID"));
                leave.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                leave.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                leave.setFromDate(resultSet.getDate("FROM_DATE"));
                leave.setToDate(resultSet.getDate("TO_DATE"));
                leave.setAppliedDate(resultSet.getDate("APPLIED_DATE"));
                leave.setLeaveType(Leaves.LeaveType.valueOf(resultSet.getString("LEAVE_TYPE")));
                leave.setLeaveComment(resultSet.getString("LEAVE_COMMENT"));
                leave.setStatus(Leaves.Status.valueOf(resultSet.getString("STATUS")));
                pendingLeaves.add(leave);
            }
        }catch(SQLException e){
            logger.debug("getPendingRequests failed", e);
        }
        return pendingLeaves;
    }


    public List<Leaves> getApprovedrequest(int userid){
        List<Leaves> approvedleaves = new ArrayList<>();
        String query = "SELECT * FROM LEAVES WHERE STATUS = 'APPROVED' AND EMPLOYEE_ID = ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setInt(1,userid);
            ResultSet resultSet = pst.executeQuery();
            while(resultSet.next()){
                Leaves leave = new Leaves();
                leave.setId(resultSet.getInt("ID"));
                leave.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                leave.setFromDate(resultSet.getDate("FROM_DATE"));
                leave.setToDate(resultSet.getDate("TO_DATE"));
                leave.setAppliedDate(resultSet.getDate("APPLIED_DATE"));
                leave.setLeaveType(Leaves.LeaveType.valueOf(resultSet.getString("LEAVE_TYPE")));
                leave.setLeaveComment(resultSet.getString("LEAVE_COMMENT"));
                leave.setStatus(Leaves.Status.valueOf(resultSet.getString("STATUS")));
                approvedleaves.add(leave);
            }
        }catch(SQLException e){
            logger.debug("getpendingleaves failed",e);
        }
        return approvedleaves;
    }

    public List<Employees> getEmployeedetails(int loginid) throws SQLException {
        List<Employees> employeesList = new ArrayList<>();
        String query = "SELECT * FROM EMPLOYEES WHERE LOGIN_ID = ?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, loginid);

            try (ResultSet resultSet = pst.executeQuery()) {
                if (resultSet.next()) {
                    Employees employee = new Employees();
                    employee.setId(resultSet.getInt("ID"));
                    employee.setName(resultSet.getString("NAME"));
                    employee.setGender(Employees.Gender.valueOf(resultSet.getString("GENDER")));
                    employee.setManagerId(resultSet.getInt("MANAGER_ID"));
                    employee.setLoginid(resultSet.getInt("LOGIN_ID"));
                    employeesList.add(employee);
                }
            }
        }
        return employeesList;
    }


    public List<Employees> getEmployeesdetails(List<Integer> empids) throws SQLException {
        if (empids == null || empids.isEmpty()) {
            return Collections.emptyList(); // Return an empty list if the input list is null or empty
        }

        List<Employees> employeesList = new ArrayList<>();

        // Construct the SQL query with placeholders for the IN clause
        StringBuilder queryBuilder = new StringBuilder("SELECT * FROM EMPLOYEES WHERE EMPLOYEE_ID IN (");
        for (int i = 0; i < empids.size(); i++) {
            queryBuilder.append("?");
            if (i < empids.size() - 1) {
                queryBuilder.append(",");
            }
        }
        queryBuilder.append(")");

        String query = queryBuilder.toString();

        try (PreparedStatement pst = conn.prepareStatement(query)) {
            // Set the parameters for the PreparedStatement
            for (int i = 0; i < empids.size(); i++) {
                pst.setInt(i + 1, empids.get(i));
            }

            try (ResultSet resultSet = pst.executeQuery()) {
                while (resultSet.next()) {
                    Employees employee = new Employees();
                    employee.setId(resultSet.getInt("EMPLOYEE_ID"));
                    employee.setName(resultSet.getString("NAME"));
                    employee.setGender(Employees.Gender.valueOf(resultSet.getString("GENDER")));
                    employee.setManagerId(resultSet.getInt("MANAGER_ID"));
                    employee.setLoginid(resultSet.getInt("LOGIN_ID"));
                    employeesList.add(employee);
                }
            }
        }

        return employeesList;
    }




    public List<Leaves> getRejectedRequests(int userid){
        List<Leaves> rejectedleaves = new ArrayList<>();
        String query = "SELECT * FROM LEAVES WHERE STATUS ='REJECTED' AND EMPLOYEE_ID = ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setInt(1,userid);
            ResultSet resultSet = pst.executeQuery();
            while(resultSet.next()){
                Leaves leave = new Leaves();
                leave.setId(resultSet.getInt("ID"));
                leave.setEmpid(resultSet.getInt("EMPLOYEE_ID"));
                leave.setFromDate(resultSet.getDate("FROM_DATE"));
                leave.setToDate(resultSet.getDate("TO_DATE"));
                leave.setAppliedDate(resultSet.getDate("APPLIED_DATE"));
                leave.setLeaveType(Leaves.LeaveType.valueOf(resultSet.getString("LEAVE_TYPE")));
                leave.setLeaveComment(resultSet.getString("LEAVE_COMMENT"));
                leave.setStatus(Leaves.Status.valueOf(resultSet.getString("STATUS")));
                rejectedleaves.add(leave);
            }
        }catch(SQLException e){
            logger.debug("getpendingleaves failed",e);
        }
        return rejectedleaves;
    }


    public List<Integer> getNoOfLeavesByTypeAndUser(Leaves.LeaveType leaveType, int userid) throws SQLException {
        List<Integer> leaveIds = new ArrayList<>();
        String query = "SELECT ID FROM LEAVES WHERE LEAVE_TYPE = ? AND EMPLOYEE_ID = ?";

        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setString(1, leaveType.name());
            pst.setInt(2, userid);
            try (ResultSet resultSet = pst.executeQuery()) {
                while (resultSet.next()) {
                    leaveIds.add(resultSet.getInt("ID"));
                }
            }
        }
        return leaveIds;
    }

    public int getNoOfDaysBetweenDates(List<Integer> leaveIds) throws SQLException {
        String query = "SELECT FROM_DATE, TO_DATE FROM LEAVES WHERE ID = ?";
        int totalDays = 0;

        try (PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            for (Integer leaveId : leaveIds) {
                // Set the leaveId parameter
                preparedStatement.setInt(1, leaveId);

                try (ResultSet resultSet = preparedStatement.executeQuery()) {
                    if (resultSet.next()) {
                        // Retrieve FROM_DATE and TO_DATE from the result set
                        Date fromDate = resultSet.getDate("FROM_DATE");
                        Date toDate = resultSet.getDate("TO_DATE");

                        if (fromDate != null && toDate != null) {
                            // Calculate the number of days between FROM_DATE and TO_DATE
                            LocalDate startDate = fromDate.toLocalDate();
                            LocalDate endDate = toDate.toLocalDate();
                            long numberOfDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;

                            // Accumulate the total number of days
                            totalDays += numberOfDays;
                        } else {
                            // Handle cases where dates might be null if needed
                            System.err.println("Warning: Null dates found for LEAVE_ID: " + leaveId);
                        }
                    } else {
                        // Handle cases where no record is found for a leaveId
                        System.err.println("Warning: No records found for LEAVE_ID: " + leaveId);
                    }
                }
            }
        }

        return totalDays;
    }

    public String getName(int empid) throws SQLException {
        String query = "SELECT NAME FROM EMPLOYEE WHERE ID= ?";
        try(PreparedStatement pst = conn.prepareStatement(query)){
            pst.setInt(1,empid);
            ResultSet resultSet = pst.executeQuery();
            if(resultSet.next()){
                return resultSet.getString("NAME");
            }
        }
        return null;
    }

    public List<Map.Entry<Leaves.LeaveType, Integer>> getLimitedLeavesByType() {
        String query = "SELECT LEAVE_TYPE, DAYS_ALLOWED FROM LEAVETYPE_MANAGEMENT";

        // Initialize EnumMap
        EnumMap<Leaves.LeaveType, Integer> leaveDaysByType = new EnumMap<>(Leaves.LeaveType.class);

        try (PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                String leaveTypeStr = rs.getString("LEAVE_TYPE");
                int daysAllowed = rs.getInt("DAYS_ALLOWED");
                Leaves.LeaveType leaveType = Leaves.LeaveType.valueOf(leaveTypeStr);
                leaveDaysByType.put(leaveType, daysAllowed);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        List<Map.Entry<Leaves.LeaveType, Integer>> leaveList = new ArrayList<>(leaveDaysByType.entrySet());

        return leaveList;
    }




}
