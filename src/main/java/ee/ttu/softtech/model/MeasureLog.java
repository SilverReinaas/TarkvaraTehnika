package ee.ttu.softtech.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class MeasureLog {
    
    @Id
    @SequenceGenerator(name = "measure_log_id_seq_gen", sequenceName = "measure_log_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "measure_log_id_seq_gen")
    private Integer id;
    private Date created = new Date();
    @Column(name = "unit_type_id")
    private Integer unitTypeId;
    private Float val;
    @Column(name = "exercise_set_id")
    private Integer exerciseSetId;

    @Transient
    private UnitType unitType;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Integer getUnitTypeId() { return unitTypeId; }

    public void setUnitTypeId(Integer unitTypeId) {
        this.unitTypeId = unitTypeId;
    }

    public Float getVal() {
        return val;
    }

    public void setVal(Float val) {
        this.val = val;
    }

    public Integer getExerciseSetId() {
        return exerciseSetId;
    }

    public void setExerciseSetId(Integer exerciseSetId) {
        this.exerciseSetId = exerciseSetId;
    }

    public UnitType getUnitType() {
        return unitType;
    }

    public void setUnitType(UnitType unitType) {
        this.unitType = unitType;
    }
}