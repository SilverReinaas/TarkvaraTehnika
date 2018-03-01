package ee.ttu.softtech.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Exercise {

    @Id
    @SequenceGenerator(name = "exercise_id_seq_gen", sequenceName = "exercise_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_id_seq_gen")
    private Integer id;
    private String name;
    private String description;
    @Column(name = "user_id")
    private Integer userId;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}