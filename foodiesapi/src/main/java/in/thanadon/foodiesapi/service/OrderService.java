package in.thanadon.foodiesapi.service;

import in.thanadon.foodiesapi.io.OrderPaymentStatusResponse;
import in.thanadon.foodiesapi.io.OrderRequest;
import in.thanadon.foodiesapi.io.OrderResponse;
import in.thanadon.foodiesapi.io.RetryPaymentResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest request, String cancelUrl, String successUrl);

    void executeAndFinalizeOrder(String orderId, String paymentId, String payerId);

    void cancelOrderPayment(String orderId);

    RetryPaymentResponse retryOrderPayment(String orderId, String cancelUrl, String successUrl);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUser();

    void updateOrderStatus(String orderId, String status);

    OrderPaymentStatusResponse getOrderPaymentStatusForCurrentUser(String orderId);

}

