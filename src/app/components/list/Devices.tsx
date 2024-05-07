"use-client";
import React, { useState, useEffect } from "react";
import Device from "./Device";
import { useDevicesStore } from "@/store/store";

type Props = {
  devices: any[];
  selectedDevices: any;
  handleCheckboxChange: any;
};

const Devices = ({ devices, selectedDevices, handleCheckboxChange }: Props) => {
  return (
    <>
      {devices.map((device: any) => (
        <Device
          device={device}
          key={device.thingName}
          handleCheckboxChange={handleCheckboxChange}
          handleChecked={selectedDevices[device.thingName] || false}
        />
      ))}
    </>
  );
};

export default Devices;
