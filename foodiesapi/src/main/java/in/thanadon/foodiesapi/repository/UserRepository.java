package in.thanadon.foodiesapi.repository;

import in.thanadon.foodiesapi.entity.UserEnitity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEnitity, String> {
    Optional<UserEnitity> findByEmail(String Email);
}
