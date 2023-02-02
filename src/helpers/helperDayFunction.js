// função criada pra mantermos um padrão nas datas que forem ser incluída no banco
// dd/mm/yyyy

function helpeData(data) {
  let body = "";
  if (data.getDate() < 10 && data.getMonth() < 10) {
    body =
      `0${data?.getDate()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else if (data.day < 10) {
    body =
      `0${data?.getDate()}/` +
      `${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else if (data.month < 10) {
    body =
      `${data?.getDate()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else if (data.getDate() == 10 && data.getMonth() < 10) {
    body =
      `${data?.getDate()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else if (data.getDate() == 10 && data.getMonth() > 10) {
    body =
      `${data?.getDate()}/` +
      `${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else if (data.getDate() > 10 && data.getMonth() < 10) {
    body =
      `${data?.getDate()}/` +
      `0${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  } else {
    body =
      `${data?.getDate()}/` +
      `${data?.getMonth() + 1}/` +
      `${data?.getFullYear()}`;
  }
  return body;
}

export default helpeData;
