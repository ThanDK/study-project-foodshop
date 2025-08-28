package in.thanadon.foodiesapi.service;

import in.thanadon.foodiesapi.io.CartRequest;
import in.thanadon.foodiesapi.io.CartResponse;

public interface CartService{

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCartForCurrentUser();

    CartResponse removeFromCart(CartRequest cartRequest);

}
