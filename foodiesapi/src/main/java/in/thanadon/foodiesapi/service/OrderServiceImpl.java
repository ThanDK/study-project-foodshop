package in.thanadon.foodiesapi.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import in.thanadon.foodiesapi.entity.OrderEntity;
import in.thanadon.foodiesapi.io.OrderPaymentStatusResponse;
import in.thanadon.foodiesapi.io.OrderRequest;
import in.thanadon.foodiesapi.io.OrderResponse;
import in.thanadon.foodiesapi.io.RetryPaymentResponse;
import in.thanadon.foodiesapi.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final APIContext apiContext;
    private final UserService userService;


    private static final String PAYMENT_CURRENCY = "THB";
    private static final String PAYMENT_METHOD = "paypal";
    private static final String PAYMENT_INTENT = "sale";

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request, String cancelUrl, String successUrl) {
        OrderEntity newOrder = convertToEntity(request);
        newOrder.setUserId(userService.findByUserId());
        newOrder.setPaymentStatus("PENDING");

        newOrder = orderRepository.save(newOrder);
        Payment createdPayment;
        try {
            String description = "FoodiesAPI Order: " + newOrder.getId();
            createdPayment = this.createPayPalPayment(newOrder, description, cancelUrl, successUrl);

        } catch (PayPalRESTException e) {
            newOrder.setPaymentStatus("FAILED");
            orderRepository.save(newOrder);
            throw new RuntimeException("Failed to create PayPal payment: " + e.getMessage(), e);
        }
        newOrder.setPaypalOrderId(createdPayment.getId());
        orderRepository.save(newOrder);
        OrderResponse response = convertToResponse(newOrder);
        response.setApprovalUrl(extractApprovalUrl(createdPayment));
        return response;
    }

    @Override
    public RetryPaymentResponse retryOrderPayment(String orderId, String cancelUrl, String successUrl) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order with ID " + orderId + " not found."));

        if ("COMPLETED".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new IllegalStateException("This order has already been paid for.");
        }

        Payment createdPayment;
        try {
            String description = "Retry for FoodiesAPI Order: " + order.getId();
            createdPayment = this.createPayPalPayment(order, description, cancelUrl, successUrl);

        } catch (PayPalRESTException e) {
            order.setPaymentStatus("FAILED");
            orderRepository.save(order);
            throw new RuntimeException("Failed to create new PayPal payment for retry: " + e.getMessage(), e);
        }
        order.setPaypalOrderId(createdPayment.getId());
        order.setPaymentStatus("PENDING");
        orderRepository.save(order);
        return new RetryPaymentResponse(extractApprovalUrl(createdPayment));
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        String currentUserId = userService.findByUserId();
        OrderEntity order = orderRepository.findByIdAndUserId(orderId, currentUserId)
                .orElseThrow(() -> new RuntimeException("Order not found or you do not have permission to delete it."));
        orderRepository.delete(order);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUser() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order with ID " + orderId + " not found."));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    @Override
    public OrderPaymentStatusResponse getOrderPaymentStatusForCurrentUser(String orderId){
        String loggedInUserId = userService.findByUserId();

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order with ID " + orderId + " not found."));

        if (!order.getUserId().equals(loggedInUserId)) {
            try {
                throw new AccessDeniedException("You do not have permission to view the status of this order.");
            } catch (AccessDeniedException e) {
                throw new RuntimeException(e);
            }
        }

        return new OrderPaymentStatusResponse(order.getId(), order.getPaymentStatus());
    }

    @Override
    @Transactional
    public void executeAndFinalizeOrder(String orderId, String paymentId, String payerId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("CRITICAL ERROR: Order " + orderId + " not found in database."));
        if ("COMPLETED".equalsIgnoreCase(order.getPaymentStatus())) {
            System.out.println("Idempotency check: Order " + orderId + " is already completed. Skipping execution.");
            return;
        }

        try {
            Payment payment = new Payment();
            payment.setId(paymentId);
            PaymentExecution paymentExecute = new PaymentExecution();
            paymentExecute.setPayerId(payerId);
            Payment executedPayment = payment.execute(apiContext, paymentExecute);

            if (!"approved".equalsIgnoreCase(executedPayment.getState())) {
                throw new RuntimeException("PayPal payment was not approved. Status: " + executedPayment.getState());
            }

            order.setPaymentStatus("COMPLETED");
            orderRepository.save(order);

        } catch (PayPalRESTException e) {
            order.setPaymentStatus("FAILED");
            orderRepository.save(order);
            throw new RuntimeException("Failed to execute PayPal payment: " + e.getMessage(), e);
        }
    }

    @Override
    public void cancelOrderPayment(String orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));

        if ("PENDING".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("CANCELLED");
            orderRepository.save(order);
        }
    }

    private Payment createPayPalPayment(OrderEntity order, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(PAYMENT_CURRENCY);
        amount.setTotal(String.format("%.2f", order.getAmount()));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(PAYMENT_METHOD);



        Payment payment = new Payment();
        payment.setIntent(PAYMENT_INTENT);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl + "?orderId=" + order.getId());
        redirectUrls.setReturnUrl(successUrl + "?orderId=" + order.getId());
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    private String extractApprovalUrl(Payment payment) {
        return payment.getLinks().stream()
                .filter(link -> "approval_url".equalsIgnoreCase(link.getRel()))
                .map(Links::getHref)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CRITICAL: PayPal approval URL not found in the response."));
    }

    private OrderResponse convertToResponse(OrderEntity order) {
        return OrderResponse.builder()
                .id(order.getId())
                .amount(order.getAmount())
                .userAddress(order.getUserAddress())
                .userId(order.getUserId())
                .paypalOrderId(order.getPaypalOrderId())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .orderedItems(order.getOrderItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }
}