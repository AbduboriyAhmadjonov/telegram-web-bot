import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/card/card';
import Cart from './components/cart/cart';
import { getData } from './constants/db';

const courses = getData();

const telegram = window.Telegram.WebApp;

export default function App() {
  const [cartItems, setCartItems] = useState([]);

  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);
    console.log('exist item: ', existItem);

    useEffect(() => {
      telegram.ready();
    });

    if (existItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id ? { ...existItem, quantity: existItem.quantity + 1 } : c
      );
      console.log('Add quantity to existing item: ', newData);
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      console.log('Add item: ', newData);
      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);
    console.log('existItem: ', existItem);
    if (existItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== existItem.id);

      console.log('Remove quantity from existing item: ', newData);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItem.id ? { ...existItem, quantity: existItem.quantity - 1 } : c
      );
      console.log('Remove item: ', newData);
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.BottomButton.text = 'Sotib olish :)';
    telegram.BottomButton.show();
  };

  return (
    <>
      <h1 className="heading">Online kurslar</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {courses.map((course) => (
          <Card
            key={course.id}
            course={course}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          ></Card>
        ))}
      </div>
    </>
  );
}
