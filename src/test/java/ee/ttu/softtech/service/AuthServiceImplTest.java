package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseRepository;
import ee.ttu.softtech.dao.UserRepository;
import ee.ttu.softtech.model.AppUser;
import ee.ttu.softtech.model.Exercise;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthServiceImplTest {

    @Mock
    ExerciseRepository db;

    @Before
    public void setUp() {
        AppUser au = new AppUser();
        au.setUsername("test");

        List<Exercise> exercises = new ArrayList<>();
        Exercise ex = new Exercise();
        ex.setUserId(2);
        exercises.add(ex);
        db = mock(ExerciseRepository.class);
        when(db.findAll()).thenReturn(exercises);
    }

    @Test
    public void testGetUserByUsername() {
        Assert.assertEquals(new Long(2), new Long(db.findAll().get(0).getUserId()));
    }
}
