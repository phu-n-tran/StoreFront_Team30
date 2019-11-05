// Remember to change localhost to the EC2 server

const url = "localhost:4000";

export async function registerUser(newUser) {
  let objects = [];
  await fetch(`http://${url}/users/add?email=${newUser.email}` +
    `&password=${newUser.password}&name='${newUser.name}'&cell=${newUser.cell}` +
    `&address='${newUser.address}'`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function getUser(user) {
  let objects = [];
  await fetch(`http://${url}/users?id=${user.accountID}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function loginUser(user) {
  let objects = [];
  await fetch(`http://${url}/users/login?email=${user.email}` +
    `&password=${user.password}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function deleteUser(user) {
  fetch(`http://${url}/users/remove?id=${user.accountID}`)
    .catch((err) => {
      console.error(err);
    });
}

export async function getCards(user) {
  let objects = [];
  await fetch(`http://${url}/cards?id=${user.accountID}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function addCard(data) {
  fetch(`http://${url}/cards/add?id=${data.accountID}` +
    `&cardHolder='${data.cardHolder}'&CVV=${data.CVV}` +
    `&Zip=${data.Zip}&CardNumber=${data.cardNumber}`)
    .catch((err) => {
      console.error(err);
    });
}

export async function deleteCard(data) {
  fetch(`http://${url}/cards/remove?id=${data.accountID}&cardID=${data.cardID}`)
    .catch((err) => {
      console.error(err);
    });
}

export async function getCategory(categoryID) {
  let objects = [];
  const query = !categoryID ? `http://${url}/item/categories` :
    `http://${url}/item?categoryID=${categoryID}`;

  await fetch(`${query}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function getItems(itemID) {
  let objects = [];
  const query = !itemID ? `http://${url}/item` :
    `http://${url}/item?itemID=${itemID}`;
  await fetch(`${query}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function getItemInCategory(itemID, categoryID) {
  let objects = [];
  await fetch(`http://${url}/item?itemID=${itemID}&categoryID=${categoryID}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function addItem(data) {
  fetch(`http://${url}/item/add?name='${data.name}'` +
    `&price='${data.price}'&description='${data.description}'` +
    `&image=${data.image}&categoryID=${data.categoryID}`)
    .catch((err) => {
      console.error(err);
    });
}

export async function removeItem(itemID) {
  fetch(`http://${url}/item/remove?itemID=${itemID}`)
    .catch((err) => {
      console.error(err);
    });
}

export async function getOrders(accountID, orderID) {
  let objects = [];
  const query = !orderID ?
    `http://${url}/orders?id=${accountID}` :
    `http://${url}/orders?id=${accountID}&orderID=${orderID}`;

  await fetch(`${query}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function addOrders(data, accountID) {
  let dataString = JSON.stringify(data);
  let fetchString = `http://${url}/orders/add?items=` +
    dataString + "&accountID=" + accountID;

  fetch(fetchString)
    .catch((err) => {
      console.error(err);
    });
}

export async function getStock(stockID) {
  let objects = [];
  await fetch(`http://${url}/stock?stockID=${stockID}`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}

export async function addStock(data) {
  let objects = [];
  await fetch(`http://${url}/stock/add?itemID=${data.itemID}` +
    `&quantity=${data.quantity}&date='${data.date}'`)
    .then((response) => response.json())
    .then((response) => {
      objects = response;
    })
    .catch((err) => {
      console.error(err);
    });
  return objects;
}