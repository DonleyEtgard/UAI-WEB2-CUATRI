import type { ReactNode } from "react";
import { OnlineStatusIndicator } from "./components/common/OnlineStatusIndicator";

type Props = {
  children: ReactNode;
};

export const AppWrapper = ({ children }: Props) => {
  return (
    <>
      <OnlineStatusIndicator />

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#f8fafc",
        }}
      >
        {children}
      </div>
    </>
  );
};