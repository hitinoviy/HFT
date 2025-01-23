const fetchData = async () => {
  try {
    const response = await fetch('projectData/data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
};

const getData = async () => {
  const data = await fetchData();
  return data;
};

export default getData;
