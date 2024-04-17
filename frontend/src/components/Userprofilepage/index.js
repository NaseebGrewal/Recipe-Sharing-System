import React, { useState, useEffect } from 'react';
import UserInfo from './userinfo';
import Recipelist from './recipelist';
import { useParams } from 'react-router-dom';


const Userprofilepage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(id);
  useEffect(()=>{
    setUserData({id:id})
  },[id])
  return (
    <div>
      <UserInfo user={userData} />
      <Recipelist user={userData} />
    </div>
  );
};

export default Userprofilepage;