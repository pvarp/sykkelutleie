import * as React from 'react';
import { Component } from 'react-simplified';
import { Route, Switch, Redirect } from 'react-router-dom';

//Import of all components "login, customer, employee etc."
import { Login } from './login.js';
import { Menu, SideNav } from './navbars.js';
import { Home, ReparationDetails } from './home.js';
import { Customers, CustomerDetail, CustomerAdd } from './customers.js';
import { Employees, EmployeeDetail } from './employees.js';
import { StorageStatus, StorageDetails } from './storage.js';
import { Orders, OrderDetail } from './orders.js';
import { NewOrder } from './neworder.js';

class NoMatch extends Component {
  render() {
    console.log('404 no path, redirecting to home');
    return <Redirect to="/home" />;
  }
}

export class Routes extends Component {
  render() {
    return (
      <div className="container-Fluid" style={{ overflow: 'hidden', height: '100%', position: 'fixed' }}>
        <div className="row">
          <div className="col-12">
            <Menu />
          </div>
        </div>
        <div className="row" style={{ height: '100%' }}>
          <div className="col-2" style={{ margin: 0, padding: 0 }}>
            <SideNav />
          </div>
          <div
            className="col-10"
            style={{
              margin: 0,
              overflowY: 'scroll',
              padding: '15px',
              borderTop: '1px solid #d3d3d3',
              paddingBottom: '90px'
            }}
          >
            <Switch>
              <Route exact path="/home" component={Home} />
              <Route exact path="/reparations/:id" component={ReparationDetails} />
              <Route exact path="/customers" component={Customers} />
              <Route exact path="/customers/:id" component={CustomerDetail} />
              <Route exact path="/employees" component={Employees} />
              <Route exact path="/employees/:id" component={EmployeeDetail} />
              <Route exact path="/storagestatus" component={StorageStatus} />
              <Route exact path="/storagestatus/:id" component={StorageDetails} />
              <Route exact path="/orders" component={Orders} />
              <Route exact path="/orders/:id" component={OrderDetail} />
              <Route exact path="/neworder" component={NewOrder} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
