package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
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
    @Transient
    private List<UnitType> unitTypes;
}