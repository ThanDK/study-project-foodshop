import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFoodDetails } from '../../service/foodService';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const FoodDetails = () => {
    const {id} = useParams();
    const [data, setData] = useState({});
    const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);
    const navigate = useNavigate();

    // ใช้ effect นี้เพื่อดึงข้อมูลอาหารตาม id จาก URL เมื่อ component ถูก mount หรือ id มีการเปลี่ยนแปลง
    // มีการดักจับ error และแสดง toast ด้วย
    useEffect(() => {
        const loadFoodDetails = async () => {
            if (id) { 
                try {
                    const foodData = await fetchFoodDetails(id);
                    setData(foodData); 
                } catch (error) {
                    console.error("Error fetching food details:", error);
                    toast.error('Error displaying the food details.');
                }
            }
        };
        loadFoodDetails();}, [id]); 
    
    // ฟังก์ชันสำหรับเพิ่มของลงตะกร้า แล้วพาไปหน้าตะกร้าเลย
    const addToCart = () => {
        increaseQty(data.id);
        navigate("/cart");
    } 

    const currentQuantity = quantities && quantities[id] ? quantities[id] : 0;

    return (
        <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">

                    <div className="col-md-6">
                        <img
                            className="card-img-top mb-5 mb-md-0"
                            src={data.imageUrl || 'https://dummyimage.com/600x700/dee2e6/6c757d.jpg'}
                            alt={data.name || 'Food item image'}
                        />
                    </div>

                    <div className="col-md-6">
                        <div className="fs-5">Category: <span className='badge text-bg-warning'>{data.category}</span></div>
                        <h1 className="display-5 fw-bolder">{data.name}</h1>
                        <div className="fs-5 mb-2">
                            <span>฿{data.price ? Number(data.price).toFixed(2) : 'N/A'}</span>
                        </div>
                        <p className="lead">{data.description}</p>

                        <div className="d-flex align-items-center">
                                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={addToCart}>
                                    <i className="bi-cart-fill me-1"></i>
                                    Add to cart
                                </button>
  
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FoodDetails;