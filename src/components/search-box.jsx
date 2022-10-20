import React, { useCallback, useEffect, useState } from "react";
import getUserInfo from "../api/get-user-info";

export default function SearchBox() {
  const [userInfo, setUserInfo] = useState(null);
  const [filteredUserInfo, setFilteredUserInfo] = useState(null);
  const [itemInFocus, setItemInFocus] = useState(null);
  const [scrollRef, setScrollRef] = useState(null);

  useEffect(() => {
    (() =>
      scrollRef?.[itemInFocus]?.current.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      }))();
  }, [scrollRef, itemInFocus]);

  const mouseOverListener = useCallback((e) => {
    const userInfoElementDiv = e.target;
    const userInfoElementIdx = userInfoElementDiv?.id;
    if (userInfoElementIdx !== "") {
      setItemInFocus((prev) => +userInfoElementIdx);
    }
  }, []);

  const ArrowKeyListener = useCallback(
    (e) => {
      if (e.code === "ArrowUp") {
        setItemInFocus((prev) => {
          return prev === null
            ? 0
            : prev <= 0
            ? filteredUserInfo.length - 1
            : prev - 1;
        });
      }
      if (e.code === "ArrowDown") {
        setItemInFocus((prev) => {
          const newVal =
            prev === null
              ? 0
              : prev >= filteredUserInfo.length - 1
              ? 0
              : prev + 1;
          return newVal;
        });
      }
    },
    [itemInFocus]
  );

  useEffect(() => {
    async function fetchData() {
      const _userInfo = await getUserInfo();

      setUserInfo(_userInfo);
      const _scrollIntoView = _userInfo.reduce((acc, item, idx) => {
        acc[idx] = React.createRef();
        return acc;
      }, {});
      setScrollRef(_scrollIntoView);
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
    <div>
      <label htmlFor="userSearch">Search User:</label>
      <div className="search-container">
        <input
          className="search-input"
          type="search"
          id="userSearch"
          onChange={handleChange()}
        />
        <ul>
          {filteredUserInfo?.map((info, idx) => {
            return (
              <li
                tabIndex={0}
                id={idx}
                key={info.id}
                className={
                  itemInFocus === idx
                    ? "focus-user-info user_info_field"
                    : "user_info_field"
                }
                ref={scrollRef[idx]}
                onKeyDown={(e) => {
                  e.nativeEvent.stopImmediatePropagation();
                  ArrowKeyListener(e);
                }}
                onMouseMove={(e) => {
                  mouseOverListener(e);
                }}
              >
                <span>
                  UserName:{info.first_name} {info.last_name}
                </span>
                <span>; Address:{info.address}</span>
                <span>; Email:{info.email}</span>
                <span>; Gender:{info.gender}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
