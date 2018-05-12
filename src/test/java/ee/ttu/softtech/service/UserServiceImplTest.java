package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.UserRepository;
import ee.ttu.softtech.model.AppUser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserServiceImplTest {

    private UserServiceImpl us = new UserServiceImpl();
    private AppUser au = new AppUser();

    @Mock
    private UserRepository ur;

    @Before
    public void setUp() {
        au.setCode("123");

        ur = mock(UserRepository.class);
        when(ur.findOne(2)).thenReturn(au);
        when(ur.save(au)).thenThrow(new IllegalStateException());
        us.setDao(ur);
    }

    @Test
    public void testGet() {
        AppUser au = us.get(2);
        Assert.assertEquals("123", au.getCode());
    }

    @Test
    public void testSave() {
        try {
            us.save(au);
            Assert.fail();
        } catch (IllegalStateException e) {
        }
    }

}
