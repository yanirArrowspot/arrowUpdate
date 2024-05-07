import React from "react";

type Props = {
  height: string;
  width: string;
  type?: string;
};

const Spinner = ({ height, width, type }: Props) => {
  const spinner = (
    <div className="flex items-center justify-center">
      <div
        className={`inline-block h-${height} w-${width} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );

  const circle = (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-slate-500 animate-spin"></div>
      </div>
    </div>
  );
  return <>{type === "circle" ? circle : spinner}</>;
};

export default Spinner;
