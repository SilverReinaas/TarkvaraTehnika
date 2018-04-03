package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
public class Muscle {

    @Id
    private Integer id;
    private String muscleName;
    private Integer locationId;
}