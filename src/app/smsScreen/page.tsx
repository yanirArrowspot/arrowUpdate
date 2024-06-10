"use client";

import { useState, ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";
import InputField from "../components/form/input/InputField";
import Image from "next/image";

import logo from "../../../public/logo.png";
import { apiCall } from "@/utils/utilApi";
import Spinner from "../components/spinner/Spinner";

type Props = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
};

export const SMSDashboard = ({ setScreen }: Props) => {
  const [deviceIds, setDeviceIds] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [error, setError] = useState("");
  const [deviceError, setDeviceError] = useState([]);
  const [failedSentSMSTo, setFailedSentSMSTo] = useState([]);
  const [succeedSentSMSTo, setSucceedSentSMSTo] = useState([]);
  console.log("test");
  const handleOnClick = async () => {
    if (
      !command ||
      command.length === 0 ||
      !deviceIds ||
      deviceIds.length === 0
    )
      setFailedSentSMSTo([]);
    setSucceedSentSMSTo([]);
    setDeviceError([]);
    setError("");
    if (deviceIds.length === 0 || !deviceIds) {
      setError("Please enter at least one device");
      return;
    }
    if (!command || command.length === 0) {
      setError("Please enter a valid command");

      return;
    }
    setDisableBtn(true);

    const commandBase64 = btoa(command); // Convert command to Base64

    const data = { deviceIds, command: commandBase64 };

    try {
      const response = await apiCall("/api/sms", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("ress", response);

      if (response.status === 200 || response.success) {
        console.log("wiiiiiiiiiiii");
        console.log({ response });
        console.log(response?.data?.failedFoundSimNumbers);
        if (response?.data?.failedFoundSimNumbers?.length > 0)
          setDeviceError(response?.data?.failedFoundSimNumbers);
        if (response?.data?.deviceFailedSMS?.length > 0)
          setFailedSentSMSTo(response?.data?.deviceFailedSMS);
        if (response?.data?.deviceSucceedSMS?.length > 0)
          setSucceedSentSMSTo(response?.data?.deviceSucceedSMS);
        //   setError(JSON.stringify(response.data.failed));
        // console.log(response.data.failed);
        if (response.status === 401 || response?.data?.status === 401)
          window.location.reload();
        else if (response?.data?.statusCode === 500) {
          setError("Something went wrong. \n please try again later.");
          console.log("in errorrrr");
          console.log();
        }
        console.log("yes");
      } else if (response.status === 401 || response?.data?.status === 401) {
        console.log("lol");
        window.location.reload();
      } else {
        // Handle other errors
        console.error("Error:", response.error?.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      console.log("finally");
      setDisableBtn(false);
    }
    //   handleToast("warning", "Please select device and version");
    //   return;
    // }
    // if (Object.keys(selectedDevices).length === 0) {
    //   handleToast("warning", "Please select device");
    //   return;
    // }
    // if (version.length === 0) {
    //   handleToast("warning", "Please select version");
    //   return;
    // }
    // // return;
    // const devicesToUpdate = setDeviceToUpdate(selectedDevices);
    // if (devicesToUpdate.length === 0) {
    //   handleToast(
    //     "warning",
    //     `An update is already queued for version: ${version}`
    //   );
    //   return;
    // }
    // const date = new Date();
    // const data = {
    //   devices: devicesToUpdate,
    //   version,
    //   creator: email,
    //   date: date.toLocaleString(),
    //   ts: +date,
    // };
    // setDisableBtn(true);
    // // setDisableBtn(false); //for testing
    // // resetState();
    // // return;
    // try {
    //   const response = await apiCall("/api/update/create", {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //   });
    //   if (response.status === 200 || response.success) {
    //     setSelectedDevices({});
    //     // setToastState("success");
    //     setVersion("");
    //     // setIsAllDevicesSelected(false);
    //     handleToast("success", "");
    //   } else if (response.status === 401) {
    //     console.log();
    //   } else {
    //     // Handle other errors
    //     console.error("Error:", response.error?.message);
    //     handleToast(
    //       "danger",
    //       `Something went wrong.\n\n
    //       Please try again later.`
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error during fetch:", error);
    // } finally {
    //   resetState();
    // }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCommand(event.target.value);
  };

  //   const handleOnClick = () => {
  //     console.log(deviceIds);
  //   };

  const handleDeleteFromList = (id: string) => {
    setDeviceIds(deviceIds.filter((deviceId) => deviceId !== id));
  };

  const validateId = (id: string) => {
    const isValid = /^\d{5,8}$/.test(id);
    return isValid;
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setError("");
    const paste = event.clipboardData.getData("text");
    const newDeviceIds = paste
      .split(/\s+/)
      .filter((id) => validateId(id.trim()));
    if (newDeviceIds.length > 0) {
      setDeviceIds([...deviceIds, ...newDeviceIds]);
      setError("");
    } else {
      setError("Please paste only valid number.");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    setError("");

    if (event.key === "Enter") {
      event.preventDefault();
      const newId = (event.target as HTMLTextAreaElement).value.trim();

      if (validateId(newId)) {
        setDeviceIds([...deviceIds, newId]);
        (event.target as HTMLTextAreaElement).value = "";
        setError("");
      } else {
        setError("Please enter a valid number.");
      }
    }
  };

  const deviceErrorList = (
    <>
      <h2 className="my-1 text-lg text-red-600">
        Cannot find SIM numbers for:
      </h2>
      {deviceError.map((dev: any) => {
        return (
          <p key={dev} className="text-red-600">
            {dev}
          </p>
        );
      })}
    </>
  );
  const smsDevicesErrorList = (
    <>
      <h2 className="my-1 text-lg text-red-600">Failed to send SMS to:</h2>
      {failedSentSMSTo.map((dev: any) => {
        return (
          <p key={dev} className="text-red-600">
            {dev}
          </p>
        );
      })}
    </>
  );
  const smsDevicesSucceedList = (
    <>
      <h2 className="my-1 text-lg text-green-700">Successfully sent SMS to:</h2>
      {succeedSentSMSTo.map((dev: any) => {
        return (
          <p key={dev} className="text-green-700">
            {dev}
          </p>
        );
      })}
    </>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="Logo" className="m-4" width={250} />
        <h1 className="text-3xl font-bold mb-2 text-center text-cyan-950">
          ArrowSpot SMS Sender
        </h1>
        <button
          disabled={disableBtn}
          type="button"
          className="mb-2 inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 m-1 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 focus:outline-none focus:ring-0 active:bg-neutral-900"
          onClick={() => setScreen("update")}
        >
          Update Screen
        </button>
      </div>
      <div className="p-6 px-12 flex flex-col lg:flex-row-reverse gap-4 rounded-[7px] border-2 border-gray-300">
        <div className="lg:w-1/3 justify-center">
          <div className="max-w-md">
            <h2 className="text-lg font-bold mb-4">Enter command</h2>
            <div className="relative h-10 w-full min-w-[200px]">
              <input
                onChange={handleOnChange}
                type="text"
                placeholder="Command..."
                className="peer h-full w-72 max-w-80 rounded-[7px] border border-gray-300  bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 shadow-lg shadow-gray-900/5 outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
            {deviceError.length > 0 && deviceErrorList}
            <div className="mt-8">
              {succeedSentSMSTo.length > 0 && smsDevicesSucceedList}
            </div>
            <div className="mt-8">
              {failedSentSMSTo.length > 0 && smsDevicesErrorList}
            </div>
          </div>
        </div>
        <div className="lg:w-2/3">
          <h2 className="text-lg font-bold ">Enter Device IDs</h2>
          <div className="space-y-2 text-lg flex flex-col">
            {deviceIds.map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-300 rounded"
              >
                <span>{id}</span>
                <button
                  onClick={() => handleDeleteFromList(id)}
                  className="ml-2 text-red-500 text-4xl"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              onPaste={handlePaste}
              onKeyDown={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded h-32"
              placeholder="Paste multiple or add and click enter device IDs here"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="flex justify-center mt-4">
            {disableBtn ? (
              <Spinner width="8" height="8" />
            ) : (
              <button
                disabled={disableBtn}
                type="button"
                className="inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 focus:outline-none focus:ring-0 active:bg-neutral-900"
                onClick={handleOnClick}
              >
                Send command
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
