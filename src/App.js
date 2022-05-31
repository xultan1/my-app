import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect,useMemo,useContext } from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {GoogleMap,useLoadScript,Marker} from "@react-google-maps/api"
import usePlacesAutocomplete,{
 getGeocode,
 getLatLng,
} from "use-places-autocomplete"

import{
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
}from "@reach/combobox";
import "@reach/combobox/styles.css";
import { getByTitle } from '@testing-library/react';

const NewCord = React.createContext(0);


function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}


function App(props) {
  const [once, setOnce] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoaded2, setIsLoaded2] = useState(false)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [response,setResponse] = useState([]);
  const [loadedCordinate,setLoadedCordinate] = useState(false);
  const [newCordinate,setNewCordinate] = useState(0)
  const [selected, setSelected] = useState({});
  //const [selected, setSelected] = useState({lat:9.0765 , lng:7.3986});
  const [cached,setCached] = useState([{}])
  const [address,setAddress] = useState()



  

  /*position = async () => {
    navigator.geolocation.getCurrentPosition(
      position => setLatitude(position.coords.latitude)
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      }), 
      err => console.log(err)
    );
    console.log(this.state.latitude)
  }*/


 // position(() => {

    //navigator.geolocation.getCurrentPosition(success);

  //},)

  function name() {

    console.log("click");
    
    
  }


  useEffect(() => {    
    window.addEventListener("scroll", reveal);
    let isMounted = true

    navigator.geolocation.getCurrentPosition(function(position) {
      //console.log("Latitude is :", position.coords.latitude);
      //console.log("Longitude is :", position.coords.longitude)t;
      //var crd = pos.coords;
      if (once === true) {
        //setSelected({lat:crd.latitude , lng:crd.longitude})
        setSelected({lat:position.coords.latitude , lng:position.coords.longitude})
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=e897d9682efe865644ff8dbb3450d74e`)
        .then(res => res.json())
        .then(
          (result) => {
            setAddress(result.name)
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
        setOnce(false)
      }
    });

   /* function success(pos) {
      var crd = pos.coords;
      if (once === true) {
        setSelected({lat:crd.latitude , lng:crd.longitude})
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=e897d9682efe865644ff8dbb3450d74e`)
        .then(res => res.json())
        .then(
          (result) => {
            setAddress(result.name)
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
        setOnce(false)
      }

    }
    navigator.geolocation.getCurrentPosition(success)*/


    

    for (let index = 1; index < cached.length; index++) {

      if (Object.keys(cached[index])[0] === selected.lat+" "+selected.lng && Date.now() - [cached[index].timestamp][0] < (1000 * 60 * 3)) {

        //console.log(cached[index][selected.lat+" "+selected.lng])
        setResponse([cached[index][selected.lat+" "+selected.lng]])
        setIsLoaded(true);
        setIsLoaded2(true)
        console.log('cache')
        return
        
      }
    }

    if (isEmpty(selected) === false) {
      //https://api.openweathermap.org/data/2.5/onecall?lat=9.0765&lon=7.3986&exclude=hourly,daily&appid=e897d9682efe865644ff8dbb3450d74e
      //fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${9.0765}&lon=${7.3986}&appid=e897d9682efe865644ff8dbb3450d74e`)
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${selected.lat}&lon=${selected.lng}&exclude=hourly&appid=e897d9682efe865644ff8dbb3450d74e`)
      .then(res => res.json())
      .then(
        (result) => {
          if (!isMounted) {
            return;
          }

          //let x = [...result]
          //setResponse(...result);
          //setMyArray(oldArray => [...oldArray, newElement]);
          //setResponse([...response,result])
          setResponse([result])
          let a = cached
          setCached([...a,{[selected.lat+" "+selected.lng]:result,timestamp:Date.now()}])
          setIsLoaded(true);
          setIsLoaded2(true)
          setOnce(false)
        },
        (error) => {
          if (!isMounted) {
            return;
          }
          setIsLoaded(true);
          setError(error);
        }
      )


      
    }
    return () => {
      isMounted = false;
    };

        
  },[selected.lat],[selected.lng]);







    function success(pos) {
      var crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.setLongitude);

    }
    

    navigator.geolocation.getCurrentPosition(success)

  if (error) {
    return <div>Error: {error.message}</div>;
  } 
  
  if (!isLoaded || !isLoaded2) {
    return(
      <div className="center">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
    ) 
  }


  return (
    <div>
      <div className="container">
      <PlacesAutoComplete setSelected={setSelected} setIsLoaded2={setIsLoaded2} setAddress={setAddress}/>
        <div className="container" id='firstDiv'>
        <div className="p-1 rounded" id='topCard'>
          <RenderComponent response={response} load={isLoaded} address={address}/>
        </div>
      </div>

      <div className="container" id="secondDiv">
          <RenderComponent2 response={response} address={address}/>
        </div>

        <div className="container" id="thirdDiv">
          <RenderComponent3 response={response} address={address}/>
        </div>
      </div>
    
    </div>
  );
  


  return (
    <div>
      //this in case bg-light
      <div className="container">
      <PlacesAutoComplete setSelected={setSelected}/>
        <RenderMaps/>
        <div className="container" id='firstDiv'>
        <div className="bg-light p-1 rounded" id='topCard'>
          <RenderComponent response={response}/>
        </div>
      </div>

      <div className="container" id="secondDiv">
        <RenderComponent2 response={response}/>
      </div>

      <div className="container" id="thirdDiv">
        <RenderComponent3 response={response}/>
      </div>
      </div>
      
    </div>
  );

}





function RenderComponent(props) {    
  let list = props.response
  let address = props.address

  /**      <div className="container" id='firstDiv'>
        <div className="bg-light p-1 rounded" id='topCard'>
          <RenderComponent response={response}/>
        </div>
      </div>

      <div className="container" id="secondDiv">
        <RenderComponent2 response={response}/>
      </div>

      <div className="container" id="thirdDiv">
        <RenderComponent3 response={response}/>
      </div>

      <div className="container">
        <RenderMaps/>
      </div> */



  function convert (unixTime) {
    let unix_timestamp = unixTime
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    
    // Will display time in 10:30:23 format
    //hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return hours + ':' + minutes.substr(-2);
  }

  if (!props.load) {
    return <div>Loading...</div>;
  }


  if (props.response !== null) {

    return (
      <div>
        {
          props.response.map((element, i) =>
          <div  key={i}>

            <p className="fs-4 firstPclass">{address}, As of {convert(element.current.dt)}</p>
            <p className='firstPclass' id='midP'>{Math.trunc(element.current.temp - 273.13)}&#176;
              <img src={`http://openweathermap.org/img/wn/${element.current.weather[0].icon}@2x.png`} id='firstImage' alt=""></img></p>
            <p className="fs-3 firstPclass" id='lastP'>{'Feels like '+ (Math.trunc(element.current.feels_like - 273.13))}&#176; <br/>
            Day {Math.trunc(element.daily[0].temp.day - 273.13)}&#176; . Night {Math.trunc(element.daily[0].temp.night - 273.13)}&#176;
            </p>
            


          </div>
            
          )
        }
      </div>
    )
    
  }

}

function RenderComponent2(props) {    
  let list = props.response
  if (props.response !== null) {

    function convert (unixTime) {
      let unix_timestamp = unixTime
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(unix_timestamp * 1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();
      
      // Will display time in 10:30:23 format
      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    return (
      <div>
          {
            props.response.map((element, i) =>
            <div key={i}>
                <div className="bg-light p-1 rounded" id="secondCard">
                  <p className="fs-4" id="secondP">Today's Forecast for {props.address}</p>
                  <div className="container" id="secondDiv1">
                    <div className="row">
                      <div className="col rowDiv">
                        <p className="fs-5 rowP1">Morning</p>
                        <p className="rowP2">{Math.trunc(element.daily[0].temp.morn - 273.13)}&#176;</p>
                        <p className="rowP3">2%</p>
                      </div>
                      <div className="col vl rowDiv">
                        <p className="fs-5 rowP1">Afternoon</p>
                        <p className="rowP2">{Math.trunc(element.daily[0].temp.day - 273.13)}&#176;</p>
                        <p className="rowP3">2%</p>
                      </div>
                      <div className="col vl rowDiv">
                        <p className="fs-5 rowP1">Evening</p>
                        <p className="rowP3Last1">{Math.trunc(element.daily[0].temp.eve - 273.13)}&#176;</p>
                        <p className="rowP3">3%</p>
                      </div>
                      <div className="col vl rowDiv">
                        <p className="fs-5 rowP1">Overnight</p>
                        <p className="rowP3Last1">{Math.trunc(element.daily[0].temp.night -273.13)}&#176;</p>
                        <p className="rowP3">2%</p>
                      </div>
                    </div>
                    <button id="secondButton" type="button" className="btn btn-primary btn-sm">Large button</button>
                  </div>
                </div>
            </div>
              
            )
          }

      </div>
    )
    
  }

}


function RenderComponent3(props) {    
  let list = props.response
  if (props.response !== null) {
    return (
      <div>

          {
            props.response.map((element, i) =>
            <div key={i}>

              <div className="bg-light p-1 rounded" id="thirdCard">
                  <p className="fs-4" id="thirdP1">Weather Today in {props.address}</p>
                  <p id="thirdP2">{Math.trunc(element.current.feels_like - 273.13)}&#176;<br/>
                    <a id="thirdA">Feels Like</a>
                  </p>

                  <div className="float-container">
                    <div className="float-child">
                      <div className="green">
                        <table className="table table-sm">
                          <thead>

                          </thead>
                          <tbody>
                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M10.333 15.48v.321c.971.357 1.667 1.322 1.667 2.456 0 1.438-1.12 2.604-2.5 2.604S7 19.695 7 18.257c0-1.134.696-2.099 1.667-2.456v-.322a2.084 2.084 0 0 1-1.25-1.91V5.583a2.083 2.083 0 1 1 4.166 0v7.986c0 .855-.514 1.589-1.25 1.91zM15.8 8.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6zm0-1.85a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                    </svg>
                                    <a className="thirdA1">High/Low</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{Math.trunc(element.daily[0].temp.max - 273.13)}/{Math.trunc(element.daily[0].temp.min - 273.13)}&#176;</td>
                            </tr>
                            
                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M6 8.67h5.354c1.457 0 2.234-1.158 2.234-2.222S12.687 4.4 11.354 4.4c-.564 0-1.023.208-1.366.488M3 11.67h15.54c1.457 0 2.235-1.158 2.235-2.222S19.873 7.4 18.54 7.4c-.747 0-1.311.365-1.663.78M6 15.4h9.389c1.457 0 2.234 1.159 2.234 2.223 0 1.064-.901 2.048-2.234 2.048a2.153 2.153 0 0 1-1.63-.742"></path>
                                    </svg>
                                    <a className="thirdA1">Humidity</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{element.current.humidity}%</td>
                            </tr>

                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path fillRule="evenodd" d="M11.743 17.912a4.182 4.182 0 0 1-2.928-1.182 3.972 3.972 0 0 1-.614-4.962.743.743 0 0 1 .646-.349c.234 0 .476.095.66.275l4.467 4.355c.385.376.39.998-.076 1.275a4.216 4.216 0 0 1-2.155.588M11.855 4c.316 0 .61.14.828.395.171.2.36.416.562.647 1.857 2.126 4.965 5.684 4.965 8.73 0 3.416-2.85 6.195-6.353 6.195-3.505 0-6.357-2.78-6.357-6.195 0-3.082 2.921-6.406 4.854-8.605.242-.275.47-.535.673-.772A1.08 1.08 0 0 1 11.855 4"></path>
                                    </svg>
                                    <a className="thirdA1">Pressure</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{element.current.pressure} mb</td>
                            </tr>

                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M491.856 879.808c-60.48-5.056-110.848-25.184-171.328-55.424-120.96-55.424-216.704-146.112-292.256-256.96-25.248-40.352-30.24-80.64 0-126.016 80.608-115.872 186.464-211.68 317.472-272.096 110.816-50.4 226.752-50.4 337.664 0 136 60.48 241.824 156.224 317.44 282.208 15.104 25.216 25.12 65.504 10.048 85.728-105.792 191.424-256.992 367.84-519.04 342.56zm292.256-377.92c0-151.168-120.96-272.064-272.096-272.064-146.144 0-272.128 126.016-272.128 272.064 0 151.232 120.96 277.216 272.128 277.216 151.104-.032 272.096-125.984 272.096-277.216z"></path>
                                      <path d="M789.808 500.416c0 156.896-125.472 287.52-282.336 282.336-156.864 0-282.336-130.656-282.336-287.488 0-146.4 130.656-277.12 282.336-277.12 156.896-.032 287.584 125.376 282.336 282.272zM512.752 348.832c-83.68 0-151.584 67.968-151.584 151.584 0 88.864 67.968 156.896 151.584 156.896 83.648 0 156.832-73.216 156.832-156.896-5.184-83.648-73.152-151.584-156.832-151.584z"></path>
                                    </svg>
                                    <a className="thirdA1">Visibility</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{element.current.visibility / 1000} Km</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="float-child">
                      <div className="blue">
                        <table className="table table-sm">
                          <thead>

                          </thead>
                          <tbody>
                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M6 8.67h5.354c1.457 0 2.234-1.158 2.234-2.222S12.687 4.4 11.354 4.4c-.564 0-1.023.208-1.366.488M3 11.67h15.54c1.457 0 2.235-1.158 2.235-2.222S19.873 7.4 18.54 7.4c-.747 0-1.311.365-1.663.78M6 15.4h9.389c1.457 0 2.234 1.159 2.234 2.223 0 1.064-.901 2.048-2.234 2.048a2.153 2.153 0 0 1-1.63-.742" strokeWidth="2" stroke="currentColor" strokeLinecap="round" fill="none"></path>
                                    </svg>
                                    <a className="thirdA1">Wind</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{element.current.wind_speed} Km/h</td>
                            </tr>
                            
                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M17 8.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6zm0-1.85a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                      <path fillRule="evenodd" d="M9.743 18.912a4.182 4.182 0 0 1-2.928-1.182 3.972 3.972 0 0 1-.614-4.962.743.743 0 0 1 .646-.349c.234 0 .476.095.66.275l4.467 4.355c.385.376.39.998-.076 1.275a4.216 4.216 0 0 1-2.155.588M9.855 5c.316 0 .61.14.828.395.171.2.36.416.562.647 1.857 2.126 4.965 5.684 4.965 8.73 0 3.416-2.85 6.195-6.353 6.195-3.505 0-6.357-2.78-6.357-6.195 0-3.082 2.921-6.406 4.854-8.605.242-.275.47-.535.673-.772C9.245 5.14 9.54 5 9.855 5"></path>
                                    </svg>
                                    <a className="thirdA1">Dew Point</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{Math.trunc(element.current.dew_point - 273.13)}&#176;</td>
                            </tr>

                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M7.4 5.598a.784.784 0 0 1 .25-.92c.335-.256.824-.197 1.02.062.066.063.066.063.08.085l2.406 3.152-.626.238a3.983 3.983 0 0 0-1.097.633l-.522.424L7.4 5.598zm4.539 2.358c-.21 0-.418.017-.625.05l-.664.106.09-.666.438-3.266c.013-.072.013-.072.012-.057a.783.783 0 0 1 .666-.616.78.78 0 0 1 .872.639l.006.038.507 3.933-.662-.108a3.957 3.957 0 0 0-.64-.053zm-7.781 3.19l.026-.004 3.934-.507-.108.662a3.98 3.98 0 0 0-.003 1.266l.105.664-.665-.09-3.265-.439a.784.784 0 0 1-.676-.679c-.054-.42.238-.809.63-.869l.022-.004zm11.504-.617a3.98 3.98 0 0 0-.632-1.097l-.425-.522.623-.256 3.056-1.256a.787.787 0 0 1 .916.253c.256.337.199.817-.104 1.063l-.045.037-3.151 2.405-.238-.627zm-1.205-1.672a3.984 3.984 0 0 0-1.095-.637l-.626-.24.41-.532 2.008-2.602c.059-.07.059-.07.046-.052a.78.78 0 0 1 1.306.227c.076.185.079.39.02.54l-.021.06-1.528 3.662-.52-.426zM4.595 7.793c.162-.387.611-.58.971-.441.017.004.017.004.055.02L9.283 8.9l-.425.52a3.985 3.985 0 0 0-.636 1.094l-.24.627-3.144-2.425a.784.784 0 0 1-.243-.924zm14.443 7.367c.054.045.054.045.044.04a.784.784 0 0 1 .199.884c-.163.386-.61.58-.964.443-.024-.006-.024-.006-.062-.022l-3.662-1.529.426-.52a3.98 3.98 0 0 0 .636-1.094l.241-.626 3.142 2.424zm1.332-3.303c.053.422-.239.809-.63.87l-.035.006-3.945.508.108-.662a3.999 3.999 0 0 0 .003-1.266l-.105-.663.665.09 3.272.44c.068.012.068.012.052.01a.784.784 0 0 1 .615.667zm-3.894 6.421c.024.068.024.068.017.053a.786.786 0 0 1-.27.87c-.332.25-.816.194-1.047-.091-.022-.023-.022-.023-.05-.058l-2.406-3.154.626-.237a3.977 3.977 0 0 0 1.097-.632l.523-.425 1.51 3.674zm-8.26-4.932c.151.397.365.767.633 1.097l.424.522-.622.256-3.054 1.255a.787.787 0 0 1-.92-.25.781.781 0 0 1-.154-.58c.027-.199.127-.379.227-.452.045-.046.045-.046.075-.069l3.153-2.406.238.627zm3.723 2.572c.209 0 .417-.016.625-.049l.662-.103-.089.664-.438 3.26-.012.062a.785.785 0 0 1-.666.618c-.048.005-.048.005-.101.006-.386 0-.714-.28-.764-.612-.01-.043-.01-.043-.014-.072l-.507-3.934.662.108c.213.035.427.052.642.052zM7.366 18.27l.006-.015L8.9 14.592l.52.426a3.99 3.99 0 0 0 1.094.636l.626.241-.41.531-2.012 2.609-.04.046a.788.788 0 0 1-.886.2.787.787 0 0 1-.428-1.011z"></path>
                                      <path d="M11.911 14.322a2.411 2.411 0 1 0 0-4.822 2.411 2.411 0 0 0 0 4.822zm0 2a4.411 4.411 0 1 1 0-8.822 4.411 4.411 0 0 1 0 8.822z"></path>
                                    </svg>
                                    <a className="thirdA1">UV Index</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>-{element.current.uvi}</td>
                            </tr>

                            <tr>
                              <td>  
                                  <div>
                                    <svg className="thirdSvg">
                                      <path d="M12.079 4.518c3.4.673 4.065 5.797 4.066 7.577 0 1.78-.665 6.759-4.066 7.542-4.462 0-8.079-3.07-8.079-7.542 0-4.47 3.617-7.577 8.079-7.577z"></path>
                                      <path fill="none" d="M12.099 20.19a8.095 8.095 0 1 0 0-16.19 8.095 8.095 0 0 0 0 16.19z" stroke="currentColor" strokeWidth="1.5"></path>
                                    </svg>
                                    <a className="thirdA1">Moon Phase</a>
                                  </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{element.daily[0].moon_phase}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                  </div>

                  <div id='hideSS'>
                    sssssssssssss
                  </div>

                </div>

            </div>
              
            )
          }

          
        </div>      
      
    )
    
  }

}







function RenderMaps(props) {   

  const libraries = ['places'];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:"AIzaSyDzYHOxVsCLVI0ffRiJQJrTd5Po4JXQDA0",
    libraries:["places"],
    //libraries,
  });
  
  if (!isLoaded) return <div>Loading...</div>;
  return(
    <div>
      <Map/>
    </div>
  ) 

}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}





