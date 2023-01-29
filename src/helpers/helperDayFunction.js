function helpeData(data) {
  let body = "";
  if (data.getDate() < 10 && data.getMonth() < 10) {
    body =
      `${data?.getFullYear()}/` +
      `0${data?.getMonth() + 1}/` +
      `0${data?.getDate()}`;
  } else if (data.day < 10) {
    body =
      `${data?.getFullYear()}/` +
      `${data?.getMonth() + 1}/` +
      `0${data?.getDate()}`;
  } else if (data.month < 10) {
    body =
      `${data?.getFullYear()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getDate()}`;
  } else if (data.getDate() == 10 && data.getMonth() < 10) {
    body =
      `${data?.getFullYear()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getDate()}`;
  } else if (data.getDate() == 10 && data.getMonth() > 10) {
    body =
      `${data?.getFullYear()}/` +
      `${data?.getMonth() + 1}/` +
      `${data?.getDate()}`;
  } else if (data.getDate() > 10 && data.getMonth() < 10) {
    body =
      `${data?.getFullYear()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getDate()}`;
  } else {
    body =
      `${data?.getFullYear()}/` +
      `${data?.getMonth() + 1}/` +
      `${data?.getDate()}`;
  }
  return body;
}

export default helpeData;
