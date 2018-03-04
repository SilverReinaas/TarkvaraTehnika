package ee.ttu.softtech.model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
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
    
    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Integer> getUnitTypeIds() {
        return unitTypeIds;
    }

    public void setUnitTypeIds(Set<Integer> unitTypeIds) {
        this.unitTypeIds = unitTypeIds;
    }

    public List<UnitType> getUnitTypes() {
        return unitTypes;
    }

    public void setUnitTypes(List<UnitType> unitTypes) {
        this.unitTypes = unitTypes;
    }
    
}