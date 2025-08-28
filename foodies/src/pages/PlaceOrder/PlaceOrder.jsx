import {React, useContext, useState} from 'react';
import { assets } from "../../assets/assets"
import { StoreContext } from '../../context/StoreContext';
import { calculatCartTootals } from '../../util/cartUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  
  const { provinces, foodList, quantities, token } = useContext(StoreContext); 
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: 'ประเทศไทย', 
    province: '',
    zip: '',
  });

  // สร้าง state ไว้คุมสถานะตอนกด submit เพื่อกันการกดซ้ำซ้อนและ disable form
  const [isProcessing, setIsProcessing] = useState(false);

  // สร้าง handler กลางไว้สำหรับอัปเดต state ของ form ทั้งหมด
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}));
  };
  
  // จัดการ logic ทั้งหมดเมื่อ user กด submit form
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    
    // ก่อนส่งข้อมูล ตรวจสอบก่อนว่าตะกร้าไม่ว่าง และ user กรอกข้อมูลครบทุกช่อง
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to place an order.");
      navigate("/cart"); 
      return;
    }

    for (const key in data) {
        if (data[key] === "") {
            toast.error("Please fill in all the delivery information fields.");
            return; 
        }
    }

    setIsProcessing(true); 

    const { total } = calculatCartTootals(cartItems, quantities);

    // เตรียม object ที่จะส่งไปให้ API backend ตาม format ที่ตกลงกันไว้
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.country}, ${data.province}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map(item => ({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name
    })),
      amount: total.toFixed(2),
      orderStatus: "Preparing"
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderData, {headers: {'Authorization': `Bearer ${token}` }});
      
      // ถ้า backend ตอบกลับมาพร้อม approvalUrl ก็ให้ redirect user ไปที่หน้าจ่ายเงินเลย
      if(response.status === 200 && response.data.approvalUrl) {
        toast.success("Order placed successfully! Redirecting to payment...");

        window.location.href = response.data.approvalUrl;
      } else {

        toast.error("An unexpected error occurred.");
        setIsProcessing(false); 
      }
    } catch (error) {
        // จัดการ error ที่อาจจะเกิดขึ้น พร้อมคืนสถานะปุ่มให้กดได้อีกครั้ง
        toast.error("Failed to place order. " + (error.response?.data?.message || error.message));
        setIsProcessing(false); 
    } 

  };

  const cartItems = foodList.filter(food => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculatCartTootals(cartItems, quantities);
  
  return (
    <div>
      <div className="container">
        <main>
          <div className="py-5 text-center">
            <img className="d-block mx-auto" src={assets.logo} alt="" width="78" height="78"/>
          </div>
          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
                <span className="badge bg-primary rounded-pill">
                  {cartItems.length}
                </span> 
              </h4>
              <ul className="list-group mb-3">
                {cartItems.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <img
                          src={item.imageUrl}  
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                        />
                      <h6 className="my-0">{item.name}</h6>
                      <span>
                        Quantity: {quantities[item.id]}
                      </span>
                    </div>
                    <span className="text-body-secondary">
                      ฿{(item.price * quantities[item.id]).toFixed(2)}
                    </span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <div>
                    <span>Shipping</span>
                  </div>
                  <span className="text-body-secondary">
                    ฿{subtotal === 0 ? "0.00" : shipping.toFixed(2)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <div>
                    <span>Tax (10%)</span>
                  </div>
                  <span className="text-body-secondary">
                    ฿{tax.toFixed(2)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (THB)</span>
                  <strong>
                    ฿{total.toFixed(2)}
                  </strong>
                </li>
              </ul>
            </div>

            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" noValidate onSubmit={onSubmitHandler}>
                {/* ใช้ fieldset ครอบ form ทั้งหมดเพื่อ disable input ทุกตัวพร้อมกันตอนกำลังประมวลผล */}
                <fieldset disabled={isProcessing}>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label htmlFor="firstName" className="form-label">First name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="firstName" 
                        placeholder="John" 
                        required 
                        name="firstName" 
                        onChange={onChangeHandler} 
                        value={data.firstName}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="lastName" className="form-label">Last name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="lastName" 
                        placeholder="Doe"  
                        required 
                        name="lastName"
                        onChange={onChangeHandler}
                        value={data.lastName}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">Email</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text">@</span>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          placeholder="you@example.com" 
                          required 
                          name="email"
                          onChange={onChangeHandler}
                          value={data.email}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        id="phone" 
                        placeholder="+66" 
                        required 
                        name="phoneNumber"
                        value={data.phoneNumber}
                        onChange={onChangeHandler}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="address" className="form-label">Address</label>
                        <textarea 
                          className="form-control" 
                          id="address" 
                          placeholder="1234 Main St" 
                          rows="2" 
                          required
                          value={data.address}
                          name="address"
                          onChange={onChangeHandler}
                        />       
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <select 
                        className="form-select" 
                        id="country" 
                        required 
                        name='country' 
                        value={data.country} 
                        onChange={onChangeHandler}
                      >
                        <option value="">Choose...</option>
                        <option value="ประเทศไทย">ประเทศไทย</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="province" className="form-label">Province</label>
                      <select 
                        className="form-select" 
                        id="province" 
                        required
                        name="province"
                        value={data.province}
                        onChange={onChangeHandler}
                      >
                        <option value="">Choose...</option>
                        {provinces.map(province => (
                          <option key={province.id} value={province.name_th}>{province.name_th}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="zip" className="form-label">Zip</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="zip" 
                        placeholder="" 
                        required 
                        name="zip"
                        value={data.zip}
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>
                </fieldset>

                <hr className="my-4" />
                <button 
                  className="w-100 btn btn-primary btn-lg" 
                  type="submit" 
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? "Processing..." : "Continue to checkout"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlaceOrder;