import React, { useState, useEffect } from 'react';
import { Card, Avatar, Row, Space, Modal, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Cover from "../Images/cover.webp"
import Chef from "../Images/chef.webp"
import axios from 'axios';

import { useLocation } from 'react-router-dom'

const UserInfo = () => {

  const location = useLocation()
  console.log(location)
  const currentUrl = window.location.href;
  const id = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  const { Meta } = Card;
  const { TextArea } = Input;

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [state, setState] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/authenticate', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Id': id
          },
        })
        .then(response => {
          setIsAuthorized(response.data.success);
        })
        .catch(error => {
          console.error('Token authentication request error:', error);
        });
    }
  }, [id]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      // Handle the response as needed
      setIsModalOpen(false);
      setUserData(response)
      window.location.reload()

    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUrl = window.location.href;
        const id = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

        const response = await fetch(`http://localhost:5000/users/${id}`);
        const responseData = await response.json();
        const userData = {
          id: responseData.id,
          author_id: responseData.author_id,
          author: responseData.author,
          email: responseData.email,
          aboutme: responseData.aboutme
        };
        setUserData(userData);
        setState(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);
  

  return (
    
    <div>
      <Card
        hoverable
        style={{
          //width: 240,
        }}
        cover={
          <img
            alt="example"
            src={state?.coverUrl ? state?.coverUrl : Chef
            }
            style={{
              height: '200px',
              objectFit: 'cover',
            }}
          />
        }
      >
        <Row style={{ justifyContent: 'space-between' }}>
          <Space size="large">
            <Avatar
              style={{
                backgroundColor: '#adff2f',
              }}
              size={90}
              icon={<img alt="loading" src={state?.imgUrl ? state?.imgUrl : Cover
              } />}
            />

            <Meta title={state?.author} description={state?.email} />
          </Space>
          <EditOutlined
            onClick={showModal}
            style={{
              fontSize: '30px',
              pointerEvents: isAuthorized ? 'auto' : 'none',
              color: isAuthorized ? 'blue' : 'grey'
            }}
          />
        </Row>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: 0 }}>About myself</p>
          <span style={{ textAlign: 'justify' }}>{state?.aboutme}</span>
        </div>
      </Card>
      <Modal title="Profile Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          form={form}
          initialValues={{
            username: userData.author,
            email: userData.email,
            'about myself': userData.aboutme,
          }}
        >
          <Form.Item
            label="Full Name"
            name="username"
            rules={[
              {
                required: false,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input
              value={userData.author}
              onChange={(e) => {
                setUserData({ ...userData, author: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: false,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input
              value={userData.email}
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="About Myself"
            name="about myself"
            rules={[
              {
                required: false,
                message: 'Please input something about yourself!',
              },
            ]}
          >
            <TextArea
              value={userData.aboutme}
              rows={5}
              onChange={(e) => {
                setUserData({ ...userData, aboutme: e.target.value });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo;


// import React, { useState, useEffect } from 'react';
// import { Card, Avatar, Row, Space, Button, Modal, Form, Input, Upload } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import Cover from "../Images/cover.webp"
// import Chef from "../Images/chef.webp"

// const UserInfo = ({ user }) => {
//   const { Meta } = Card;
//   const { TextArea } = Input;

//   const [form] = Form.useForm();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [state, setState] = useState({});
//   const [tokenExpired, setTokenExpired] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });
//       // Handle the response as needed
//       setIsModalOpen(false);
//       setUserData(response);
//       window.location.reload();

//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log(userData);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           // Token is not available, redirect to login
//           window.location.href = '/login';
//         } else {
//           // Token is available, decode and check expiration
//           const decodedToken = decodeToken(token);
//           if (decodedToken.exp * 1000 < Date.now()) {
//             // Token has expired
//             setTokenExpired(true);
//           } else {
//             // Token is valid, fetch user data
//             const response = await fetch(`http://localhost:5000/users/${decodedToken.userId}`);
//             const responseData = await response.json();
//             console.log(responseData, "qwertzuio");
//             const userData = {
//               id: responseData.id,
//               author_id: responseData.author_id,
//               author: responseData.author,
//               email: responseData.email,
//               aboutme: responseData.aboutme
//             };
//             setUserData(userData);
//             setState(userData);
//             console.log(userData);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedToken = decodeToken(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           // Token has expired, redirect to login
//           window.location.href = '/login';
//         }
//       }
//     };

//     const intervalId = setInterval(checkTokenExpiration, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//           .join('')
//       );

//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   };

//   if (tokenExpired) {
//     // Token has expired, redirect to login
//     window.location.href = '/login';
//     return null; // Render nothing while redirecting
//   }

//   return (
//     <div>
//       <Card
//         hoverable
//         style={{
//           //width: 240,
//         }}
//         cover={
//           <img
//             alt="example"
//             src={state?.coverUrl ? state?.coverUrl : Chef}
//             style={{
//               height: '200px',
//               objectFit: 'cover',
//             }}
//           />
//         }
//       >
//         <Row style={{ justifyContent: 'space-between' }}>
//           <Space size="large">
//             <Avatar
//               style={{
//                 backgroundColor: '#adff2f',
//               }}
//               size={90}
//               icon={<img alt="loading" src={state?.imgUrl ? state?.imgUrl : Cover} />}
//             />

//             <Meta title={state?.author} description={state?.email} />
//           </Space>
//           <EditOutlined
//             onClick={showModal}
//             style={{
//               fontSize: '30px',
//             }}
//           />
//         </Row>
//         <div>
//           <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: 0 }}>About myself</p>
//           <span style={{ textAlign: 'justify' }}>{state?.aboutme}</span>
//         </div>
//       </Card>
//       <Modal title="Profile Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//         <Form
//           form={form}
//           initialValues={{
//             username: userData.author,
//             email: userData.email,
//             'about myself': userData.aboutme,
//           }}
//         >
//           <Form.Item
//             label="Full Name"
//             name="username"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your username!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.author}
//               onChange={(e) => {
//                 setUserData({ ...userData, author: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your email!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.email}
//               onChange={(e) => {
//                 setUserData({ ...userData, email: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="About Myself"
//             name="about myself"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input something about yourself!',
//               },
//             ]}
//           >
//             <TextArea
//               value={userData.aboutme}
//               rows={5}
//               onChange={(e) => {
//                 setUserData({ ...userData, aboutme: e.target.value });
//               }}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserInfo;














// import React, { useState, useEffect } from 'react';
// import { Card, Avatar, Row, Space, Button, Modal, Form, Input, Upload } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import Cover from "../Images/cover.webp"
// import Chef from "../Images/chef.webp"

// const UserInfo = ({ user }) => {
//   const { Meta } = Card;
//   const { TextArea } = Input;

//   const [form] = Form.useForm();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [state, setState] = useState({});
//   const [tokenExpired, setTokenExpired] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });
//       // Handle the response as needed
//       setIsModalOpen(false);
//       setUserData(response);
//       window.location.reload();

//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log(userData);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           // Token is not available, redirect to login
//           window.location.href = '/login';
//         } else {
//           // Token is available, decode and check expiration
//           const decodedToken = decodeToken(token);
//           if (decodedToken.exp * 1000 < Date.now()) {
//             // Token has expired
//             setTokenExpired(true);
//           } else {
//             // Token is valid, fetch user data
//             const response = await fetch(`http://localhost:5000/users/${decodedToken.userId}`);
//             const responseData = await response.json();
//             console.log(responseData, "qwertzuio");
//             const userData = {
//               id: responseData.id,
//               author_id: responseData.author_id,
//               author: responseData.author,
//               email: responseData.email,
//               aboutme: responseData.aboutme
//             };
//             setUserData(userData);
//             setState(userData);
//             console.log(userData);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedToken = decodeToken(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           // Token has expired, redirect to login
//           window.location.href = '/login';
//         }
//       }
//     };

//     const intervalId = setInterval(checkTokenExpiration, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//           .join('')
//       );

//       const decodedPayload = JSON.parse(jsonPayload);
//       return decodedPayload;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   };

//   if (tokenExpired) {
//     // Token has expired, redirect to login
//     window.location.href = '/login';
//     return null; // Render nothing while redirecting
//   }

//   // Save the decoded payload in a variable
//   const decodedPayload = decodeToken(localStorage.getItem('token'));

//   return (
//     <div>
//       <h2>Decoded Payload: {JSON.stringify(decodedPayload)}</h2>
//       <Card
//         hoverable
//         style={{
//           //width: 240,
//         }}
//         cover={
//           <img
//             alt="example"
//             src={state?.coverUrl ? state?.coverUrl : Chef}
//             style={{
//               height: '200px',
//               objectFit: 'cover',
//             }}
//           />
//         }
//       >
//         <Row style={{ justifyContent: 'space-between' }}>
//           <Space size="large">
//             <Avatar
//               style={{
//                 backgroundColor: '#adff2f',
//               }}
//               size={90}
//               icon={<img alt="loading" src={state?.imgUrl ? state?.imgUrl : Cover} />}
//             />

//             <Meta title={state?.author} description={state?.email} />
//           </Space>
//           <EditOutlined
//             onClick={showModal}
//             style={{
//               fontSize: '30px',
//             }}
//           />
//         </Row>
//         <div>
//           <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: 0 }}>About myself</p>
//           <span style={{ textAlign: 'justify' }}>{state?.aboutme}</span>
//         </div>
//       </Card>
//       <Modal title="Profile Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//         <Form
//           form={form}
//           initialValues={{
//             username: userData.author,
//             email: userData.email,
//             'about myself': userData.aboutme,
//           }}
//         >
//           <Form.Item
//             label="Full Name"
//             name="username"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your username!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.author}
//               onChange={(e) => {
//                 setUserData({ ...userData, author: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your email!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.email}
//               onChange={(e) => {
//                 setUserData({ ...userData, email: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="About Myself"
//             name="about myself"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input something about yourself!',
//               },
//             ]}
//           >
//             <TextArea
//               value={userData.aboutme}
//               rows={5}
//               onChange={(e) => {
//                 setUserData({ ...userData, aboutme: e.target.value });
//               }}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserInfo;
















// import React, { useState, useEffect } from 'react';
// import { Card, Avatar, Row, Space, Button, Modal, Form, Input, Upload } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import Cover from "../Images/cover.webp"
// import Chef from "../Images/chef.webp"

// const UserInfo = ({ user }) => {
//   const { Meta } = Card;
//   const { TextArea } = Input;

//   const [form] = Form.useForm();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [state, setState] = useState({});
//   const [tokenExpired, setTokenExpired] = useState(false);
//   const [username, setUsername] = useState('');

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });
//       // Handle the response as needed
//       setIsModalOpen(false);
//       setUserData(response);
//       window.location.reload();

//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log(userData);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           // Token is not available, redirect to login
//           window.location.href = '/login';
//         } else {
//           // Token is available, decode and check expiration
//           const decodedToken = decodeToken(token);
//           if (decodedToken.exp * 1000 < Date.now()) {
//             // Token has expired
//             setTokenExpired(true);
//           } else {
//             // Token is valid, fetch user data
//             const response = await fetch(`http://localhost:5000/users/${decodedToken.userId}`);
//             const responseData = await response.json();
//             console.log(responseData, "qwertzuio");
//             const userData = {
//               id: responseData.id,
//               author_id: responseData.author_id,
//               author: responseData.author,
//               email: responseData.email,
//               aboutme: responseData.aboutme
//             };
//             setUserData(userData);
//             setState(userData);
//             console.log(userData);

//             // Fetch the username associated with the userId
//             const usernameResponse = await fetch(`http://localhost:5000/users/${decodedToken.userId}/username`);
//             const usernameData = await usernameResponse.json();
//             setUsername(usernameData.username);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedToken = decodeToken(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           // Token has expired, redirect to login
//           window.location.href = '/login';
//         }
//       }
//     };

//     const intervalId = setInterval(checkTokenExpiration, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//           .join('')
//       );

//       const decodedPayload = JSON.parse(jsonPayload);
//       return decodedPayload;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   };

//   if (tokenExpired) {
//     // Token has expired, redirect to login
//     window.location.href = '/login';
//     return null; // Render nothing while redirecting
//   }

//   // Save the decoded payload in a variable
//   const decodedPayload = decodeToken(localStorage.getItem('token'));


//   return (
//     <div>
//       <h2>Decoded Payload: {JSON.stringify(decodedPayload)}</h2>
//       <h2>Username: {username}</h2>
//       <Card
//         hoverable
//         style={{
//           //width: 240,
//         }}
//         cover={
//           <img
//             alt="example"
//             src={state?.coverUrl ? state?.coverUrl : Chef}
//             style={{
//               height: '200px',
//               objectFit: 'cover',
//             }}
//           />
//         }
//       >
//         <Row style={{ justifyContent: 'space-between' }}>
//           <Space size="large">
//             <Avatar
//               style={{
//                 backgroundColor: '#adff2f',
//               }}
//               size={90}
//               icon={<img alt="loading" src={state?.imgUrl ? state?.imgUrl : Cover} />}
//             />

//             <Meta title={state?.author} description={state?.email} />
//           </Space>
//           <EditOutlined
//             onClick={showModal}
//             style={{
//               fontSize: '30px',
//             }}
//           />
//         </Row>
//         <div>
//           <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: 0 }}>About myself</p>
//           <span style={{ textAlign: 'justify' }}>{state?.aboutme}</span>
//         </div>
//       </Card>
//       <Modal title="Profile Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//         <Form
//           form={form}
//           initialValues={{
//             username: userData.author,
//             email: userData.email,
//             'about myself': userData.aboutme,
//           }}
//         >
//           <Form.Item
//             label="Full Name"
//             name="username"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your username!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.author}
//               onChange={(e) => {
//                 setUserData({ ...userData, author: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your email!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.email}
//               onChange={(e) => {
//                 setUserData({ ...userData, email: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="About Myself"
//             name="about myself"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input something about yourself!',
//               },
//             ]}
//           >
//             <TextArea
//               value={userData.aboutme}
//               rows={5}
//               onChange={(e) => {
//                 setUserData({ ...userData, aboutme: e.target.value });
//               }}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserInfo;























// import React, { useState, useEffect } from 'react';
// import { Card, Avatar, Row, Space, Button, Modal, Form, Input, Upload } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import Cover from "../Images/cover.webp"
// import Chef from "../Images/chef.webp"

// const UserInfo = ({ user }) => {
//   const { Meta } = Card;
//   const { TextArea } = Input;

//   const [form] = Form.useForm();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [state, setState] = useState({});
//   const [tokenExpired, setTokenExpired] = useState(false);
//   const [username, setUsername] = useState('');

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

  // const handleOk = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });
  //     // Handle the response as needed
  //     setIsModalOpen(false);
  //     setUserData(response);
  //     window.location.reload();

  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //   }
  // };


// new code between




// const handleOk = async () => {
//   try {
//     if (!userData.id) {
//       console.error('User ID is undefined');
//       return;
//     }

//     const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     if (response.ok) {
//       // Update user data and close the modal
//       const updatedUserData = await response.json();
//       setUserData(updatedUserData);
//       setIsModalOpen(false);
//     } else {
//       console.error('Failed to update user data:', response.status);
//     }
//   } catch (error) {
//     console.error('Error updating user data:', error);
//   }
// };
















// const handleOk = async () => {
//   try {
//     const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });
//     if (response.ok) {
//       // Update user data and close the modal
//       const updatedUserData = await response.json();
//       setUserData(updatedUserData);
//       setIsModalOpen(false);
//     } else {
//       console.error('Failed to update user data:', response.status);
//     }
//   } catch (error) {
//     console.error('Error updating user data:', error);
//   }
// };








// const handleOk = async () => {
//   try {
//     const response = await fetch(`http://localhost:5000/users/${userData.id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });
//     if (response.ok) {
//       // Update user data and close the modal
//       setUserData(userData);
//       setIsModalOpen(false);
//     } else {
//       console.error('Failed to update user data:', response.status);
//     }
//   } catch (error) {
//     console.error('Error updating user data:', error);
//   }
// };

// new code between






//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log(userData);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           // Token is not available, redirect to login
//           window.location.href = '/login';
//         } else {
//           // Token is available, decode and check expiration
//           const decodedToken = decodeToken(token);
//           if (decodedToken.exp * 1000 < Date.now()) {
//             // Token has expired
//             setTokenExpired(true);
//           } else {
//             // Token is valid, fetch user data
//             const response = await fetch(`http://localhost:5000/users/${decodedToken.userId}`);
//             const responseData = await response.json();
//             console.log(responseData, "qwertzuio");
//             const userData = {
//               id: responseData.id,
//               author_id: responseData.author_id,
//               author: responseData.author,
//               email: responseData.email,
//               aboutme: responseData.aboutme
//             };
//             setUserData(userData);
//             setState(userData);
//             console.log(userData);

//             // Fetch the username associated with the userId
//             const usernameResponse = await fetch(`http://localhost:5000/users/${decodedToken.userId}/username`);
//             const usernameData = await usernameResponse.json();
//             setUsername(usernameData.username);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedToken = decodeToken(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           // Token has expired, redirect to login
//           window.location.href = '/login';
//         }
//       }
//     };

//     const intervalId = setInterval(checkTokenExpiration, 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//           .join('')
//       );

//       const decodedPayload = JSON.parse(jsonPayload);
//       return decodedPayload;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   };

//   if (tokenExpired) {
//     // Token has expired, redirect to login
//     window.location.href = '/login';
//     return null; // Render nothing while redirecting
//   }

//   // Save the decoded payload in a variable
//   const decodedPayload = decodeToken(localStorage.getItem('token'));


//   return (
//     <div>
//       <h2>Decoded Payload: {JSON.stringify(decodedPayload)}</h2>
//       <h2>Username: {username}</h2>
//       <Card
//         hoverable
//         style={{
//           //width: 240,
//         }}
//         cover={
//           <img
//             alt="example"
//             src={state?.coverUrl ? state?.coverUrl : Chef}
//             style={{
//               height: '200px',
//               objectFit: 'cover',
//             }}
//           />
//         }
//       >
//         <Row style={{ justifyContent: 'space-between' }}>
//           <Space size="large">
//             <Avatar
//               style={{
//                 backgroundColor: '#adff2f',
//               }}
//               size={90}
//               icon={<img alt="loading" src={state?.imgUrl ? state?.imgUrl : Cover} />}
//             />

//             <Meta title={state?.author} description={state?.email} />
//           </Space>
//           <EditOutlined
//             onClick={showModal}
//             style={{
//               fontSize: '30px',
//             }}
//           />
//         </Row>
//         <div>
//           <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: 0 }}>About myself</p>
//           <span style={{ textAlign: 'justify' }}>{state?.aboutme}</span>
//         </div>
//       </Card>
//       <Modal title="Profile Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//         <Form
//           form={form}
//           initialValues={{
//             username: userData.author,
//             email: userData.email,
//             'about myself': userData.aboutme,
//           }}
//         >
//           <Form.Item
//             label="Full Name"
//             name="username"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your username!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.author}
//               onChange={(e) => {
//                 setUserData({ ...userData, author: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input your email!',
//               },
//             ]}
//           >
//             <Input
//               value={userData.email}
//               onChange={(e) => {
//                 setUserData({ ...userData, email: e.target.value });
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="About Myself"
//             name="about myself"
//             rules={[
//               {
//                 required: false,
//                 message: 'Please input something about yourself!',
//               },
//             ]}
//           >
//             <TextArea
//               value={userData.aboutme}
//               rows={5}
//               onChange={(e) => {
//                 setUserData({ ...userData, aboutme: e.target.value });
//               }}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserInfo;

