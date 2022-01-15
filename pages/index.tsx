import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { config } from '../config';
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import socketIOClient, { Socket } from 'socket.io-client';
import { generateUsername } from 'username-generator';

// console.log("config.ENDPOINT!", config.ENDPOINT!);

let socket: Socket;

const Home: NextPage = () => {

  const [deviceData, setDeviceData] = useState<any[]>([])

  useEffect(() => {
    // Set the socket
    socket = socketIOClient(config.ENDPOINT!)
    console.log("Called for socket connection");
    // console.log("socket", socket);
    socket.emit("CONNECT_USER", { user: generateUsername() });
  }, []);

  useEffect(() => {

    socket.on("USERS", ({ users }: any) => {
      console.log("Users", users);
    })

    socket.on("DEVICE_DATA", ({ data }: any) => {
      // console.log(data);
      setDeviceData((prevData) => [...prevData, data])
    });

    socket.on("LEAVE_USER", (user: any, reason: any) => {
      // console.log(user);
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
    });
  }, [socket]);


  console.log("deviceData", deviceData);


  if (deviceData.length > 0) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Smart charging station | IOT final project</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Smart Charging Station!
          </h1>

          <div className={styles.grid}>
            {
              deviceData?.map((data, key) => {
                const {
                  device,
                  chargingStationName,
                  chargingStationLocation,
                  chargingStationPorts
                } = data;
                const {
                  checkIn,
                  checkOut,
                  portNumber,
                  portAddress,
                  charging,
                  totalChargingTime
                } = chargingStationPorts;

                return (
                  <a href="https://nextjs.org/docs" className={styles.card}>
                    <h2>{device} &rarr;</h2>
                    <p>Charging station: ${chargingStationName}.</p>
                    <p>Location: {chargingStationLocation}.</p>
                    <p>Charging point details:
                      <p>Starting time: {new Date(checkIn).toLocaleString()}</p>
                      <p>Ending time: {new Date(checkOut).toLocaleString()}</p>
                      <p>Point Number: {portNumber}</p>
                      <p>Charging: {charging}</p>
                    </p>
                  </a>
                )
              })
            }

          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://smartchargingstation.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <Head>
          <title>Smart charging station | IOT final project</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Smart Charging Station!
          </h1>

          <div className={styles.grid}>
            <a href="https://smartchargingstation.vercel.app" className={styles.card}>
              <h2>Data not found &rarr;</h2>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://smartchargingstation.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    )
  }


}

export default Home
