package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

@Getter
@Setter
public class MeasureLogData {
    private Integer exerciseId;
    private String logDate = (new Date()).toString();
    private ArrayList<UnitType> unitTypes;
    private ArrayList<Float> values;
}
