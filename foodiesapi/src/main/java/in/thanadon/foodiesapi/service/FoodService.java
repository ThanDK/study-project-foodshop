package in.thanadon.foodiesapi.service;

import in.thanadon.foodiesapi.io.FoodRequest;
import in.thanadon.foodiesapi.io.FoodRespond;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodRespond addFood(FoodRequest request, MultipartFile file);

    List<FoodRespond> readFoods();

    FoodRespond readFood (String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);
}
