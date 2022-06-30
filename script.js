const selectors = document.querySelectorAll(".input_select");
const results = document.querySelectorAll(".output_result");
const button = document.getElementById("submit_form");
const body = document.querySelector("body");
async function getData() {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyF0MCPXW8F0PoTWE-Sf37SH-hChwtJHumMxHCMwDCCnb0UE4y06g7K0vCQm0Pb9M1BnA/exec"
  );

  const data = await response.json();

  return data;
}

let dataList;
getData().then((data) => {
  dataList = data;
  setSelectors(data);
  body.classList.remove("loading");
});

function setSelectors(items) {
  const uniqueData = [];

  items.forEach((item) => {
    const rowData = [];

    item.forEach((value) => {
      if (!rowData.includes(value)) rowData.push(value);
    });

    uniqueData.push(rowData);
  });

  selectors.forEach((selector, index) => {
    selector.innerHTML = getStr(uniqueData[index]);
  });
}

function getStr(items) {
  let str = "";
  items.forEach((item) => {
    let temp = item.split(" ").join("_");
    str += `<option value=${temp}>${item}</option>`;
  });

  return str;
}

const selectorsArray = Array.from(selectors);
let startIndex;
let endIndex;
selectors.forEach((selector) => {
  selector.addEventListener("change", (e) => {
    let index = selectorsArray.indexOf(selector);
    startIndex = dataList[index].indexOf(selector.value.split("_").join(" "));
    endIndex = dataList[index].lastIndexOf(selector.value.split("_").join(" "));

    dataList.map((data, index) => {
      dataList[index] = data.slice(startIndex, endIndex + 1);
    });

    setSelectors(dataList);
  });
});

button.addEventListener("click", (e) => {
  if (startIndex === endIndex) {
    results.forEach((result, index) => {
      result.value = dataList[index + 6][0];
    });
  } else {
    body.classList.add("error");
    setTimeout(() => {
      body.classList.remove("error");
    }, 2000);
  }

  e.preventDefault();
});
