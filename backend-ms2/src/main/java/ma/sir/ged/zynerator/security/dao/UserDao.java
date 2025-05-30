package ma.sir.ged.zynerator.security.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ma.sir.ged.zynerator.security.bean.User;

import javax.transaction.Transactional;

@Repository
public interface UserDao  extends JpaRepository<User, Long>{
    User findByUsername(String username);
    int deleteByUsername(String username);
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.HeavyUser = false")
    void resetAllHeavyUsers();

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.HeavyUser = true WHERE u.id = :userId")
    void setUserAsHeavyUser(@Param("userId") Long userId);
}
