import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';

import Select from 'react-select';

//Imports for sql queries
import { customerService } from '../services';

export class CustomerOrderComponent extends Component {
  selectedOption = null;

  render() {
    if (!this.props.options) return null;
    return (
      <Card title="Kunde">
        <div className="row">
          <div className="col-10">
            <Select
              value={this.selectedOption}
              placeholder="Velg kunde..."
              onChange={e => {
                this.selectedOption = e;
                this.props.sendStateToParent(e.value);
              }}
              options={this.props.options}
            />
          </div>
          <div className="col-2">
            <button className="btn btn-info btn-lg" onClick={this.props.makeNewCustomer}>
              &#10010;
            </button>
          </div>
        </div>
      </Card>
    );
  }
}

export class MakeOrderProductTable extends Component {
  product = [];
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Modell</td>
            <td>Dagspris</td>
            <td>Antall(Ledige)</td>
          </tr>
        </thead>
        <tbody>
          {this.props.tableBody.map(model => (
            <tr key={model.model}>
              <td>{model.model}</td>
              <td>{model.day_price}kr</td>
              <td>
                <select
                  id={model.model}
                  value={this.props.products[model.model] ? this.props.products[model.model][0] : 0}
                  onChange={e => {
                    this.product[model.model] = [e.target.value, model.day_price];
                    this.props.sendStateToParent(this.product);
                  }}
                >
                  {this.makeSelect(model.max)}
                </select>
                ({model.max})
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  makeSelect(length) {
    let options = [];
    for (let i = 0; i <= length; i++) {
      options.push(<option key={i}>{i}</option>);
    }
    return options;
  }
}

export class AdditionalDetailsTable extends Component {
  orderInformation = [];
  location = ['Haugastøl', 'Finse'];

  //Variables used to set the minimum date to the current date
  date = new Date();
  day = this.date.getDate().toString().length == 1 ? '0' + this.date.getDate() : this.date.getDate();
  month =
    (this.date.getMonth() + 1).toString().length == 1 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1;
  year = this.date.getFullYear();
  date = this.year + '-' + this.month + '-' + this.day;
  fromDate = '';
  toDate = '';

  render() {
    return (
      <>
        <div className="col-6">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <label>Fra-dato</label>
                </td>
                <td>
                  <input
                    required
                    type="date"
                    min={this.date}
                    onChange={e => {
                      this.orderInformation['fromDate'] = e.target.value;
                      this.fromDate = new Date(this.orderInformation['fromDate']);
                      this.toDate = new Date(this.orderInformation['toDate']);
                      this.orderInformation['nrDays'] = Math.ceil(
                        Math.abs(this.toDate.getTime() - this.fromDate.getTime() + 1) / (1000 * 3600 * 24)
                      );
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Til-dato</label>
                </td>
                <td>
                  <input
                    required
                    type="date"
                    min={this.orderInformation['fromDate']}
                    onChange={e => {
                      this.orderInformation['toDate'] = e.target.value;
                      this.fromDate = new Date(this.orderInformation['fromDate']);
                      this.toDate = new Date(this.orderInformation['toDate']);
                      this.orderInformation['nrDays'] = Math.ceil(
                        Math.abs(this.toDate.getTime() - this.fromDate.getTime() + 1) / (1000 * 3600 * 24)
                      );
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="col-6">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <label>Hentested</label>
                </td>
                <td>
                  <select
                    required
                    value={this.orderInformation['pickupLocation'] || ''}
                    onChange={e => {
                      this.orderInformation['pickupLocation'] = e.target.value;
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  >
                    <option value="" hidden>
                      Velg sted...
                    </option>
                    {this.location.map(location => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Avleveringssted</label>
                </td>
                <td>
                  <select
                    required
                    value={this.orderInformation['dropoffLocation'] || ''}
                    onChange={e => {
                      this.orderInformation['dropoffLocation'] = e.target.value || null;
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  >
                    <option value="" hidden>
                      Velg sted...
                    </option>
                    {this.location.map(location => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export class ProductOrderTable extends Component {
  tableHead = { products: ['Modell', 'Antall', 'Pris'] };

  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {this.tableHead[this.props.tableHead].map(data => (
              <td key={data}>{data}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.tableBody).map((data, index) => (
            <tr key={data}>
              <td>{data}</td>
              <td>{this.props.tableBody[data][0]}</td>
              <td>{this.props.tableBody[data][1] * this.props.tableBody[data][0]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export class AdditionalDetailsConfirmTable extends Component {
  tableHeadAdditional = {
    pickupLocation: 'Hentested',
    dropoffLocation: 'Avleveringssted',
    fromDate: 'Fra-dato',
    toDate: 'Til-dato',
    nrDays: 'Antall dager',
    totalPrice: 'Total pris'
  };

  render() {
    return (
      <Table striped bordered hover>
        <tbody>
          {Object.keys(this.tableHeadAdditional).map(data => (
            <tr key={data}>
              <td>{this.tableHeadAdditional[data]}</td>
              <td>{this.props.tableBody[data]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
