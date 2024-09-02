package repository;

import models.Employees;
import models.Leaves;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface DatabaseRepository {
    public boolean AuthenticateUser(String Email,String Password);
    public int getLoginId(String Email) throws SQLException;
    public int addLeaves(Date fromDate, Date toDate,Date AppliedDate, int employeeId, int loginId,String leaveType, String leaveComment)throws SQLException;
    public List<Leaves> getLeaves(int userid);
    public List<Leaves> getLeavesOfEmployees(List<Integer> empIds);
    public List<Integer> getEmpUnderManager(int managerId);
    public boolean StatusChange(Leaves.Status newStatus, int leaveId);
    public List<Leaves> getPendingRequests(int userid);
    public List<Leaves> getApprovedrequest(int userid);
    public List<Leaves> getRejectedRequests(int userid);
    public List<Employees> getEmployeedetails(int loginid) throws SQLException;
    public List<Integer> getNoOfLeavesByTypeAndUser(Leaves.LeaveType leaveType, int userid) throws SQLException;
    public int getNoOfDaysBetweenDates(List<Integer> leaveIds) throws SQLException;
    public List<Map.Entry<Leaves.LeaveType, Integer>> getLimitedLeavesByType();
}
