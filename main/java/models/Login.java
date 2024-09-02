package models;

public class Login {
    private int Id;
    private String EmailId;
    private String Password;

    public Login() {}

    public Login(String EmailId,String Password){
        this.EmailId = EmailId;
        this.Password = Password;
    }


    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getEmailId() {
        return EmailId;
    }

    public void setEmailId(String emailId) {
        EmailId = emailId;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }
}
