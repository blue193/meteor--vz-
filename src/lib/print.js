
export const printDiv = (printpage) => {
  let headstr = "<html><head><title></title></head><body>";
  let footstr = "</body>";
  let newstr = document.all.item(printpage).innerHTML;
  let oldstr = document.body.innerHTML;
  document.body.innerHTML = headstr+newstr+footstr;
  window.print();
  document.body.innerHTML = oldstr;
  location.reload();
  return false;
};
