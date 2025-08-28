import React, { useRef } from 'react'; 
import { categories } from '../../assets/assets';
import './ExploreMenu.css';

const ExploreMenu = ({category, setCategory}) => {
  
  // ------ Refs ------
  // สร้าง ref เพื่อเข้าถึง DOM element ของ list รายการอาหารโดยตรง สำหรับควบคุมการ scroll
  const menuRef = useRef(null);

  // ------ Scroll Functions ------
  // ฟังก์ชันสำหรับจัดการการเลื่อนเมนูซ้าย-ขวาผ่านปุ่มไอคอน
  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: -200, behavior: 'smooth' }); 
    }
  };

  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: 200, behavior: 'smooth' }); 
    }
  };

  return (
    <div className="explore-menu position-relative">
      {/* ------ ส่วนหัวและปุ่มควบคุม Scroll ------ */}
      <h1 className="d-flex align-items-center justify-content-between">
        Explore Our Menu
        <div className="d-flex">
          <i className="bi bi-arrow-left-circle scroll-icon" onClick={scrollLeft} ></i>
          <i className="bi bi-arrow-right-circle scroll-icon" onClick={scrollRight}></i>
        </div>
      </h1>
      <p>Explore curated lists of dishes from top categories</p>

      {/* ------ ส่วนรายการเมนูที่ scroll ได้ ------ */}
      <div className="d-flex justify-content-between gap-4 overflow-auto explore-menu-list" ref={menuRef}>
        {categories.map((item, index) => (
          // ตั้งค่า onClick ให้สลับ category: ถ้าคลิกซ้ำอันเดิมจะกลับไปเป็น 'All', ถ้าคลิกอันใหม่ก็จะเปลี่ยนไปตามนั้น
          <div key={index} className="text-center explore-menu-list-item" onClick={() => setCategory(prev => prev === item.category ? 'All': item.category)}>
            <img src={item.icon} alt={item.category} className={item.category === category ? 'rounded-circle active' : 'rounded-circle'} height={128} width={128} />
            <p className="mt-2 fw-bold">{item.category}</p>
          </div>
        ))}
      </div>
      <hr/>
    </div>
  );
};

export default ExploreMenu;