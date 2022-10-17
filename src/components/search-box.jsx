import React, { useEffect, useState } from "react";
import getUserInfo from "../api/get-user-info";

export default function SearchBox() {
  const [userInfo, setUserInfo] = useState(null);
  const [filteredUserInfo, setFilteredUserInfo] = useState(null);
  const [itemInFocus, setItemInFocus] = useState(null);

  const mouseOverListener = (e) => {
    const userInfoElementDiv = e.target?.parentElement?.parentElement;
    const userInfoElementIdx = userInfoElementDiv?.id;
    if (userInfoElementIdx !== "") {
      setItemInFocus((prev) => +userInfoElementIdx);
    }
  };

  const ArrowKeyListener = (e) => {
    if (e.code === "ArrowUp") {
      setItemInFocus((prev) => {
        return prev === null
          ? 0
          : prev === 0
          ? filteredUserInfo.length - 1
          : prev - 1;
      });
    }
    if (e.code === "ArrowDown") {
      setItemInFocus((prev) =>
        prev === null ? 0 : prev === filteredUserInfo.length - 1 ? 0 : prev + 1
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      const _userInfo = await getUserInfo();

      setUserInfo(_userInfo);
    }

    fetchData();
  }, []);

  function handleChange() {
    return (e) => {
      const searchString = e.target.value.toLowerCase();
      if (searchString.trim() !== "") {
        let filteredData = userInfo.map((info) => {
          const _filteredUserInfo = Object.entries(info).filter(
            ([propKey, value], key) => {
              if (
                String(value).toLowerCase().includes(searchString) &&
                key === "gender"
              ) {
                return false;
              }
              return String(value).toLowerCase().includes(searchString);
            }
          );
          if (_filteredUserInfo.length) {
            return info;
          }
          return null;
        });

        filteredData = filteredData.filter((data) => data !== null);
        setFilteredUserInfo(filteredData);
      }
    };
  }
  return (
    <div tabIndex="1" onKeyDown={(e) => ArrowKeyListener(e)}>
      <label htmlFor="userSearch">Search User:</label>
      <div className="search-container">
        <input
          tabIndex="2"
          className="search-input"
          type="search"
          id="userSearch"
          onChange={handleChange()}
        />
        <div tabIndex="3">
          {filteredUserInfo?.map((info, idx) => {
            return (
              <div
                id={idx}
                key={info.id}
                className="user_info_field"
                onMouseOver={(e) => mouseOverListener(e)}
              >
                <div className={itemInFocus === idx ? "focus-user-info" : null}>
                  <span>
                    UserName:{info.first_name} {info.last_name}
                  </span>
                  <span>; Address:{info.address}</span>
                  <span>; Email:{info.email}</span>
                  <span>; Gender:{info.gender}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
