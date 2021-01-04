import React from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import Nweet from "../component/Nweet";
import NweetFactory from "../component/NweetFactory";
const Home = ({ userObj }) => {
  const [nweets, setNweets] = React.useState([]);

  // const getNweets = async () => {
  //   (await dbService.collection("nweets").get()).forEach((document) => {
  //     // setState 함수에서 값이 아닌 함수를 인자로 전달 할 수있다. 이때 함수의 인자로 prev(원래 state에 저장된 값)가 전달된다.
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setNweets((prev) => {
  //       return [nweetObject, ...prev];
  //     });
  //   });
  // };

  React.useEffect(() => {
    //snapshot  은 lisenter 역할을 하면서 collection에 CRUD 가 발생하면 실행됩니다.
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div>
      <div>
        <NweetFactory userObj={userObj} />
        {nweets.map((item) => (
          <Nweet
            key={item.id}
            nweetObj={item}
            isOwner={item.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