function Map(props) {

 /* useEffect(() => {

  });*/

  

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  


  //navigator.geolocation.getCurrentPosition(success)


  useEffect(() => {
    function success(pos) {
      var crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
  
      //return [latitude,longitude]
    }
    navigator.geolocation.getCurrentPosition(success)
  }, [latitude],[longitude]);
    
    if (latitude === null && longitude === null) {
      return(
        <div>
          Loading
        </div>
      )
    }

    return(
      <>
      <div className='container'>
        {/*<PlacesAutoComplete setSelected={setSelected}/>*/}
      </div>

      <GoogleMap zoom={10} center={{lat:latitude , lng:longitude}} mapContainerClassName="container map">
        <Marker position={{lat:latitude , lng:longitude}} />
        {selected && <Marker position={selected}/>}
      </GoogleMap>

      </>
    )
    
}


const PlacesAutoComplete = ({ setSelected , setIsLoaded2 , setAddress},props) =>{

  const {
    ready,
    value,
    setValue,
    suggestions:{status,data},
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address,false)
    clearSuggestions();

    const results = await getGeocode({address});
    const {lat,lng} = await getLatLng(results[0]);
    setSelected({lat,lng});
    setIsLoaded2(false)
    let streetaddress= address.substr(0, address.indexOf(',')); 
    setAddress(streetaddress)
    //props.change(this)
  }

  return (
    <Combobox onSelect={handleSelect}>

      <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} 
      className="combobox-input" placeholder='Search an address'
      />
        <ComboboxPopover>   
          <ComboboxList>   
            {status === "OK" && data.map(({place_id,description}) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
          </ComboboxList> 
        </ComboboxPopover>   



    </Combobox>

  );

};





export default App;
