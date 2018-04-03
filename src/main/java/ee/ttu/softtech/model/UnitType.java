package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
@Getter
@Setter
public class UnitType {
    
    @Id
    private Integer id;
    private String name;
    private String unit;
}