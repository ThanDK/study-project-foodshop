import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category, searchText}) => {

  const { foodList } = useContext(StoreContext);

  // กรอง foodList โดยใช้เงื่อนไข 2 ข้อ: category ที่ได้รับมา (ถ้าเป็น 'All' คือแสดงทั้งหมด) และ searchText ที่ใช้ค้นหาชื่ออาหาร
  const filteredFoods = foodList.filter(food => (
    (category === 'All' || food.category === category) && food.name.toLowerCase().includes(searchText.toLowerCase())
  ));

  return (
    <div className="container">
      {/* ------ ส่วนแสดงผลรายการอาหาร ------ */}
      <div className="row">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food, index) => (
            <FoodItem
              key={index}
              name={food.name}
              description={food.description}
              id={food.id}
              imageUrl={food.imageUrl}
              price={food.price}
            />
          ))
        ) : (
          <div className="text-center mt-4">
            <h4>No food found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;