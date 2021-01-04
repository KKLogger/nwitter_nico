import React from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = React.useState("");
  const [attachment, setAttachment] = React.useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    // storage 에 데이터를 올리기 위해서는 ref 를 생성하고 해당 ref에 데이터를 put합니다.
    // ref 생성
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // put
      const response = await attachmentRef.putString(attachment, "data_url");
      // data url download
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    //event를 로그로 찍었을때 target이 null값 이여도 event.target 을 로그로 찍으면 null값이 아닐수 있다.
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (event) => {
      //reader 의 load가 완료됬는지 확인하는 이벤트 리스너
      const {
        currentTarget: { result },
      } = event;
      setAttachment(result);
    };
    console.log(event.target.src);
  };
  const onClearImage = () => setAttachment("");
  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type={"file"} accept={"image/*"} onChange={onFileChange} />
      <input type={"submit"} value="Nweet" />
      {attachment && (
        <div>
          <img src={attachment} width={"50px"} height={"50px"} />
          <button onClick={onClearImage}>Clear Image</button>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;
