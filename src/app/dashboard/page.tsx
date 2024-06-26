"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "../components/spinner/Spinner";
import Toast from "../components/toast/Toast";
import Dialog from "../components/dialog/Dialog";
import Devices from "../components/list/Devices";
import { useDevicesStore, useUserStore } from "@/store/store";
import logo from "../../../public/logo.png";
import { apiCall } from "@/utils/utilApi";

export default function Dashboard() {
  const router = useRouter();
  const { email } = useUserStore((state) => state.user);
  const { devices, setDevices, selectedDevices, setSelectedDevices } =
    useDevicesStore((state) => state);

  const [version, setVersion] = useState("");
  const [toastState, setToastState] = useState("");
  const [toastText, setToastText] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [versions, setVersions] = useState([]);
  const [isAllDevicesSelected, setIsAllDevicesSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [screen, setScreen] = useState("update");

  // SMS states
  const [deviceIds, setDeviceIds] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const [deviceError, setDeviceError] = useState([]);
  const [failedSentSMSTo, setFailedSentSMSTo] = useState([]);
  const [succeedSentSMSTo, setSucceedSentSMSTo] = useState([]);

  type ApiResponse = {
    success: boolean;
    data?: {
      body?: {
        [key: string]: any; // Assuming 'body' is an object with unknown structure
      };
    };
  };

  const fetchAllJobs = async (things: []) => {
    try {
      // const response = await fetch("/api/update/status", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      // });
      const response = (await apiCall("/api/update/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })) as ApiResponse;

      if (response.success) {
        // setDevices2(result.thingStatusJobs);

        const devicesWithStatus = [...things];
        const thingsWithJobs: any = response?.data?.body;
        devicesWithStatus.forEach((device: any) => {
          for (const thing in thingsWithJobs) {
            if (device?.thingName === thing)
              device["status"] = thingsWithJobs[thing];
          }
        });

        setDevices(devicesWithStatus);
      } else {
        // Handle errors
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    // Handle response
  };

  const fetchAllDevices = useCallback(async () => {
    try {
      // const response = await fetch("/api/devices", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      // });
      const response: any = await apiCall("/api/devices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = "";
      // const result = await response.json();
      if (response.success) {
        // setDevices(result.body.things);
        await fetchAllJobs(response?.data.body.things);
        setVersions(response?.data?.body.versions);
        // setDevicesToDisplay(result.body.things);
      } else {
        // Handle errors
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    // Handle response
  }, []);

  useEffect(() => {
    fetchAllDevices();
  }, [fetchAllDevices]);

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
      const response = (await apiCall("/api/sms", {
        method: "POST",
        body: JSON.stringify(data),
      })) as any;
      console.log("ress", response);

      if (response?.status === 200 || response.success) {
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
  const handleSMSScreen = () => {
    setScreen("sms");
  };

  const resetState = () => {
    setSelectedDevices({});
    setVersion("");
    setIsAllDevicesSelected(false);
    setDisableBtn(false);
  };
  const resetSMSState = () => {
    setDeviceIds([]);
    setCommand("");
    setError("");
    setDeviceError([]);
    setFailedSentSMSTo([]);
    setSucceedSentSMSTo([]);
  };

  const handleCloseDialog = () => {
    setShowModal(false);
    resetState();
  };

  const handleToast = (toastState: string, toastText: string) => {
    setToastState(toastState);
    setToastText(toastText);
    setTimeout(() => {
      setToastState("");
      setToastText("");
      setDisableBtn(false);
    }, 6000);
  };

  const filterSelectedDevices = () => {
    const devices = selectedDevices;
    for (const key in devices) {
      if (!devices[key]) delete devices[key];
    }
    setSelectedDevices(devices);
  };

  const handleOnUpdateDevices = async () => {
    if (Object.keys(selectedDevices).length === 0 && version.length === 0) {
      handleToast("warning", "Please select device and version");
      return;
    }

    if (Object.keys(selectedDevices).length === 0) {
      handleToast("warning", "Please select device");
      return;
    }
    if (version.length === 0) {
      handleToast("warning", "Please select version");
      return;
    }

    const setDeviceToUpdate = (selectedDevices: Record<string, boolean>) => {
      const devicesToUpdate: any[] = [];

      devices.forEach((device) => {
        if (
          selectedDevices.hasOwnProperty(device.thingName) &&
          device?.attributes?.target_software_version !== version
        ) {
          devicesToUpdate.push(device.thingArn);
        }
      });

      return devicesToUpdate;
    };
    const devicesToUpdate = setDeviceToUpdate(selectedDevices);
    if (devicesToUpdate.length === 0) {
      handleToast(
        "warning",
        `An update is already queued for version: ${version}`
      );
      return;
    }
    const date = new Date();
    const data = {
      devices: devicesToUpdate,
      version,
      creator: email,
      date: date.toLocaleString(),
      ts: +date,
    };
    setDisableBtn(true);
    // setDisableBtn(false); //for testing
    // resetState();

    // return;

    try {
      const response = await apiCall("/api/update/create", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.status === 200 || response.success) {
        setSelectedDevices({});
        // setToastState("success");
        setVersion("");
        // setIsAllDevicesSelected(false);
        handleToast("success", "");
      } else if (response.status === 401) {
        console.log();
      } else {
        // Handle other errors
        console.error("Error:", response.error?.message);
        handleToast(
          "danger",
          `Something went wrong.\n\n
          Please try again later.`
        );
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      resetState();
    }
  };

  const handleSelectAllDevices = () => {
    const selectedAll: any = {};

    if (!isAllDevicesSelected) {
      for (const device of devices) {
        const thingName = device.thingName;
        selectedAll[thingName] = true;
      }
      setSelectedDevices(selectedAll);
    } else {
      setSelectedDevices({});
    }
    setIsAllDevicesSelected((prev) => !prev);
  };

  const handleCheckboxChange = (deviceId: string) => {
    setSelectedDevices((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  const handleOnUpdateButtonSubmit = () => {
    const condition =
      Object.keys(selectedDevices).length === devices.length &&
      isAllDevicesSelected &&
      version;

    if (condition) {
      setShowModal(true);
    } else if (!condition) {
      filterSelectedDevices();
      handleOnUpdateDevices();
    }

    // return;
  };

  const dialog = (
    <Dialog
      onClose={handleCloseDialog}
      onSubmit={handleOnUpdateDevices}
      title="Warning"
    >
      <p className="text-lg text-gray-600 text-center">
        Are you sure you want to update all devices to version: {version} ?
      </p>
    </Dialog>
  );

  const dashboard = (
    <>
      {showModal ? dialog : null}
      <Image src={logo} alt="Logo" className="mb-2 ml-16 w-1/5" priority />
      <button
        disabled={disableBtn}
        type="button"
        className="inline-block rounded bg-neutral-800 px-6 pb-2 m-1 pt-2.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 hover:shadow-dark-2 focus:bg-neutral-700 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-dark-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        onClick={handleSMSScreen}
      >
        SMS Screen
      </button>
      <Toast toastState={toastState} toastText={toastText} />
      <h1 className="text-2xl font-bold p-4">All devices</h1>
      <div
        className="flex w-full max-w-screen-2xl space-x-4 max-h-[calc(95%-10rem)]"
        // style={{ border: "1px solid red" }}
      >
        {/* Wrap the table with a div that controls the overflow */}
        <div className="relative w-11/12 max-w-screen-2xl max-h-[800px] overflow-auto shadow-lg rounded">
          {/* <div className="relative w-11/12 max-w-screen-2xl max-h-screen overflow-auto shadow-lg rounded"> */}
          {/* <div className="relative w-10/12 max-w-7xl max-h-[calc(100%-10rem)] overflow-auto shadow-lg rounded"> */}
          <table className="w-full text-left text-gray-500 dark:text-gray-400">
            <thead className="text-lg bg-slate-500 sticky top-0 text-gray-50 uppercase bottom-shadow h-20">
              <tr className="h-full">
                <th scope="col" className="py-3 px-4">
                  Device
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Type
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Version
                </th>
                <th scope="col" className="px-6 text-center relative h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    Select
                  </div>
                  <input
                    type="checkbox"
                    className="form-checkbox   h-5 w-5 mt-4 justify-self-end -bottom-1 text-center absolute -translate-x-1/2 -translate-y-1/2"
                    onChange={() => handleSelectAllDevices()}
                    checked={isAllDevicesSelected}
                  />
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Your device rows */}
              <Devices
                devices={devices}
                selectedDevices={selectedDevices}
                handleCheckboxChange={handleCheckboxChange}
              />
            </tbody>
          </table>
        </div>

        {/* Version selector */}
        <div className="min-w-36 max-w-48 max-h-80 flex flex-col">
          {/* <div className="w-1/6 max-w-48 max-h-80 flex bg-cyan-100"> */}
          {versions && (
            <div className="flex flex-col mb-4 ">
              <p>Select version</p>
              <select
                name=""
                id=""
                onChange={(e) => setVersion(e.target.value)}
                value={version}
              >
                <option value="" defaultChecked></option>
                {versions.map((ver: any) => {
                  const version = ver?.Key.split("/")[2];
                  return (
                    <option value={version} key={ver}>
                      {version}
                    </option>
                  );
                })}
                {/* <option value="2002">2002</option>
              <option value="2004">2004</option> */}
                {/* <option value="3">3</option> */}
              </select>
            </div>
          )}
          <div className="flex flex-col ">
            {disableBtn ? (
              <Spinner width="8" height="8" />
            ) : (
              <button
                disabled={disableBtn}
                type="button"
                className="inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 hover:shadow-dark-2 focus:bg-neutral-700 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-dark-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                onClick={handleOnUpdateButtonSubmit}
              >
                Update devices
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const smsSection = (
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
                value={command}
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
              <div className="flex flex-col gap-4">
                <button
                  disabled={disableBtn}
                  type="button"
                  className="inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 focus:outline-none focus:ring-0 active:bg-neutral-900"
                  onClick={handleOnClick}
                >
                  Send command
                </button>
                <button
                  disabled={disableBtn}
                  type="button"
                  className="inline-block rounded bg-slate-400 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-0 active:bg-neutral-900"
                  onClick={resetSMSState}
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {screen === "update" ? (
        <div className="flex flex-col items-center p-6 pb-8 h-screen">
          {devices?.length === 0 && versions?.length === 0 ? (
            <Spinner height="12" width="12" type="circle" />
          ) : (
            dashboard
          )}
        </div>
      ) : (
        smsSection
      )}
    </>
  );
}
