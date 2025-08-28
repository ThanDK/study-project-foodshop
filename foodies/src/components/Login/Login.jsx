import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { login } from '../../service/authService';

const Login = () => {
  const {setToken, loadCartData} = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}));
  }

  // สร้าง handler จัดการการ login เมื่อ user submit form
  // flow การทำงานที่ตั้งใจไว้: เรียก service -> ถ้าสำเร็จ ให้ set token ใน context, บันทึกลง localStorage, 
  // โหลดข้อมูลตะกร้าที่ผูกกับ user, แล้วค่อย redirect ไปหน้าแรก
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await login(data);
      if(response.status === 200) {
        setToken(response.data.token); 
        localStorage.setItem('token', response.data.token);
        await loadCartData(response.data.token);
        navigate('/');
      } else {
        toast.error('Unable to login. please try again.');
      }
    } catch (error) {
      console.log('Unable to login', error);
      toast.error('Unable to login. please try again.');
    }
  }
  return (
      <div className="login-container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                
                <form onSubmit={onSubmitHandler}>
                  <div className="form-floating mb-3">
                    <input 
                      type="email" 
                      className="form-control" 
                      id="floatingInput" 
                      placeholder="name@example.com" 
                      name='email'
                      onChange={onChangeHandler}
                      value={data.email}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="floatingPassword" 
                      placeholder="Password" 
                      name='password'
                      onChange={onChangeHandler}
                      value={data.password}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">
                      Sign in
                    </button>
                  </div>
                  <div className="d-grid mt-2">
                    <button className="btn btn-outline-danger btn-reset text-uppercase" type="reset">
                      Reset
                    </button>
                  </div>
                  <div className="mt-4">
                    Don't have an account? <Link to="/register">Sign up</Link>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Login;