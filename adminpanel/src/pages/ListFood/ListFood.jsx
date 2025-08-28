import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import './ListFood.css';
import { deleteFood, getFoodList } from '../../service/foodservice';



const ListFood = () => {
  const [list, setList] = useState([]);
  
  // สร้างฟังก์ชันสำหรับดึงรายการอาหารทั้งหมดจาก service มาใส่ state
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error('Error while reading the foods.');
    }
  }

  // สร้างฟังก์ชันสำหรับลบอาหาร เมื่อลบสำเร็จจะเรียก fetchList ใหม่เพื่ออัปเดตข้อมูลในตารางทันที
  const removeFood =  async(foodId) => {
    try {
      const deleted = await deleteFood(foodId);
      if(deleted) {
        toast.success('Food removed.');
        await fetchList();
      } else {
        toast.error('Error while removing the foods.');
      }
    } catch (error) {
      toast.error('Super Error while removing the foods.' + error);
    }
  }

  // ใช้ effect นี้เพื่อดึงข้อมูลอาหารมาแสดงครั้งแรกที่ component โหลด
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className='table'>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              list.map((item, index) => {
                return (
                  <tr key = {index}>
                    <td>
                      <img src={item.imageUrl} alt="" height={48} width={48}/>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>฿{item.price}.00</td>
                    <td className='text-danger'>
                      <i className='bi bi-x-circle-fill' onClick={() => removeFood(item.id)} style={{ cursor: 'pointer' }}></i>
                    </td>
                      <td className='text-primary'>
                       <i className="bi bi-pencil-fill" onClick={() => editFood(item.id)} style={{ cursor: 'pointer' }}></i>
                    </td>
                    
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>

    
  )
}

export default ListFood;