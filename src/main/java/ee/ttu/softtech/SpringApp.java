package ee.ttu.softtech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import javax.sql.DataSource;

/**
 * Main class of this application.
 *
 * @author Mikhail Iljin
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan({"ee.ttu.softtech"})
@PropertySource("classpath:application.properties")
public class SpringApp {

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "db")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource dataSource(DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        
        loggingFilter.setIncludeClientInfo(true);
        loggingFilter.setIncludeQueryString(true);
        loggingFilter.setIncludePayload(true);
        
        return loggingFilter;
    }
    
    public static void main(String[] args) { SpringApplication.run(SpringApp.class);
    }

}
