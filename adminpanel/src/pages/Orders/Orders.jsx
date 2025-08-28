import React, { useEffect, useState } from 'react';
import axios from "axios";
import { assets } from '../../assets/assets';

import './Orders.css'; 

const Orders = () => {
  const [data, setData] = useState([]);

  // สร้างฟังก์ชันสำหรับดึง order ทั้งหมดมาแสดงในหน้า admin
  const fetchOrders = async () => { 
    try {
      const response = await axios.get("http://localhost:8080/api/orders/all");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  // สร้างฟังก์ชันสำหรับอัปเดตสถานะของ order
  // ตั้งใจให้อัปเดต UI ใน state ทันที (Optimistic Update) เพื่อให้ admin เห็นผลลัพธ์ก่อน
  // จากนั้นค่อยยิง request ไปอัปเดตข้อมูลจริงที่ server
  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    
    const updatedData = data.map((order) => 
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    setData(updatedData);

    try {
      await axios.patch(`http://localhost:8080/api/orders/status/${orderId}?status=${newStatus}`);
    } catch (error) {
      console.error("Failed to update status on server:", error);
    }
  };

  // ใช้ effect นี้เพื่อดึงข้อมูล order ทั้งหมดมาแสดงตอน component โหลดครั้งแรก
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table-responsive order-list-table">
            <tbody>
              {data.map((order, index) => (
                <tr key={index}>
                  <td className="order-icon-cell">
                    <img src={assets.parcel} alt="" height={48} width={48} />
                  </td>

                  <td className="order-items-cell">
                    <div>
                      {order.orderedItems.map((item, index) => {
                        // ใส่ logic เช็ค index เพื่อไม่ให้แสดง comma หลังรายการสุดท้าย
                        if (index === order.orderedItems.length - 1) {
                          return `${item.name} x ${item.quantity}`;
                        } else {
                          return `${item.name} x ${item.quantity}, `;
                        }
                      })}
                    </div>
                    <div>{order.userAddress}</div>
                  </td>

                  <td className="order-data-cell">฿{order.amount.toFixed(2)}</td>
                  <td className="order-data-cell">Items: {order.orderedItems.length}</td>
                  <td className="order-data-cell">
                    <span className='fw-bold text-capitalize'>● {order.orderStatus}</span>
                  </td>

                  <td className="order-action-cell">
                    <select
                      className="order-status-select"
                      onChange={(event) => updateStatus(event, order.id)}
                      value={order.orderStatus}
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;