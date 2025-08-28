import React from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState } from 'react';

const Home = () => {
  // จัดการ state 'category' ไว้ที่ component นี้ เพื่อส่ง props ไปควบคุมให้ ExploreMenu และ FoodDisplay ทำงานสัมพันธ์กัน
  const [category, setCategory] = useState('All');
  return (
    <main className='container'>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category} searchText={''}/>
    </main>
  )
}

export default Home;