export const messageFormatter = (command, identifier, data = {}) => {
  const message = {
    command,
    identifier: JSON.stringify(identifier),
  };

  if (Object.keys(data).length > 0) message.data = JSON.stringify(data);
  return JSON.stringify(message);
}

export const dataFilter = (filterFn, data) => {
  if (data) {
    const { message, type } = data;
    const identifier = data?.identifier ? JSON.parse(data.identifier) : null;
    if (identifier && filterFn({ message, type, identifier })) return data;
  }
};

export const serverMessageFilter = (filterFn, serverMessage) => {
  const data = serverMessage?.data && JSON.parse(serverMessage?.data);
  return dataFilter(filterFn, data);
};
