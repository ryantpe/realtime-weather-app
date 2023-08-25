import React from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMoment } from './utils/helpers';

import WeatherCard from './views/WeatherCard';


const Container = styled.div`
  background-color: ${({theme})=> theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const AUTHORIZATION_KEY = 'CWB-99E3C315-C7C0-4D8B-98A6-93D30014984D';
const LOCATION_NAME = '臺北';
const LOCATION_NAME_FORECAST = '臺北市';

const fetchCurrentWeather = () =>{
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
  )
  .then((response)=>response.json())
  .then((data)=>{
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item)=>{
        if (['WDSD', 'TEMP'].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      }, {}
    );

    return {
      observationTime: locationData.time.obsTime,
      locationName: locationData.locationName,
      temperature: weatherElements.TEMP,
      windSpped: weatherElements.WDSD,
    }

  });
};

const fetchWeatherForecast = () =>{
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
  )
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item) => {
        if ( ['Wx', 'PoP', 'CI'].includes(item.elementName) ){
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      }, {}
    );

    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
    };
  
  });
};

function App() {
  console.log('invoke function component');
  const [ currentTheme, setCurrentTheme ] = useState('light')

  //定義會使用到的資料狀態
  const [ weatherElement, setWeatherElement ] = useState({
    locationName: '',
    description: '',
    windSpped: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
  });

  const moment = useMemo(()=>getMoment(LOCATION_NAME_FORECAST), []);

  const fetchData = useCallback(async()=>{
    setWeatherElement((prevState)=>({
      ...prevState,
      isLoading: true,
    }));
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather(), 
      fetchWeatherForecast(),
    ]);
  
    console.log(currentWeather, weatherForecast)
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    })

  
  }, []);
  
  useEffect(()=>{
    setCurrentTheme( moment === 'day' ? 'light' : 'dark' );
  }, [moment]);

  useEffect(()=>{
    fetchData();
  }, [fetchData]);
 
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard 
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData} 
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
 