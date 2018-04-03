package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class Exercise {

    @Id
    @SequenceGenerator(name = "exercise_id_seq_gen", sequenceName = "exercise_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exercise_id_seq_gen")
    private Integer id;
    private String name;
    private String description;
    @Column(name = "user_id")
    private Integer userId;
    
    @Transient
    private Set<Integer> unitTypeIds;
    @Transient
    private List<UnitType> unitTypes;
    @Transient
    private Set<Integer> muscleIds;
    @Transient
    private List<Muscle> muscles;
    @Transient
    private List<ExerciseSet> sets;
}