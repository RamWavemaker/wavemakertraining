package services;

import models.Employees;
import models.Leaves;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.DatabaseRepository;
import repository.DatabaseRepositoryImpl;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class DatabaseServicesImpl implements DatabaseServices{
    DatabaseRepository dbrepository;
    private static Logger logger = LoggerFactory.getLogger(DatabaseRepositoryImpl.class);
    public DatabaseServicesImpl(){
        try {
            dbrepository = new DatabaseRepositoryImpl();
        } catch (SQLException | ClassNotFoundException e) {
            logger.error("sql exception in DatabaseServiceImpl",e);// Or use a proper logging mechanism
        }
    }
    public boolean AuthenticateUser(String Email,String Password){
        return dbrepository.AuthenticateUser(Email,Password);
    }

    public int getLoginId(String Email) throws SQLException {
        logger.debug("Email {}",Email);
        return dbrepository.getLoginId(Email);
    }

    @Override
    public int addLeaves(Date fromDate, Date toDate,Date AppliedDate, int employeeId, int loginId,String leaveType, String leaveComment) throws SQLException {
        return dbrepository.addLeaves(fromDate, toDate, AppliedDate,employeeId, loginId,leaveType,leaveComment);
    }

    @Override
    public List<Leaves> getLeaves(int userid) {
        return dbrepository.getLeaves(userid);
    }
    public List<Leaves> getLeavesOfEmployees(List<Integer> empIds){
        return dbrepository.getLeavesOfEmployees(empIds);
    }

    public List<Integer> getEmpUnderManager(int managerId){
        return dbrepository.getEmpUnderManager(managerId);
    }

    @Override
    public boolean StatusChange(Leaves.Status newStatus, int leaveId) {
        return dbrepository.StatusChange(newStatus, leaveId);
    }

    @Override
    public List<Leaves> getPendingRequests(int userid) {
        return dbrepository.getPendingRequests(userid);
    }

    @Override
    public List<Leaves> getApprovedrequest(int userid) {
        return dbrepository.getApprovedrequest(userid);
    }

    public List<Leaves> getRejectedRequest(int userid){
        return dbrepository.getRejectedRequests(userid);
    }

    public List<Employees> getEmployeedetails(int loginid) throws SQLException{
        return dbrepository.getEmployeedetails(loginid);
    }

    @Override
    public List<Integer> getNoOfLeavesByTypeAndUser(Leaves.LeaveType leaveType, int userid) throws SQLException {
        return dbrepository.getNoOfLeavesByTypeAndUser(leaveType,userid);
    }

    @Override
    public int getNoOfDaysBetweenDates(List<Integer> leaveIds) throws SQLException {
        return dbrepository.getNoOfDaysBetweenDates(leaveIds);
    }

    @Override
    public List<Map.Entry<Leaves.LeaveType, Integer>> getLimitedLeavesByType() {
        return dbrepository.getLimitedLeavesByType();
    }

}
