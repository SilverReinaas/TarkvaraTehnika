package ee.ttu.softtech.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUnitTypeId() {
        return unitTypeId;
    }

    public void setUnitTypeId(Integer unitTypeId) {
        this.unitTypeId = unitTypeId;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Integer exerciseId) {
        this.exerciseId = exerciseId;
    }
    
}