import React from 'react';

const Menubar = ({toggleSidebar}) => {
  return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
            <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>Show / Hide</button>

        </div>
    </nav>
  )
}

export default Menubar;