package models;

import java.sql.Date;

public class LeavesDTO extends Leaves{

    private String Name;
    private String EmailId;

    public LeavesDTO(String name, String emailId) {
        this.Name = name;
        this.EmailId = emailId;
    }

    public LeavesDTO(Date fromDate, Date toDate, Date appliedDate, Status status, int Empid, int loginid, LeaveType leaveType, String leaveComment, String name, String emailId) {
        super(fromDate, toDate, appliedDate, status, Empid, loginid, leaveType, leaveComment);
        this.Name = name;
        this.EmailId = emailId;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        this.Name = name;
    }

    public String getEmailId() {
        return EmailId;
    }

    public void setEmailId(String emailId) {
        this.EmailId = emailId;
    }
}
