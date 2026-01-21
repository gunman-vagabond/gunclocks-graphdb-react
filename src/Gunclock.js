import React, { Component } from 'react';

import {getGunClock} from './GunClockWorld';
import {myenvironment} from './myenvironments/myenvironment';

const GUNCLOCK_GRAPHDB = myenvironment.GUNCLOCK_GRAPHDB;

export default class Gunclock extends Component {

  getGunclocksGQL() {

    var inputData = {
      query: `
        { 
          Gunclock {
            _id,
            uuid,
            size,
            color,
            city{name},
            shortHandCast{name},
            longHandCast{name}
          }
        }
      `
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
      this.safeSetState({
        gunclocks: response_json.data.Gunclock,
        gunclock_id : '',
        gunclock_uuid : '',
        gunclock_size: '',
        gunclock_color: '',
        gunclock_string : '',
        gunclock_city_name : '',
        gunclock_shortHandCast_name : '',
        gunclock_longHandCast_name : '',
      });

    });

  }

//  createGunclockGQL(gunclock_size, gunclock_color) {
  createGunclockGQL() {
    const { gunclock_size, gunclock_color, gunclock_city_name, gunclock_shortHandCast_name, gunclock_longHandCast_name } = this.state;

    console.log("gunclock_size="+gunclock_size);
    console.log("gunclock_color="+gunclock_color);
    // Use GraphQL variables to avoid fragile string concatenation and quoting issues
    const query = `mutation CreateGunclock($size: Int!, $color: String!, $cityName: String!, $shortHandCastName: String!, $longHandCastName: String!) {
      createGunclock(
        size: $size,
        color: $color,
        cityName: $cityName,
        shortHandCastName: $shortHandCastName,
        longHandCastName: $longHandCastName
      ) { _id }
    }`;

    const variables = {
      size: Number(gunclock_size) || 0,
      color: gunclock_color,
      cityName: gunclock_city_name,
      // provide sensible defaults when user left these empty to avoid server-side rejection
      shortHandCastName: gunclock_shortHandCast_name && gunclock_shortHandCast_name.trim() !== '' ? gunclock_shortHandCast_name : 'gunman',
      longHandCastName: gunclock_longHandCast_name && gunclock_longHandCast_name.trim() !== '' ? gunclock_longHandCast_name : 'uma'
    };

    var inputData = { query, variables };
    // DEBUG: log the exact query and payload we're sending
    console.log('Sending createGunclock payload:', inputData);

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
      console.log('HTTP status for createGunclock:', response.status, response.statusText);
      return response.json();
    })
    .then((response_json) => {
      console.log('createGunclock response JSON:', response_json);
      if (response_json && response_json.data && response_json.data.createGunclock === null) {
        console.warn('createGunclock returned null — check server logs / resolver behavior. Full response:', response_json);
      }
      this.getGunclocksGQL();
    })
    .catch((err) => {
      console.error('Network/error during createGunclock fetch:', err);
    });
  }

  updateGunclockGQL(uuid) {
    const { gunclock_size, gunclock_color, gunclock_city_name, gunclock_shortHandCast_name, gunclock_longHandCast_name } = this.state;

    console.log("updateGunclockGQL(): started.");

    // Use GraphQL variables to avoid string-concatenation issues
  const query = `mutation UpdateGunclock($uuid: ID!, $size: Int!, $color: String!, $cityName: String!, $shortHandCastName: String!, $longHandCastName: String!) {
      updateGunclock(
        uuid: $uuid,
        size: $size,
        color: $color,
        cityName: $cityName,
        shortHandCastName: $shortHandCastName,
        longHandCastName: $longHandCastName
      ) { _id }
    }`;

    const variables = {
      uuid: uuid,
      size: Number(gunclock_size) || 0,
      color: gunclock_color,
      cityName: gunclock_city_name,
      shortHandCastName: gunclock_shortHandCast_name && gunclock_shortHandCast_name.trim() !== '' ? gunclock_shortHandCast_name : 'gunman',
      longHandCastName: gunclock_longHandCast_name && gunclock_longHandCast_name.trim() !== '' ? gunclock_longHandCast_name : 'uma'
    };

    var inputData = { query, variables };

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
      this.getGunclocksGQL();

      this.safeSetState({
        gunclock_id : '',
        gunclock_uuid : '',
        gunclock_size : '',
        gunclock_color : '',
        gunclock_string : '',
        gunclock_city_name : '',
        gunclock_shortHandCast_name : '',
        gunclock_longHandCast_name : '',
        updateFlag : false
      });

    });
  }

  showGunclockGQL(uuid) {

    console.log("showGunclockGQL(): uuid= " + uuid);
  const query = `query ShowGunclock($uuid: ID!) {
      Gunclock(uuid: $uuid) {
        _id
        uuid
        size
        color
        city { name }
        shortHandCast { name text }
        longHandCast { name text }
      }
    }`;

    const variables = { uuid };

    var inputData = { query, variables };

    // DEBUG
    console.log('Sending showGunclock payload:', inputData);

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
      console.log('HTTP status for showGunclock:', response.status, response.statusText);
      return response.json();
    })
    .then((response_json) => {
      console.log('showGunclock response JSON:', response_json);
      var gunclock_string 
        = getGunClock(
           { 
             size :  response_json.data.Gunclock[0].size, 
             cityName  : response_json.data.Gunclock[0].city.name, 
             shortHandCastText : response_json.data.Gunclock[0].shortHandCast.text,
             longHandCastText : response_json.data.Gunclock[0].longHandCast.text,
           }
        );
      console.log(response_json.data.Gunclock[0]._id);
      console.log(response_json.data.Gunclock[0].uuid);
      console.log(response_json.data.Gunclock[0].size);
      console.log(response_json.data.Gunclock[0].color);
      console.log(response_json.data.Gunclock[0].shortHandCast.name);
      console.log(response_json.data.Gunclock[0].longHandCast.text);
      console.log(response_json.data.Gunclock[0].longHandCast.name);
      console.log(response_json.data.Gunclock[0].shortHandCast.text);
      console.log(gunclock_string);
      this.safeSetState({
        gunclock_id: response_json.data.Gunclock[0]._id,
        gunclock_uuid: response_json.data.Gunclock[0].uuid,
        gunclock_size: response_json.data.Gunclock[0].size,
        gunclock_color: response_json.data.Gunclock[0].color,
        gunclock_city_name: response_json.data.Gunclock[0].city.name,
        gunclock_shortHandCast_name: response_json.data.Gunclock[0].shortHandCast.name,
        gunclock_longHandCast_name: response_json.data.Gunclock[0].longHandCast.name,
        gunclock_string: gunclock_string,
        showFlag: true,
        updateFlag: false
      });
    })
    .catch((err) => {
      console.error('Network/error during showGunclock fetch:', err);
    });
  }

  deleteGunclockGQL(uuid) {
  const query = `mutation DeleteGunclock($uuid: ID!) {
      deleteGunclock(uuid: $uuid) { _id }
    }`;

    const variables = { uuid };

    var inputData = { query, variables };
    console.log('Sending deleteGunclock payload:', inputData);

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
      console.log('HTTP status for deleteGunclock:', response.status, response.statusText);
      return response.json();
    })
    .then((response_json) => {
      console.log('deleteGunclock response JSON:', response_json);
      if (response_json && response_json.data && response_json.data.deleteGunclock === null) {
        console.warn('deleteGunclock returned null — check server logs / resolver behavior. Full response:', response_json);
      }
      this.getGunclocksGQL();
    })
    .catch((err) => {
      console.error('Network/error during deleteGunclock fetch:', err);
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
      gunclock_city_name: '',
      gunclock_shortHandCast_name: '',
      gunclock_longHandCast_name: '',
      updateFlag: false,
      showFlag: false
    };
  }

  componentDidMount() {
    // mark mounted and load initial data
    this._isMounted = true;
    // If any state updates were queued before mount, apply them now
    if (this._pendingState) {
      this.setState(this._pendingState);
      this._pendingState = null;
    }
    this.getGunclocksGQL();
  }

  componentWillUnmount() {
    // mark unmounted to avoid calling setState after unmount
    this._isMounted = false;
  }

  // Use this instead of setState in async callbacks to avoid warnings
  // If component not yet mounted, queue the state update and apply it in componentDidMount
  safeSetState(stateObj) {
    if (this._isMounted) {
      this.setState(stateObj);
    } else {
      this._pendingState = Object.assign({}, this._pendingState || {}, stateObj);
    }
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

  onChangeSelectCity = (e) => {
    this.setState( {
     gunclock_city_name: e.target.value
    });
  }

  onChangeSelectShortHandCast = (e) => {
    this.setState( {
     gunclock_shortHandCast_name: e.target.value
    });
  }

  onChangeSelectLongHandCast = (e) => {
    this.setState( {
     gunclock_longHandCast_name: e.target.value
    });
  }

  addGunclock = () => {
//    const { gunclock_size, gunclock_color } = this.state;
//    console.log("gunclock_size" + gunclock_size + ", gunclock_color" + gunclock_color);
//    this.createGunclockGQL(gunclock_size, gunclock_color);
    this.createGunclockGQL();
  }

  updateGunclock = (uuid, size, color, city_name, shortHandCast_name, longHandCast_name) => {
    console.log("updateGunclock(): started.");
    this.setState({
      gunclock_uuid : uuid,
      gunclock_size : size,
      gunclock_color : color,
      gunclock_city_name : city_name,
      gunclock_shortHandCast_name : shortHandCast_name,
      gunclock_longHandCast_name : longHandCast_name,
      showFlag : false,
      updateFlag : true
    });
  }

  render() {
    console.log("render(): started.");
    const { 
      gunclocks, 
      gunclock_id, 
      gunclock_uuid, 
      gunclock_size, 
      gunclock_color, 
      gunclock_city_name,
      gunclock_shortHandCast_name,
      gunclock_longHandCast_name,
      gunclock_string
    } = this.state;

    return (
    <div>
     <div
      className="list"
      style={{display: (this.state.updateFlag+this.state.showFlag) ? 'none': ''}}
     >

      <hr />
      <h1>list of gunclocks</h1> 

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="left">uuid</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th align="left">city</th>
        <th align="left">shortHandCast</th>
        <th align="left">longHandCast</th>
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
         <td align="left">{gunclock.city.name}</td>
         <td align="left">{gunclock.shortHandCast.name}</td>
         <td align="left">{gunclock.longHandCast.name}</td>
         <td>
          <button onClick={ () => { this.showGunclockGQL(gunclock.uuid) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock.uuid, gunclock.size, gunclock.color, gunclock.city.name, gunclock.shortHandCast.name, gunclock.longHandCast.name) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockGQL(gunclock.uuid) }}>削除</button>
         </td>
         </tr>)
        }
       </tbody>
      </table>

      <br />

      <hr />

      <h1>create new gunclock</h1>

  size:
  <input type="text" value={gunclock_size} onChange={this.onInputSize}/>
  color:
  <input type="text" value={gunclock_color} onChange={this.onInputColor}/>
      <br />

      city:
      <select value={this.state.gunclock_city_name} onChange={this.onChangeSelectCity}>
       <option value="Tokyo">Tokyo</option>
       <option value="Shanghai">Shanghai</option>
       <option value="Sydney">Sydney</option>
       <option value="Moscow">Moscow</option>
       <option value="Berlin">Berlin</option>
       <option value="Paris">Paris</option>
       <option value="London">London</option>
       <option value="Cairo">Cairo</option>
       <option value="NewYork">NewYork</option>
       <option value="LosAngeles">LosAngeles</option>
       <option value="Sao_Paulo">Sao_Paulo</option>
      </select>

      shortHandCast:
      <select value={this.state.gunclock_shortHandCast_name} onChange={this.onChangeSelectShortHandCast}>
       <option value="gunman">gunman</option>
       <option value="uma">uma</option>
       <option value="gunman2">gunman2</option>
       <option value="oni">oni</option>
      </select>

      longHandCast:
      <select value={this.state.gunclock_longHandCast_name} onChange={this.onChangeSelectLongHandCast}>
       <option value="uma">uma</option>
       <option value="gunman">gunman</option>
       <option value="gunman2">gunman2</option>
       <option value="oni">oni</option>
      </select>
      <br />

  <button onClick={this.addGunclock}>追加</button>
      <hr />

     </div>

     <div
      className="update"
      style={{display: this.state.updateFlag? '': 'none'}}
     >
      <hr />
      <h1>update gunclock</h1> 

      id:
      {gunclock_id}<br/>
      uuid:
      {gunclock_uuid}<br/>

      size:
      <input type="text" value={gunclock_size} onChange={this.onInputSize}/>
      color:
      <input type="text" value={gunclock_color} onChange={this.onInputColor}/>
      <br />

      city:
      <select value={gunclock_city_name} onChange={this.onChangeSelectCity}>
       <option value="Tokyo">Tokyo</option>
       <option value="Shanghai">Shanghai</option>
       <option value="Sydney">Sydney</option>
       <option value="Moscow">Moscow</option>
       <option value="Berlin">Berlin</option>
       <option value="Paris">Paris</option>
       <option value="London">London</option>
       <option value="Cairo">Cairo</option>
       <option value="NewYork">NewYork</option>
       <option value="LosAngeles">LosAngeles</option>
       <option value="Sao_Paulo">Sao_Paulo</option>
      </select>

      shortHandCast:
      <select value={gunclock_shortHandCast_name} onChange={this.onChangeSelectShortHandCast}>
       <option value="gunman">gunman</option>
       <option value="uma">uma</option>
       <option value="gunman2">gunman2</option>
       <option value="oni">oni</option>
      </select>

      longHandCast:
      <select value={gunclock_longHandCast_name} onChange={this.onChangeSelectLongHandCast}>
       <option value="uma">uma</option>
       <option value="gunman">gunman</option>
       <option value="gunman2">gunman2</option>
       <option value="oni">oni</option>
      </select>
      <br />

  <button onClick={() => {this.updateGunclockGQL(gunclock_uuid)}}>更新</button>

  <br />
  <a href="/">戻る</a>
      <hr />

     </div>

     <div
      className="show"
      style={{display: this.state.showFlag? '': 'none'}}
     >

      <hr />
      <h1>show gunclock</h1>

      <table border="1" cellSpacing="0" cellpading="0">
       <thead>
        <tr>
        <th align="left">id</th>
        <th align="left">uuid</th>
        <th align="right">size</th>
        <th align="left">color</th>
        <th align="left">city</th>
        <th align="left">shortHandCast</th>
        <th align="left">longHandCast</th>
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
         <td align="left">{gunclock_city_name}</td>
         <td align="left">{gunclock_shortHandCast_name}</td>
         <td align="left">{gunclock_longHandCast_name}</td>
         <td>
          <button onClick={ () => { this.showGunclockGQL(gunclock_uuid) }}>表示</button>
         </td>
         <td>
          <button onClick={ () => { this.updateGunclock(gunclock_uuid, gunclock_size, gunclock_color) }}>更新</button>
         </td>
         <td>
          <button onClick={ () => { this.deleteGunclockGQL(gunclock_uuid) }}>削除</button>
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
      <hr />

     </div>

    </div>
    );
  }

}
