import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import BasicRouter from "./BasicRouter";
function App() {
  /*user account 를 생성하여도 로그인 페이지에서 벗어 나지 못한다 -> authService의 currentUser 값을 바로 불러오면
    null 값을 가지기 때문이다 -> firebase가 로딩 되기 전에 호출해서 그럼으로 기다려 줘야 한다.*/
  //firebase가 initialize 되었는지 확인하는 변수 ->  useEffect를 통해 확인
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //onAuthStateChanged 는 AuthState의 변화를 확인하여 유저의 로그인 현황을 observe 할 수 있다.
      // firebase가 initialize 되고 나서 실행되므로 로그인이 안된 상태와 된 상태를 구분가능
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          //dictionary 로 함수 전달하기
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      //dictionary 로 함수 전달하기
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <BasicRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing firebase..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
