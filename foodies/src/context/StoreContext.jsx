import { createContext, useEffect, useState } from "react";
import { fetchFoodList, fetchThaiProvinces } from "../service/foodService";
import { addToCart, getCartData, removeQtyFromCart } from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [foodList, setFoodList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [token, setToken] = useState("");

  
    // ตั้งใจให้อัปเดต UI ก่อน (Optimistic Update) เพื่อให้ user รู้สึกว่าแอปตอบสนองเร็ว
    // จากนั้นค่อยยิง request ไปที่ backend เพื่อบันทึกข้อมูลจริง
    const increaseQty = async (foodId) => {
        setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
        if (token) {
            await addToCart(foodId, token);
        }
    };

    // สำหรับการลดจำนวน จะยิง request ไปที่ backend ก่อนแล้วค่อยอัปเดต state
    // ถ้าจำนวนลดลงจนเป็น 0 จะลบ key ของ foodId นั้นออกจาก object ไปเลย
    const decreaseQty = async (foodId) => {
        if (token) {
            await removeQtyFromCart(foodId, token);
        }
        setQuantities((prev) => {
            const newQuantities = { ...prev };
            if (newQuantities[foodId] > 1) {
                newQuantities[foodId] -= 1;
            } else {
                delete newQuantities[foodId];
            }
            return newQuantities;
        });
    };

    // สร้างฟังก์ชันนี้ไว้สำหรับลบสินค้าทั้งรายการออกจากตะกร้าโดยเฉพาะ (เช่น จากปุ่มถังขยะ)
    const removeItemFromCart = async (foodId) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = { ...prevQuantities };
            delete updatedQuantities[foodId];
            return updatedQuantities;
        });
    };

    // สร้างเป็นฟังก์ชันแยกไว้ เพื่อให้เรียกใช้ซ้ำได้ง่าย ตอน login หรือตอน refresh หน้า
    const loadCartData = async (token) => {
        const items = await getCartData(token);
        setQuantities(items || {});
    }        
    
    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty, 
        quantities,
        removeItemFromCart,
        provinces,
        token,
        setToken,
        setQuantities,
        loadCartData
    };

    // ใช้ effect นี้ตอนที่แอปโหลดครั้งแรก เพื่อเตรียมข้อมูลที่จำเป็น
    // 1. ดึงรายการอาหารทั้งหมด
    // 2. เช็ค localStorage ว่ามี token ของ user ที่เคย login ค้างไว้ไหม
    // 3. ถ้ามี ก็จะ set token ใน state และดึงข้อมูลตะกร้าของ user คนนั้นมาด้วย
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchFoodList();
                setFoodList(data || []); 
                if (localStorage.getItem('token')) {
                    const currentToken = localStorage.getItem("token");
                    setToken(currentToken);
                    await loadCartData(currentToken);
                }
            } catch (error) {
                console.error("Failed to fetch food list:", error);
                setFoodList([]);
            }
        }
        loadData();
    }, []);

    // ดึงรายชื่อจังหวัดของไทยมาเตรียมไว้ เพื่อใช้ในฟอร์มที่อยู่ตอน checkout
    useEffect(() => {
        fetchThaiProvinces()
            .then(data => {
                setProvinces(data || []); 
            })
            .catch(error => {
                console.error("Failed to fetch Thai provinces:", error);
                setProvinces([]);
            });
    }, []);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};