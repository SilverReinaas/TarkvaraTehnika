package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.UserRepository;
import ee.ttu.softtech.model.AppUser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthServiceImplTest {

    @Mock
    UserRepository db;

    @Before
    public void setUp() {
        AppUser au = new AppUser();
        au.setUsername("test");

        db = mock(UserRepository.class);
        when(db.findByUsername("?")).thenReturn(au);
    }

    @Test
    public void testGetUserByUsername() {
        AppUser au = db.findByUsername("?");
        Assert.assertEquals("test", au.getUsername());
    }
}
