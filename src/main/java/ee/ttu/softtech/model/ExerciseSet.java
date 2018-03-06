package ee.ttu.softtech.model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class ExerciseSet {

    @Id
    @SequenceGenerator(name = "exercise_set_id_seq_gen", sequenceName = "exercise_set_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_set_id_seq_gen")
    private Integer id;
    @Column(name = "exercise_id")
    private Integer exerciseId;
    private Date created = new Date();

    @Transient
    private List<MeasureLog> measureLogs;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Integer exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public List<MeasureLog> getMeasureLogs() {
        return measureLogs;
    }

    public void setMeasureLogs(List<MeasureLog> measureLogs) {
        this.measureLogs = measureLogs;
    }
}