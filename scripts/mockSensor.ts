import 'dotenv/config';

type AirQualityPayload = {
  iaq: number;
  confidence: number;
  staticIaq: number;
  VOC: number;
  eCO2: number;
};

type SensorPayload = {
  deviceId: number;
  temp: number;
  humidity: number;
  pressure: number;
  gas: number;
  airQuality: AirQualityPayload;
};

export {};

const POINTS_COUNT = Number(process.env.SENSOR_POINTS_COUNT) || 100000;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
const round = (value: number, digits: number) => Number(value.toFixed(digits));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const generateSensorData = (count: number): SensorPayload[] => {
  const data: SensorPayload[] = [];
  let temp = randomBetween(21.7, 22.4);
  let humidity = randomBetween(39.4, 40.8);
  let pressure = randomBetween(993.7, 994.3);
  let gas = Math.round(randomBetween(23800, 25200));

  let iaq = randomBetween(35, 75);
  let staticIaq = iaq + randomBetween(-8, 5);
  let voc = randomBetween(0.2, 0.8);

  for (let i = 0; i < count; i += 1) {
    temp += randomBetween(-0.06, 0.08);
    humidity += randomBetween(-0.14, 0.18);
    pressure += randomBetween(-0.03, 0.03);
    gas += Math.round(randomBetween(-160, 180));

    iaq += randomBetween(-2.5, 3);
    iaq = clamp(iaq, 0, 500);
    staticIaq += randomBetween(-1.8, 2.2);
    staticIaq = clamp(staticIaq, 0, 500);
    /* loosely mirror BSEC eCO2 ~ staticIaq * 10 with small jitter */
    const eCO2 = clamp(round(staticIaq * 10 + randomBetween(-15, 15), 1), 400, 5000);
    voc += randomBetween(-0.04, 0.05);
    voc = clamp(round(voc, 3), 0.05, 12);

    const confidence = i < 8 ? Math.min(3, Math.floor(i / 2)) : Math.random() < 0.88 ? 3 : 2;

    data.push({
      deviceId: Number(process.env.SENSOR_DEVICE_ID) || 2,
      temp: round(temp, 2),
      humidity: round(humidity, 2),
      pressure: round(pressure, 2),
      gas: Math.max(15000, gas),
      airQuality: {
        iaq: round(iaq, 2),
        confidence,
        staticIaq: round(staticIaq, 2),
        VOC: voc,
        eCO2,
      },
    });
  }

  return data;
};

const sensorData = generateSensorData(POINTS_COUNT);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';
const API_URL = process.env.SENSOR_API_URL ?? `http://${host}:${port}/api/sensor`;
const DELAY_MS = 10_000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendMockData = async () => {
  for (const [index, payload] of sensorData.entries()) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseBody = await response.text();
        console.error(
          `Failed #${index + 1}: ${response.status} ${response.statusText} - ${responseBody}`
        );
      } else {
        console.log(`Sent #${index + 1}`, payload);
      }
    } catch (error) {
      console.error(`Request error on #${index + 1}:`, error);
    }

    if (index < sensorData.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('Mock sending completed.');
};

await sendMockData();
