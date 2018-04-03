package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
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
}