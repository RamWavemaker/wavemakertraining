package models;

import java.sql.Date;

public class Leaves {
    public Leaves() {

    }

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    public enum LeaveType{
        SICK,CASUAL,MATERNITY,PATERNITY
    }

    int Id;
    private Date fromDate;
    private Date toDate;
    private Date appliedDate;

    private int Empid;
    private int loginid;
    private Status status = Status.PENDING;
    private LeaveType leaveType;
    private String leaveComment;


    public Leaves(Date fromDate, Date toDate, Date appliedDate, Status status, int Empid, int loginid, LeaveType leaveType, String leaveComment) {

        this.fromDate = fromDate;
        this.toDate = toDate;
        this.Empid = Empid;
        this.appliedDate = appliedDate;
        this.status = status;
        this.loginid = loginid;
        this.leaveType = leaveType;
        this.leaveComment = leaveComment;
    }


    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }

    public Date getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(Date appliedDate) {
        this.appliedDate = appliedDate;
    }

    public int getEmpid() {
        return Empid;
    }

    public void setEmpid(int empid) {
        Empid = empid;
    }

    public int getLoginid() {
        return loginid;
    }

    public void setLoginid(int loginid) {
        this.loginid = loginid;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public String getLeaveComment(String leaveComment) {
        return this.leaveComment;
    }

    public void setLeaveComment(String leaveComment) {
        this.leaveComment = leaveComment;
    }

    @Override
    public String toString() {
        return "Leaves{" +
                "Id=" + Id +
                ", fromDate=" + fromDate +
                ", toDate=" + toDate +
                ", appliedDate=" + appliedDate +
                ", Empid=" + Empid +
                ", loginid=" + loginid +
                ", status=" + status +
                ", leaveType=" + leaveType +
                ", leaveComment='" + leaveComment + '\'' +
                '}';
    }
}
