package models;

public class Employees {
    public enum Gender{
        MALE,FEMALE
    }
    private int Id;
    private String name;
    private int ManagerId;
    private int Loginid;
    private Gender gender;
    public Employees() {}

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Employees(String name, int ManagerId, int LoginId){
        this.name = name;
        this.ManagerId = ManagerId;
        this.Loginid = LoginId;
    }


    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getManagerId() {
        return ManagerId;
    }

    public void setManagerId(int managerId) {
        ManagerId = managerId;
    }

    public int getLoginid() {
        return Loginid;
    }

    public void setLoginid(int Loginid) {
        this.Loginid = Loginid;
    }
}
