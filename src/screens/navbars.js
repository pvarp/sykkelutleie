import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

//Bootstrap imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//import the logout method from login.js
import { loginHandler } from './login.js';

export class Menu extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="clickable" onClick={() => history.push('/home')}>
          Sykkelutleie AS
        </Navbar.Brand>
        <Nav className="mr-auto navbar">
          <NavLink className="navbarlink" to="/orders">
            &#57967; Ordre
          </NavLink>
          <NavLink className="navbarlink" to="/storagestatus">
            &#57709; Lager
          </NavLink>
          <NavLink className="navbarlink" to="/customers">
            &#57637; Kunde
          </NavLink>
          {(sessionStorage.getItem('role') == 'Admin' || sessionStorage.getItem('role') == 'Sekretær') && (
            <NavLink className="navbarlink" to="/employees">
              &#57654; Ansatte
            </NavLink>
          )}
        </Nav>
        <DropdownButton
          id="dropdown-item-button"
          alignRight
          title={sessionStorage.getItem('userName')}
          variant="outline-secondary"
        >
          <Dropdown.Item onClick={() => history.push('/employees/' + sessionStorage.getItem('userName'))}>
            Min side
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              loginHandler.logout();
            }}
          >
            Logg ut
          </Dropdown.Item>
        </DropdownButton>
      </Navbar>
    );
  }
}

export class SideNav extends Component {
  time = 0;
  hour = 0;
  minute = 0;
  second = 0;
  timer = '00:00:00';
  timeInterval = null;
  render() {
    return (
      <div className="sidenav">
        <NavLink className="sidebarlink" to="/neworder">
          &#57642; Ny ordre
        </NavLink>
        <NavLink className="sidebarlink" to="/reparations">
          &#57694; Reparasjoner
        </NavLink>
        <NavLink className="sidebarlink" to="/transportation">
          &#57660; Transportering
        </NavLink>
        {(sessionStorage.getItem('role') == 'Admin' || sessionStorage.getItem('role') == 'Sekretær') && (
          <NavLink className="sidebarlink" to="/location">
            &#57665; Lokasjoner
          </NavLink>
        )}
        <div className="timer">Tid innlogget: {this.timer}</div>
      </div>
    );
  }

  mounted() {
    this.timeInterval = setInterval(() => {
      this.time++;
      this.hour = Math.floor(this.time / 3600);
      this.minute = Math.floor(this.time / 60) - this.hour * 60;
      this.second = this.time - this.minute * 60 - this.hour * 3600;
      this.timer =
        (this.hour.toString().length == 1 ? '0' + this.hour : this.hour) +
        ':' +
        (this.minute.toString().length == 1 ? '0' + this.minute : this.minute) +
        ':' +
        (this.second.toString().length == 1 ? '0' + this.second : this.second);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }
}
