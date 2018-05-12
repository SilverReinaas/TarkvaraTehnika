package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseSetRepository;
import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class MeasureLogServiceImplTest {

    private MeasureLogServiceImpl mls = new MeasureLogServiceImpl();

    @Mock
    private MeasureLogRepository mlr;
    @Mock
    private ExerciseSetRepository esr;
    @Mock
    private UnitTypeRepository utr;

    private MeasureLog ml = new MeasureLog();
    private ExerciseSet es = new ExerciseSet();
    private UnitType ut = new UnitType();

    @Before
    public void setUp() {
        ml.setId(2);
        ml.setCreated(new Date());
        ml.setExerciseSetId(4);
        ml.setUnitTypeId(1);

        List<MeasureLog> logs = new ArrayList<>();
        logs.add(ml);

        mlr = mock(MeasureLogRepository.class);
        when(mlr.findAll()).thenReturn(logs);
        when(mlr.save(ml)).thenThrow(new IllegalStateException());

        es.setExerciseId(6);
        esr = mock(ExerciseSetRepository.class);
        when(esr.save(es)).thenThrow(new IllegalStateException());

        utr = mock(UnitTypeRepository.class);
        ut.setId(2);
        ut.setName("name");
        ut.setUnit("unit");
        when(utr.findAllById(1)).thenReturn(ut);

        when(mlr.findAllByExerciseSetId(2)).thenReturn(logs);

        mls.setExerciseSetRepository(esr);
        mls.setMeasureLogRepository(mlr);
        mls.setUnitTypeRepository(utr);
    }

    @Test
    public void testAddMeasureLog() {
        try {
            mls.addMeasureLog(ml);
            Assert.fail();
        } catch (IllegalStateException e) {
        }
    }

    @Test
    public void testAddExerciseSet() {
        try {
            mls.addExerciseSet(es);
            Assert.fail();
        } catch (IllegalStateException e) {
        }
    }

    @Test
    public void testFindAllByExerciseSetId() {
        List<MeasureLog> result = mls.findAllByExerciseSetId(2);

        Assert.assertTrue(1 == result.get(0).getUnitTypeId());
        Assert.assertTrue(4 == result.get(0).getExerciseSetId());
    }

}
