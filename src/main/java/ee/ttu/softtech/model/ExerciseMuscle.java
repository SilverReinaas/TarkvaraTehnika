package ee.ttu.softtech.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class ExerciseMuscle {

    @Id
    @SequenceGenerator(name = "exercise_muscle_id_seq_gen", sequenceName = "exercise_muscle_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_muscle_id_seq_gen")
    private Integer id;
    @Column(name = "exercise_id")
    private Integer exerciseId;
    @Column(name = "muscle_id")
    private Integer muscleId;

    public ExerciseMuscle() {
    }

    public ExerciseMuscle(Integer exerciseId, Integer muscleId) {
        this.exerciseId = exerciseId;
        this.muscleId = muscleId;
    }

    public Integer getMuscleId() {
        return muscleId;
    }

    public void setMuscleId(Integer muscleId) {
        this.muscleId = muscleId;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Integer exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}