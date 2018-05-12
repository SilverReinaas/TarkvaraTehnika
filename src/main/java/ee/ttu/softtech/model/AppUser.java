package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@Entity
@Getter
@Setter
public class AppUser {

    @Id
    @SequenceGenerator(name = "app_user_id_seq_gen", sequenceName = "app_user_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "app_user_id_seq_gen")
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String forename;
    private String surname;
    private String code;
}