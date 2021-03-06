import React, { Component } from 'react';
//import { ApolloClient, gql } from "apollo-boost";
//import { ApolloClient } from "apollo-boost";
//import { Query } from "react-apollo";
//import { graphql } from "react-apollo";
//import gql from "graphql-tag";
//import { useQuery } from '@apollo/react-hooks';
//import { useQuery } from 'react-apollo-hooks';

import {getGunClock} from './GunClock.draw';
import {myenvironment} from './myenvironments/myenvironment';

const GUNCLOCK_GRAPHDB = myenvironment.GUNCLOCK_GRAPHDB;

const GUNCLOCK_API = "";

const GET_GUNCLOCKS = `
  { 
    Gunclock {
      _id,
      uuid,
      size,
      color
    }
  }
`;

const VIEW_GUNCLOCK = `
  query ($uuid: String) {
    Gunclock(uuid: $uuid) {
      _id,
      uuid,
      size,
      color
    }
  }
`;

const CREATE_GUNCLOCK = `
  mutation($size: Int, $color: String) {
    createGunclock(
      size: $size,
      color: $color,
      cityName: "Tokyo",
      shortHandCastName: "gunman",
      longHandCastName: "uma"
    )
  }
`;


const UPDATE_GUNCLOCK = `
  mutation($uuid: String, $size: Int, $color: String) {
    updateGunclock(
      uuid: $uuid,
      size: $size,
      color: $color,
      cityName: "Tokyo",
      shortHandCastName: "gunman",
      longHandCastName: "uma"
    )
  }
`;

const DELETE_GUNCLOCK = `
  mutation($uuid: String) {
    deleteGunclock(
      uuid: $uuid
    )
  }
`;


export default class Gunclock extends Component {
//class Gunclock extends Component {

  getGunclocksGQL() {

    var inputData = {
      query: GET_GUNCLOCKS
    }

    fetch(
      GUNCLOCK_GRAPHDB,
      {
        method: 'post',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(inputData)
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.setState({
        gunclocks: response_json.data.Gunclock,
        gunclock_id : '',
        gunclock_uuid : '',
        gunclock_size: '',
        gunclock_color: '',
        gunclock_string : '',
      });

    });

//    console.log("getGunclockGQL(): started.");
//    var gunclocks_json = [];

//    var data = useQuery(GET_GUNCLOCKS);

//    var gunclocks = this.props.getGunclocks.Gunclock;
//    console.log(this.props);
//    console.log(props);
//    console.log(gunclocks);

//    var result = graphql(GET_GUNCLOCKS);
//    console.log(result);

  }

  createGunclockREST(gunclock_size, gunclock_color) {

    var inputData = {
      size: gunclock_size,
      color: gunclock_color
    }

    fetch(
      GUNCLOCK_API,
      {
        method: 'post',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(inputData)
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();
    });
  }

