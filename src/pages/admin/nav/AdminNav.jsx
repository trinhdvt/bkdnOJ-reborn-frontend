import React from 'react';
import { Link } from 'react-router-dom';
import { VscAccount, VscOrganization, VscListOrdered, VscFileCode, VscServer 
  } from 'react-icons/vsc';
import { GiTrophyCup } from 'react-icons/gi';

import logo from 'assets/images/bkdnoj-favicon-ring.png';
import './AdminNav.scss';

export default class AdminNav extends React.Component {
  render() {
    return (
      <ul className="admin-nav nav navbar-nav sidebar" id="admin-sidebar">
        <li className='nav-header-item'>
          <Link to='/' replace className='nav-link'>Site</Link>
        </li>

        <hr className="sidebar-divider "/>

        <Link to='' className='sidebar-brand brand'>
          <img src={logo} className="img-fluid site-icon" />
          <p className="site-icon-text">Admin</p>
        </Link>

        <hr className="sidebar-divider "/>

        <li className='nav-item'>
          <Link to='user' className='nav-link'>
            <VscAccount className='icon'/>
            Users
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='organization' className='nav-link'>
            <VscOrganization className='icon'/>
            Organizations
          </Link>
        </li>

        <li className='nav-item'>
          <Link to='problem' className='nav-link'>
            <VscListOrdered className='icon'/>
            Problems
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='contest' className='nav-link'>
            <GiTrophyCup className='icon'/>
            Contests
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='submission' className='nav-link'>
            <VscFileCode className='icon'/>
            Submissions
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='judge' className='nav-link'>
            <VscServer className='icon'/>
            Judges
          </Link>
        </li>
      </ul> 
    )
  }
}