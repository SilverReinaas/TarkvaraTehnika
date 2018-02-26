package ee.ttu.softtech.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Training {

    @Id
    @SequenceGenerator(name = "training_id_seq_gen", sequenceName = "training_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "training_id_seq_gen")
    private Integer id;
    private Date trainingTime;
    private String comment;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getTrainingTime() {
        return trainingTime;
    }

    public void setTrainingTime(Date trainingTime) {
        this.trainingTime = trainingTime;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    
}