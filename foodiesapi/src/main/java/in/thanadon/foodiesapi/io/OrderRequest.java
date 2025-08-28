package in.thanadon.foodiesapi.io;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderRequest {
    private List<OrderItem> orderedItems;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String orderStatus;
}
