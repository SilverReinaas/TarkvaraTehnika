package ee.ttu.softtech.model;

public class LoginResponse {

    private Status status;
    
    public LoginResponse(Status status) {
        this.status = status;
    }
    
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public static enum Status {
        OK,
        FAIL
    }
}
