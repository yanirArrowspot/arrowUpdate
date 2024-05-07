import React from "react";
type DeviceStatus = "QUEUED" | "IN_PROGRESS" | "SUCCEEDED" | "CANCELED";

type DeviceType = {
  thingName: string;
  thingTypeName: string;
  attributes?: { software_version?: string }; // Making this optional as your code suggests it might be undefined
  status: DeviceStatus; // Use the DeviceStatus type here
};

// type Props = { device: any; handleCheckboxChange: any; handleChecked: any };
type Props = {
  device: DeviceType;
  handleCheckboxChange: (thingName: string) => void;
  handleChecked: boolean;
};

const Device = ({ device, handleCheckboxChange, handleChecked }: Props) => {
  const bgColor = {
    QUEUED: "bg-orange-200",
    IN_PROGRESS: "bg-yellow-300",
    SUCCEEDED: "bg-green-400",
    CANCELED: "bg-red-500",
  };
  return (
    <>
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        key={device.thingName}
      >
        <td className="py-2.5 px-4">{device.thingName}</td>
        <td className="py-2.5 px-4  flex  justify-center text-center ">
          {device.thingTypeName}
        </td>
        <td className="py-2.5 px-4 text-center ">
          {device?.attributes?.software_version}
        </td>

        <td className="py-2.5 px-4 justify-center text-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5"
            onChange={() => handleCheckboxChange(device.thingName)}
            checked={handleChecked}
          />
        </td>
        <td>
          {/* <td className={`py-2.5 px-4  ${bgColor[device.status] || "bg-white"}`}> */}
          <p
            className={`py-2.5 px-4 text-white	 ${
              bgColor[device.status] || "bg-white"
            }`}
          >
            {device.status}
          </p>
        </td>
      </tr>
    </>
  );
};

export default Device;
