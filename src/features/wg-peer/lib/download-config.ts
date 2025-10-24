import axios from 'axios';

export const downloadConfig = async (peerId: number, peerName: string) => {
  try {
    const res = await axios.get(`/api/peer/${peerId}/config`, {
      responseType: 'blob', // важно, чтобы axios воспринимал ответ как файл
      withCredentials: true, // чтобы cookie для авторизации передались
    });

    // создаём ссылку и скачиваем файл
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${peerName}.conf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании конфига:', error);
    alert('Не удалось скачать конфиг');
  }
};
