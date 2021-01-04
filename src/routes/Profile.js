import React from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = React.useState(
    userObj.displayName
  );
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    // firestore의 collection에서 필터링을 진행하여 게시물 가져오기
    // order를 하기 위해서 firestore의 데이터를 쿼리로 사용할수 있도록 인덱스 설정을 해주어야 합니다.
    const nweets = await dbService
      .collection("nweets")
      .where("createrId", "==", userObj.uid)
      .orderBy("createAt")
      .get();
  };
  React.useEffect(() => {
    getMyNweets();
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      //firebase에 연결하여 현재 유저에 저장된 displayName을 수정 -> firebase에서는 유저의 값이 수정되었지만
      // 해당 App 에서는 수정되지 않음
      await userObj.updateProfile({ displayName: newDisplayName });
      //setUserObj를 호출
      refreshUser();
      //userObj의 값이 setUserObj로 수정되어 리 렌더링 되어야 하는데 되지 않음 why?
      //->re-rendering은 기존 값과 비교를 통해 값이 수정되었을때 실행됨 -> 큰 Obj의 경우 제대로 비교가 되지 않음
      //해결 -> Obj의 크기를 줄인다 OR Object.assign() 이용
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;

/*
authService 를 사용하여 유저에대해 접근하지 않고 App 부터 userObj를 인자로 넘겨 사용한 이유는
userObj의 값에 변화가 생기면 모든 코드에서 리-렌더링하기 위함입니다.*/
