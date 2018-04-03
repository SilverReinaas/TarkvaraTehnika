package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

@Getter
@Setter
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

    public static enum Status {
        OK,
        FAIL
    }
}
