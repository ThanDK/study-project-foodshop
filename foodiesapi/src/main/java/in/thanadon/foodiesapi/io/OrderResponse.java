package in.thanadon.foodiesapi.io;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String paypalOrderId;
    private String orderStatus;
    private String approvalUrl;
    private List<OrderItem> orderedItems;
}
