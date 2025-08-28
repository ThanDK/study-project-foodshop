package in.thanadon.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodRespond {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private String category;
}
