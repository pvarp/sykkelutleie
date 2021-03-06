import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//node modules
import ReactLoading from 'react-loading';
import arraySort from 'array-sort';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { reparationService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Reparations extends Component {
  reparations = null;
  ready = false;
  sortedBy = 'rep_id';

  render() {
    if (!this.ready)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Oversikt over reparasjoner">
          <VerticalTableComponent
            tableBody={this.reparations}
            tableHead={'reparation'}
            checkDate={true}
            deleteButton={false}
            whereTo={this.props.match.path}
            sort={this.sort}
          />
        </Card>
      </>
    );
  }
  mounted() {
    reparationService.getReparations(reparations => {
      this.reparations = reparations;
      this.reparations.map(rep => {
        rep.r_fdate =
          rep.r_fdate.getFullYear() +
          '-' +
          ((rep.r_fdate.getMonth() + 1).toString().length == 1
            ? '0' + (rep.r_fdate.getMonth() + 1)
            : rep.r_fdate.getMonth + 1) +
          '-' +
          (rep.r_fdate.getDate().toString().length == 1 ? '0' + rep.r_fdate.getDate() : rep.r_fdate.getDate());
        rep.r_tdate =
          rep.r_tdate.getFullYear() +
          '-' +
          ((rep.r_tdate.getMonth() + 1).toString().length == 1
            ? '0' + (rep.r_tdate.getMonth() + 1)
            : rep.r_tdate.getMonth + 1) +
          '-' +
          (rep.r_tdate.getDate().toString().length == 1 ? '0' + rep.r_tdate.getDate() : rep.r_tdate.getDate());
      });
      this.ready = true;
    });
  }

  sort(sort) {
    if (sort == this.sortedBy) {
      arraySort(this.reparations, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.reparations, sort);
      this.sortedBy = sort;
    }
  }
}

export class ReparationDetails extends Component {
  reparation = null;
  editable = false;

  render() {
    if (!this.reparation || typeof this.reparation.r_fdate == 'object' || typeof this.reparation.r_tdate == 'object')
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <Card title="Reparasjonsdetaljer">
        <HorizontalTableComponent
          tableBody={this.reparation}
          tableHead={'reparationDetails'}
          checkDate={true}
          editable={this.editable}
          sendStateToParent={this.updateReparation}
        />
        <button onClick={() => (this.editable ? (this.editable = false) : (this.editable = true))}>
          &#57604; Endre
        </button>
      </Card>
    );
  }

  mounted() {
    reparationService.getReparationDetails(
      this.props.match.params.id,
      result => {
        this.reparation = result;
        this.reparation.r_fdate =
          result.r_fdate.getDate() + '-' + (result.r_fdate.getMonth() + 1) + '-' + result.r_fdate.getFullYear();
        this.reparation.r_tdate =
          result.r_tdate.getDate() + '-' + (result.r_tdate.getMonth() + 1) + '-' + result.r_tdate.getFullYear();
      },
      () => console.log('failure')
    );
  }

  updateReparation(value, key) {
    reparationService.updateRep(key, value, this.props.match.params.id, () => console.log('rep endret'));
  }
}
