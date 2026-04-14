import 'dotenv/config';

type SensorPayload = {
  temp: number;
  humidity: number;
  pressure: number;
  gas: number;
};

export {};

const POINTS_COUNT = Number(process.env.SENSOR_POINTS_COUNT) || 100000;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
const round = (value: number, digits: number) => Number(value.toFixed(digits));

const generateSensorData = (count: number): SensorPayload[] => {
  const data: SensorPayload[] = [];
  let temp = randomBetween(21.7, 22.4);
  let humidity = randomBetween(39.4, 40.8);
  let pressure = randomBetween(993.7, 994.3);
  let gas = Math.round(randomBetween(23800, 25200));

  for (let i = 0; i < count; i += 1) {
    temp += randomBetween(-0.06, 0.08);
    humidity += randomBetween(-0.14, 0.18);
    pressure += randomBetween(-0.03, 0.03);
    gas += Math.round(randomBetween(-160, 180));

    data.push({
      temp: round(temp, 2),
      humidity: round(humidity, 2),
      pressure: round(pressure, 2),
      gas: Math.max(15000, gas),
    });
  }

  return data;
};

const sensorData = generateSensorData(POINTS_COUNT);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';
const API_URL = process.env.SENSOR_API_URL ?? `http://${host}:${port}/api/sensor`;
const DELAY_MS = 10_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
