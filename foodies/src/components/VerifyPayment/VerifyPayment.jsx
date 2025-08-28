import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyPayment.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadCartData, token } = useContext(StoreContext);

  // ใช้ state object นี้เพื่อจัดการสถานะของหน้าทั้งหมด ตั้งแต่ loading, success, cancelled, ไปจนถึง failed
  const [status, setStatus] = useState({
    finalState: 'loading',
    orderId: null,
    message: "Verifying Payment...",
  });

  // ใช้ effect นี้เพื่อเริ่มกระบวนการตรวจสอบการชำระเงินทันทีที่ component โหลด โดยดึง orderId จาก URL
  // ถ้าไม่เจอ orderId จะ redirect กลับไปหน้าแรก
  useEffect(() => {
    const orderIdFromUrl = searchParams.get("orderId");
    if (orderIdFromUrl) {
      verifyPaymentStatus(orderIdFromUrl);
    } else {
      console.log("No Order ID found. Redirecting to home.");
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  // function หลักสำหรับส่ง request ไปตรวจสอบสถานะการชำระเงินกับ backend
  const verifyPaymentStatus = async (orderId) => {
    try {
      const url = `http://localhost:8080/api/orders/payment/status/${orderId}`;
      const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const paymentStatus = response.data.paymentStatus;

      if (paymentStatus === "COMPLETED") {
        // เมื่อการชำระเงินเสร็จสมบูรณ์ (COMPLETED) ต้องยิง API ไปลบข้อมูลตะกร้าสินค้าของ user ที่ server ด้วย
        // แล้วค่อยโหลดข้อมูลตะกร้าใหม่เพื่อให้ UI อัปเดตถูกต้อง
        const urlDel = `http://localhost:8080/api/cart`;
        const DelResponse = await axios.delete(urlDel, { headers: { 'Authorization': `Bearer ${token}` } });
        
        await loadCartData(token);      
        setStatus({ finalState: 'success', orderId: orderId, message: "Payment Successful!" });
        await loadCartData(token);
      } else if (paymentStatus === "CANCELLED") {
        setStatus({ finalState: 'cancelled', orderId: orderId, message: "Payment Cancelled" });
      } else {
        // สถานะอื่นๆ นอกเหนือจากนี้จะถูกนับเป็น failed ทั้งหมด
        setStatus({ finalState: 'failed', orderId: orderId, message: "Your payment could not be completed." });
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
      // หากเกิด error จาก API ก็จะนับเป็น failed เช่นกัน
      setStatus({ finalState: 'failed', orderId: orderId, message: "An error occurred while verifying your payment." });
    }
  };


  // จัดการ state ขณะ loading แยกต่างหาก
  if (status.finalState === 'loading') {
    return (
      <div className="verify-page">
        <div className="verify-box">
          <div className="spinner"></div>
          <p className="loading-text">{status.message}</p>
        </div>
      </div>
    );
  }

  // ใช้ switch case เพื่อเตรียมตัวแปรสำหรับ UI (เช่น title, icon) ตามสถานะสุดท้ายของการตรวจสอบ
  // เพื่อให้ส่วน JSX ด้านล่างสะอาดและอ่านง่ายขึ้น
  let title, icon, titleClass, bodyContent;

  switch (status.finalState) {
    case 'success':
      title = "Payment Successful!";
      icon = assets.parcel_icon;
      titleClass = "success-text";
      bodyContent = (
        <>
          <p>Your order has been confirmed. Thank you for your purchase.</p>
          <div className="order-details">
            <p>Your Order ID</p>
            <span>{status.orderId}</span>
          </div>
        </>
      );
      break;
    case 'cancelled':
      title = "Payment Cancelled";
      icon = assets.cancel_icon;
      titleClass = "failure-text";
      bodyContent = <p>Your payment was cancelled as requested. You have not been charged.</p>;
      break;
    case 'failed':
    default:
      title = "Payment Failed";
      icon = assets.cross_icon;
      titleClass = "failure-text";
      bodyContent = <p>{status.message}</p>;
      break;
  }

  const primaryButtonText = status.finalState === 'success' ? "Track My Orders" : "View My Orders";
  const secondaryButtonText = status.finalState === 'success' ? "Continue Shopping" : "Back to Home";

  return (
    <div className="verify-page">
      <div className="verify-box">
        <div className="verify-header">
          <img src={icon} alt={title} className="verify-icon" />
          <h2 className={titleClass}>{title}</h2>
        </div>

        <div className="verify-body">
          {bodyContent}
        </div>

        <div className="verify-footer">
          <button onClick={() => navigate('/myorders', { replace: true })} className="verify-btn primary">
            {primaryButtonText}
          </button>
          <button onClick={() => navigate('/', { replace: true })} className="verify-btn secondary">
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;