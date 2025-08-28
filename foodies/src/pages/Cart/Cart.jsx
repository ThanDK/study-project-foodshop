import React, { useContext } from 'react'
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { Link,useNavigate } from 'react-router-dom';
import { calculatCartTootals } from '../../util/cartUtils';

const Cart = () => {
    const navigate = useNavigate();
    const {foodList, increaseQty, decreaseQty, quantities, removeFromCart} = useContext(StoreContext);
    const cartItems = foodList.filter(food => quantities[food.id]>0);

    // เรียกใช้ utility function จากภายนอกเพื่อคำนวณยอดรวมทั้งหมด
    const {subtotal, shipping, tax, total} = calculatCartTootals(cartItems, quantities);

    return (
    <div className="container py-5">
      <h1 className="mb-5">Your Shopping Cart</h1>
      <div className="row">
        <div className="col-lg-8">
          {
            cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="card mb-4">
                <div className="card-body">
                  {cartItems.map((food) => (
                    <div className="row cart-item mb-3" key={food.id}>
                      <div className="col-md-3">
                        <img src={food.imageUrl || "https://via.placeholder.com/100"} alt={food.name} className="img-fluid rounded" width={100} />
                      </div>
                      <div className="col-md-5">
                        <h5 className="card-title">{food.name}</h5>
                        <p className="text-muted">Category: {food.category}</p>
                      </div>
                      <div className="col-md-2">
                        <div className="input-group">
                          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => decreaseQty(food.id)}>-</button>

                          <input
                            style={{ maxWidth: "100px" }}
                            type="text"
                            className="form-control form-control-sm text-center quantity-input"
                            value={quantities[food.id]}
                            readOnly
                          />

                          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => increaseQty(food.id)}>+</button>
                        </div>
                      </div>

                      <div className="col-md-2 text-end">
                        <p className="fw-bold">฿{(food.price * quantities[food.id]).toFixed(2)}</p>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(food.id)}><i className="bi bi-trash"></i></button>
                      </div>
                      <hr className="mt-3" />
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          <div className="text-start mb-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>฿{subtotal === 0 ? 0.00.toFixed(2) : shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>฿{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>฿{subtotal === 0 ? 0.00.toFixed(2) : total.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary w-100" disabled={cartItems.length === 0} onClick={() => navigate('/order')}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;