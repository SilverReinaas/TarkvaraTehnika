package ee.ttu.softtech.model;

import javax.persistence.*;

@Entity
public class AppUser {

    @Id
    @SequenceGenerator(name = "app_user_id_seq_gen", sequenceName = "app_user_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "app_user_id_seq_gen")
    private Integer id;
    private String username;
    private String password;
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}