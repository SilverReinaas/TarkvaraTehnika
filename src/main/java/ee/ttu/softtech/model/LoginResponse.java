package ee.ttu.softtech.model;

import org.apache.commons.lang3.RandomStringUtils;

public class LoginResponse {

    private Status status;
    private String accessToken;
    private Integer userId;

    public LoginResponse(Status status) {
        this.status = status;

        if (Status.OK.equals(status)) {
            this.accessToken = RandomStringUtils.randomAlphanumeric(10);
        }
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public static enum Status {
        OK,
        FAIL
    }
}
