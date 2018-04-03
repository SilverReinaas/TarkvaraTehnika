package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
public class ExerciseUnitType implements Serializable {

    @Id
    @SequenceGenerator(name = "exercise_unit_type_id_seq_gen", sequenceName = "exercise_unit_type_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_unit_type_id_seq_gen")
    private Integer id;
    @Column(name = "exercise_id")
    private Integer exerciseId;
    @Column(name = "unit_type_id")
    private Integer unitTypeId;

    public ExerciseUnitType() {
    }

    public ExerciseUnitType(Integer exerciseId, Integer unitTypeId) {
        this.exerciseId = exerciseId;
        this.unitTypeId = unitTypeId;
    }
}