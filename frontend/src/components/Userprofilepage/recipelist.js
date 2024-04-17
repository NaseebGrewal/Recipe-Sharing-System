import { Card, Row, Segmented } from 'antd';
import React, { useEffect, useState } from 'react';
import {  ShareAltOutlined, BarsOutlined } from '@ant-design/icons';
import axios from 'axios';

function Recipelist({user}) {
  const { Meta } = Card;
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipelist/${user.id}`);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    };
    fetchData()
  
    }, [user]);

  return (
    <div>
        
      <Card
        title="My Recipes"
       // extra={<Button type='primary' icon={<PlusOutlined />}>Upload New Recipes</Button>}
      >
        <Segmented
          block
          size='large'
          style={{ width: '100%' }}
          options={[
            {
              label: 'Lists',
              value: 'Lists',
              icon: <BarsOutlined />,
            },
            /*{
              label: 'Favourite',
              value: 'Kanban',
              icon: <HeartOutlined />,
            },*/
          ]}
        />
        <Row style={{ justifyContent: 'center' }}>
        {recipes.map((recipe, index) => (
            
  <Card
    key={`${recipe.id}-${index}`} // Combine recipe.id and index to create a unique key
    hoverable
    actions={[
      //<HeartOutlined key="heart" />,
      //<MessageOutlined key="message" />,
      //<EditOutlined key="edit" />,
      <ShareAltOutlined key="share" />,
    ]}
    style={{
      width: '22%',
      margin: '1%',
      borderRadius: 20,
    }}
    cover={
      <img
        alt="example"
        src={recipe.imageurl}
        style={{
          height: '150px',
          objectFit: 'cover',
        }}
      />
    }
  >
    <Meta title={recipe.name} description={recipe.description} />
  </Card>
  
))}

        </Row>
      </Card>
    </div>
  );
}

export default Recipelist;