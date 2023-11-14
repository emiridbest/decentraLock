import React, { useState } from "react";

const Header = () => {
  return (
    <header className="">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex text-2xl p-10 font-bold text-green-500 shrink-0">
          Planq Safe
        </div>
        <nav className="order-3 w-full px-10 sm:order-2 sm:w-auto mt-4 sm:mt-0">
          <ul className="flex flex-wrap text-white gap-5 pl-10 justify-center space-x-1 sm:space-x-6 text-black">
            <li className="cursor-pointer hover:text-green-500">Home</li>
            <li className="cursor-pointer hover:text-green-500">
              Transfer Funds
            </li>
            <li className="cursor-pointer hover:text-green-500">Invest</li>
            <li className="cursor-pointer hover:text-green-500">Reward Hub</li>
            <li className="cursor-pointer hover:text-green-500">Convert </li>
            <li className="cursor-pointer hover:text-green-500">Flex </li>

            <li className="cursor-pointer hover:text-green-500">Savings </li>
            <li className="cursor-pointer hover:text-green-500">Achievements </li>

            <li className="cursor-pointer hover:text-green-500">
              Budget Calculator{" "}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
