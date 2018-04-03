package ee.ttu.softtech.util;

import org.junit.Assert;
import org.junit.Test;

public class UtilTest {

    @Test
    public void testHash() {
        Assert.assertEquals("900150983cd24fb0d6963f7d28e17f72", Util.hash("abc"));
    }

}
