package in.thanadon.foodiesapi.io;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentStatusResponse {
    private String id;
    private String paymentStatus;
}
