// import React, { useState } from "react";
// import {
//   ContainerOutlined,
//   DesktopOutlined,
//   // MenuFoldOutlined,
//   // MenuUnfoldOutlined,
//   PieChartOutlined,
// } from "@ant-design/icons";
// import { Button, Menu } from "antd";

import { Layout } from "antd";
import LogoHeadBar from "./LogoHeadBar";
import MenuBar from "./MenuBar";

export default function SideBar({ onMenuSelect, selectedMenu }) {
  return (
    <div className="dark:bg-dark_bg_2 w-14 flex-shrink-0 flex flex-col items-center p-4 gap-10">
      <div className="">
        <LogoHeadBar />
      </div>
      <div className=" h-full flex flex-col items-center justify-between w-[35px]">
        <MenuBar onMenuSelect={onMenuSelect} selectedMenu={selectedMenu} />
      </div>
    </div>
  );
}
