import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//Bootstrap imports
import { Card } from '../widgets';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

//Imports for sql queries
import { storageService, orderService, customerService } from '../services';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';
import Select from 'react-select';

//using hacky solution hidden on makeorder render when on confirmationpage to not have to rerender and lose states
class MakeOrder extends Component {
  //view variables
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  selectedOption = null;
  options = null;
  modal = false;
  temporaryOptions = [];

  //variables to be used in order
  activeCustomer = null;
  bike = [];
  equipment = [];
  order = [];

  render() {
    if (!this.distinctBikeModels || !this.distinctEquipmentModels)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <div hidden={this.props.hide}>
        <Card>
          <Card title="Kunde">
            <div className="row">
              <div className="col-10">
                <Select
                  value={this.selectedOption}
                  onChange={e => {
                    this.selectedOption = e;
                    this.activeCustomer = e.value;
                  }}
                  options={this.options}
                />
              </div>
              <div className="col-2">
                <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
                  &#10010;
                </button>
              </div>
            </div>
          </Card>
          <Card title="Sykkel og utstyr">
            <div className="row" hidden={this.props.hide}>
              <div className="col-6">
                <Table striped bordered hover>
                  <tbody>
                    {this.distinctBikeModels.map(model => (
                      <tr key={model.model}>
                        {Object.values(model).map((data, index) => (
                          <React.Fragment key={data + model + index + 'fragment'}>
                            <td key={data + model + index}>{data}</td>
                            <td key={data + model + index + 'input'}>
                              <input
                                type="number"
                                defaultValue="0"
                                onChange={e => (this.bike[data] = e.target.value)}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-6">
                <Table striped bordered hover>
                  <tbody>
                    {this.distinctEquipmentModels.map(model => (
                      <tr key={model.model}>
                        {Object.values(model).map((data, index) => (
                          <React.Fragment key={data + model + index + 'fragment'}>
                            <td key={data + index + model}>{data}</td>
                            <td key={data + model + index + 'input'}>
                              <input
                                type="number"
                                defaultValue="0"
                                onChange={e => (this.equipment[data] = e.target.value)}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Card>
          <Card title="Annen informasjon">
            <div className="row" hidden={this.props.hide}>
              <div className="col-8">
                <div>
                  Fra-dato <input type="date" />
                </div>
                <div>
                  Til-dato <input type="date" />
                </div>
                <div>
                  Hentested <input type="text" />
                </div>
                <div>
                  Avleveringssted <input type="text" />
                </div>
              </div>
              <div className="col-4">
                <button
                  onClick={() => {
                    this.order.push(this.bike);
                    this.order.push(this.equipment);
                    this.selectedOption
                      ? this.props.sendStateToParent([this.order, this.selectedOption.value])
                      : alert('fyll ut data');
                  }}
                >
                  videre
                </button>
                {/*send in all the state thats been made on this page here*/}
              </div>
            </div>
          </Card>
        </Card>
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </div>
    );
  }

  mounted() {
    customerService.getCustomerSearch(result => {
      this.temporaryOptions = [];
      result.map(e => {
        this.temporaryOptions.push({ value: e.c_id, label: e.fullname });
      });
      this.options = this.temporaryOptions;
    });
    storageService.getDistinctBikeModel(result => {
      this.distinctBikeModels = result;
    });
    storageService.getDistinctEquipmentModel(result => {
      this.distinctEquipmentModels = result;
    });
  }

  //updates the search list if a customer has been added, aswell as handles the modal toggle
  toggleModal() {
    if (this.modal == true) {
      customerService.getCustomerSearch(result => {
        this.temporaryOptions = [];
        result.map(e => {
          this.temporaryOptions.push({ value: e.c_id, label: e.fullname });
        });
        this.options = this.temporaryOptions;
      });
    }
    this.modal ? (this.modal = false) : (this.modal = true);
  }
}

export class NewOrder extends Component {
  confirmationPage = false;
  orderState = null;

  render() {
    return (
      <>
        <div className="row">
          <div className="col-6">
            <Button
              variant={!this.confirmationPage ? 'secondary' : 'light'}
              style={{ width: '100%' }}
              onClick={() => (this.confirmationPage = false)}
            >
              Lag ordre
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={this.confirmationPage ? 'secondary' : 'light'}
              style={{ width: '100%' }}
              onClick={() => (this.orderState ? (this.confirmationPage = true) : alert('fullfør orderen'))}
            >
              Bekreft ordre
            </Button>
          </div>
        </div>
        <MakeOrder sendStateToParent={this.stateHandler} hide={this.confirmationPage} />
        {this.confirmationPage && <ConfirmOrder recieveStateFromParent={this.orderState} />}
      </>
    );
  }

  stateHandler(state) {
    this.orderState = state;
    this.confirmationPage = this.confirmationPage ? false : true;
  }
}

class ConfirmOrder extends Component {
  customer = this.props.recieveStateFromParent[1];
  orderDetails = this.props.recieveStateFromParent[0];
  bikeDetails = this.orderDetails[0];
  equipmentDetails = this.orderDetails[1];
  customerDetails = null;
  tableHead = ['Kunde id', 'Fornavn', 'Etternavn', 'Telefon', 'Email', 'Adresse'];

  render() {
    //render this page with the recieveStateFromParent prop which contains all info from the previous page
    if (!this.customerDetails) {
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    }
    return (
      <>
        <Card>
          <div className="row">
            <div className="col-6">
              <Card title="Kunde id">
                <HorizontalTableComponent
                  tableBody={this.customerDetails}
                  tableHead={this.tableHead}
                  checkDate={false}
                />
              </Card>
            </div>
            <div className="col-3">
              <Card title="Bikes">
                {Object.keys(this.bikeDetails).map(data => (
                  <div key={data}>
                    {data} -{this.bikeDetails[data]}
                  </div>
                ))}
              </Card>
            </div>
            <div className="col-3">
              <Card title="Equipment">
                {Object.keys(this.equipmentDetails).map(data => (
                  <div key={data}>
                    {data} -{this.equipmentDetails[data]}
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </Card>
      </>
    );
  }

  mounted() {
    customerService.getCustomerDetails(this.customer, result => {
      this.customerDetails = result;
    });
  }
}