  updateGunclockREST(id) {
    const { gunclock_size, gunclock_color } = this.state;

    console.log("updateGunclockREST(): started.");

    var inputData = {
      size: gunclock_size,
      color: gunclock_color
    }

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'put',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(inputData)
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();

      this.setState({
        gunclock_id : '',
        gunclock_uuid : '',
        gunclock_size : '',
        gunclock_color : '',
        gunclock_string : '',
        updateFlag : false
      });

    });
  }

  showGunclockREST(id) {

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'get',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      var gunclock_string = getGunClock(response_json.gunclock.size);
      this.setState({
        gunclock_id: response_json.gunclock._id,
        gunclock_uuid: response_json.gunclock._uuid,
        gunclock_size: response_json.gunclock.size,
        gunclock_color: response_json.gunclock.color,
        gunclock_string: gunclock_string,
        showFlag: true,
        updateFlag: false
      });
//      this.getGunclocksREST();
    });
  }

  deleteGunclockREST(id) {

    fetch(
      GUNCLOCK_API + "/" + id,
      {
        method: 'delete',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((response_json) => {
      console.log(response_json);
      this.getGunclocksREST();
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      gunclocks: [],
      gunclock_id: '',
      gunclock_uuid: '',
      gunclock_size: '',
      gunclock_color: '',
      gunclock_string: '',
      updateFlag: false,
      showFlag: false
    };

    this.getGunclocksGQL();

  }

  onInputSize = (e) => {
    this.setState({
      gunclock_size: e.target.value
    });
  }
  onInputColor = (e) => {
    this.setState({
      gunclock_color: e.target.value
    });
  }

  addGunclock = () => {
    const { gunclock_size, gunclock_color } = this.state;
    console.log("gunclock_size" + gunclock_size + ", gunclock_color" + gunclock_color);
    this.createGunclockREST(gunclock_size, gunclock_color);
  }

  updateGunclock = (uuid, size, color) => {
    console.log("updateGunclock(): started.");
    this.setState({
      gunclock_uuid : uuid,
      gunclock_size : size,
      gunclock_color : color,
      showFlag : false,
      updateFlag : true
    });
  }

  removeGunclock = (index) => {
    const { gunclocks } = this.state;
    delete gunclocks[index];
    this.setState({
      gunclocks: gunclocks 
    });
  }

  render() {
    console.log("render(): started.");
    const { gunclocks, gunclock_id, gunclock_uuid, gunclock_size, gunclock_color, gunclock_string } = this.state;

    return (
    <div>
     <div
      className="update"
      style={{display: (this.state.updateFlag+this.state.showFlag) ? 'none': ''}}
     >

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="left">uuid</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>
       </thead>
       <tbody>
        {gunclocks.map((gunclock, index) => 
         <tr key={index}>
         <td align="left">{gunclock._id}</td>
         <td align="left">{gunclock.uuid}</td>
         <td align="right">{gunclock.size}</td>
         <td align="left" bgcolor={gunclock.color}>{gunclock.color}</td>
         <td>
          <button onClick={ () => { this.showGunclockREST(gunclock._id) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock.uuid, gunclock.size, gunclock.color) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockREST(gunclock.uuid) }}>削除</button>
         </td>
         </tr>)
        }
       </tbody>
      </table>

      <br />

      size:
      <input type="text" onInput={this.onInputSize}/>
      color:
      <input type="text" onInput={this.onInputColor}/>
      <button onClick={this.addGunclock}>登録</button>

     </div>

     <div
      className="update"
      style={{display: this.state.updateFlag? '': 'none'}}
     >
      id:
      {gunclock_id}<br/>
      uuid:
      {gunclock_uuid}<br/>

      size:
      <input type="text" value={gunclock_size} onChange={this.onInputSize}/>
      color:
      <input type="text" value={gunclock_color} onChange={this.onInputColor}/>
      <button onClick={() => {this.updateGunclockREST(gunclock_uuid)}}>更新</button>

      <br />
      <a href="/">戻る</a>
     </div>

     <div
      className="show"
      style={{display: this.state.showFlag? '': 'none'}}
     >

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="left">uuid</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>
       </thead>
       <tbody>
        <tr>
         <td align="left">{gunclock_id}</td>
         <td align="left">{gunclock_uuid}</td>
         <td align="right">{gunclock_size}</td>
         <td align="left" bgcolor={gunclock_color}>{gunclock_color}</td>
         <td>
          <button onClick={ () => { this.showGunclockREST(gunclock_uuid) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock_uuid, gunclock_size, gunclock_color) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockREST(gunclock_uuid) }}>削除</button>
         </td>
        </tr>
       </tbody>
      </table>

      <br />

      <table>
      <tbody>
      <tr><td bgcolor={gunclock_color}>
      <pre>{gunclock_string}</pre>
      </td></tr>
      </tbody>
      </table>

      <br />
      <a href="/">戻る</a>
     </div>

    </div>
    );
  }

}

//export default graphql(GET_GUNCLOCKS, { name: "getGunclocks" })(Gunclock);
//export default graphql(GET_GUNCLOCKS, { name: "getGunclocks" })(Gunclock);

