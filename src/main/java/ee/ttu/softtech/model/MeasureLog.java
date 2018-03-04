package ee.ttu.softtech.model;

import javax.persistence.*;

@Entity
public class MeasureLog {
    
    @Id
    @SequenceGenerator(name = "measure_log_id_seq_gen", sequenceName = "measure_log_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "measure_log_id_seq_gen")
    private Integer id;
    private Integer exerciseId;
    private Integer unitTypeId;
    private Float val;

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

    public Integer getUnitTypeId() {
        return unitTypeId;
    }

    public void setUnitTypeId(Integer unitTypeId) {
        this.unitTypeId = unitTypeId;
    }

    public Float getVal() {
        return val;
    }

    public void setVal(Float val) {
        this.val = val;
    }
    
}