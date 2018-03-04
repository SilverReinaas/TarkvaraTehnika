package ee.ttu.softtech.model;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.Date;
import java.util.Map;

@Entity
public class ExerciseLog {

    @Id
    @SequenceGenerator(name = "exercise_log_id_seq_gen", sequenceName = "exercise_log_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_log_id_seq_gen")
    private Integer id;
    @Column(name = "log_date")
    private Date date = new Date();
    @Column(name = "exercise_id")
    private Integer exerciseId;
    @Transient
    private Map<Integer, Float> measurements;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Integer exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Map<Integer, Float> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(Map<Integer, Float> measurements) {
        this.measurements = measurements;
    }
}
