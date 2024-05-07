"use-client";

import { create } from "zustand";
import { loadState, saveState } from "./storePersistence";

type UserStore = {
  user: {
    email: string;
  };
  setUser: (email: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: (typeof window !== "undefined" &&
    loadState<{ email: string }>("user")) || { email: "" },
  setUser: (email: string) => {
    set({ user: { email } });
    if (typeof window !== "undefined") saveState("user", { email });
  },
}));

// type Device = {
//   id: string;
//   name: string;
//   // Add more device properties here if needed
// };

type DevicesStore = {
  devices: any[];
  selectedDevices: Record<string, boolean>;
  setDevices: (devices: any[]) => void;
  setSelectedDevices: (
    selectedDevices: // Define the setSelectedDevices method within the store's state.
    // It accepts a parameter that can be either a direct state object or a function for deriving state from the previous state.
    | Record<string, boolean>
      | ((prevState: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
};

export const useDevicesStore = create<DevicesStore>((set, get) => ({
  devices: [],
  selectedDevices: {},
  setDevices: (devices) => {
    set({ devices });
  },
  setSelectedDevices: (selectedDevices) => {
    // If selectedDevices is a function, use it to calculate the new state based on the old state
    const newState =
      typeof selectedDevices === "function" // If it's a function, call it with the current state to get the new state.
        ? selectedDevices(get().selectedDevices)
        : selectedDevices; // If it's not a function, use the object directly as the new state.
    set({ selectedDevices: newState });
  },
}));

type StateProperties = {
  email: string;
  password: string;
  otp: string;
};

type errorMessagesValidationStore = StateProperties & {
  setErrorMessage: (key: string, errorMessage: string) => void;
  getErrorMessages: (key: string) => string | undefined;
  clearErrorMessages: () => void;
};

export const useErrorMessagesValidationStore =
  create<errorMessagesValidationStore>((set, get) => ({
    email: "",
    password: "",
    "new password": "",
    otp: "",

    setErrorMessage: (key: string, errorMsg: string) => {
      set((state) => ({ ...state, [key]: errorMsg }));
    },
    getErrorMessages: (key: string) => {
      const state = get();
      // Ensure that we're accessing only the properties of the state, not methods
      return (state as any)[key] ?? "Something went wrong";

      // else {
      //   return undefined; // or provide a default value
      // }
    },
    clearErrorMessages: () => {
      set({ email: "", password: "", otp: "" });
    },
  }));

// type dialogStore = {
//   dialogState:boolean,

//   setUser: (email: string) => void;
// };

// export const useDialogStore = create<UserStore>((set) => ({
//   user: (typeof window !== "undefined" &&
//     loadState<{ email: string }>("user")) || { email: "" },
//   setUser: (email: string) => {
//     set({ user: { email } });
//     if (typeof window !== "undefined") saveState("user", { email });
//   },
// }));
