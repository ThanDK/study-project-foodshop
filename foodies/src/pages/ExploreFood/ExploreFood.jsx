import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const ExploreFood = () => {

    // ใช้ state สองตัวนี้เพื่อควบคุมการกรองข้อมูลที่จะส่งให้ FoodDisplay
    const [category, setCategory] = useState('All');
    const [searchText, setSearchText] = useState('')
  return (
    <>
      <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">

          {/* ดัก event submit ของ form ไว้เพื่อไม่ให้หน้าเว็บโหลดใหม่ */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group mb-3">
              <select className='form-select mt-2' style={{ maxWidth: '150px' }} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">Show All</option>
                <option value="Biryani">Biryani</option>
                <option value="Cake">Cake</option>
                <option value="Burger">Burger</option>
                <option value="Pizza">Pizza</option>
                <option value="Rolls">Rolls</option>
                <option value="Salad">Salad</option>
                <option value="Ice Cream">Ice Cream</option>

              </select>
              <input type='text' className='form-control mt-2' placeholder='Search your favorite dish...' 
              onChange={(e) => setSearchText(e.target.value)} value={searchText}/>
              <button className='btn btn-primary mt-2' type='submit'>
                <i className='bi bi-search'></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <FoodDisplay category={category} searchText={searchText}/>
    </>
     
  )
}

export default ExploreFood;