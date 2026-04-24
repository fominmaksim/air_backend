export interface AirQualityType {
  iaq?: number;
  confidence?: number;
  staticIaq?: number;
  VOC?: number;
  eCO2?: number;
}

export interface SensorDataType {
  deviceId?: number;
  temp?: number;
  humidity?: number;
  pressure?: number;
  gas?: number;
  airQuality?: AirQualityType;
}
