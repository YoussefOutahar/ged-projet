package ma.sir.ged.zynerator.security.config;


import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.zynerator.security.common.AuthoritiesConstants;
import ma.sir.ged.zynerator.security.dao.ConnexionDao;
import ma.sir.ged.zynerator.security.service.facade.ConnexionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import ma.sir.ged.zynerator.security.jwt.JWTAuthenticationFilter;
import ma.sir.ged.zynerator.security.jwt.JWTAuthorizationFiler;
import  ma.sir.ged.zynerator.security.service.facade.UserService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
prePostEnabled = true,
securedEnabled = true,
jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private ConnexionDao connexionDao;

    @Autowired
    private LicenceValidator licenceValidator;

    @Autowired
    private ConnexionService connexionService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.authorizeRequests().antMatchers("/login").permitAll();
        http.authorizeRequests().antMatchers("/api/face-authentication/identify-face").permitAll();
        http.authorizeRequests().antMatchers("/actuator/health").permitAll();
        http.authorizeRequests().antMatchers("/actuator/info").permitAll();
        http.authorizeRequests().antMatchers("/api/open/translation/**").permitAll();
        http.authorizeRequests().antMatchers("/api/signature/validate-signed-document-by-code/*").permitAll();

        http.authorizeRequests().antMatchers("/api/admin/login").permitAll();
        http.authorizeRequests().antMatchers("/api/collaborateur/login").permitAll();
        http.authorizeRequests().antMatchers("/api/admin/").hasAnyAuthority(AuthoritiesConstants.ADMIN);
        http.authorizeRequests().antMatchers("/api/collaborateur/").hasAnyAuthority(AuthoritiesConstants.COLLABORATEUR);


        http.addFilter(new JWTAuthenticationFilter(authenticationManager(), connexionDao,licenceValidator,connexionService));
        http.addFilterBefore(new JWTAuthorizationFiler(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public PasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }

}
