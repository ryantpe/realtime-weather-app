import React from 'react';
import styled from '@emotion/styled';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';




const Container = styled.div`
  background-color: ${({theme})=> theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({theme})=>theme.Refresh};
  background-color: ${({theme})=>theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({theme})=>theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({theme})=>theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({theme})=>theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme})=>theme.textColor};
  margin-bottom: 20px;
  svg{
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme})=>theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({theme})=>theme.textColor};
  svg{
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex=basis: 30%;
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

function App() {
  console.log('invoke function component');
  const [ currentTheme, setCurrentTheme ] = useState('light')

  //定義會使用到的資料狀態
  const [ currentWeather, setCurrentWeather ] = useState({
    locationName: '臺北市',
    description: '多雲時晴',
    windSpped: 1.1,
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: '2020-12-12 20:10:00',
  });

  useEffect(()=>{
    console.log('execute function in useEffect');
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = () =>{
    fetch(
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

      setCurrentWeather({
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpped: weatherElements.WDSD,
        description: '多雲時晴',
        rainPossibility: 60,
      });
    });
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render')}
        <WeatherCard>
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.description}</Description>
          <CurrentWeather>
            <Temperature>{Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow><AirFlowIcon /> {currentWeather.windSpped} m/h </AirFlow>
          <Rain> <RainIcon/> {currentWeather.rainPossibility} %</Rain>
          <Refresh> 
            最後觀測時間: 
            { 
              new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format( dayjs(currentWeather.observationTime))} {'  '}
            <RefreshIcon onClick={fetchCurrentWeather}/>
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
 