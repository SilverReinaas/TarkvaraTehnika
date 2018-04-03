package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
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
}