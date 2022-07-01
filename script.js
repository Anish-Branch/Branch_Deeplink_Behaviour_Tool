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
let hmap = [0, 0, 0, 0, 0, 0];

function loadData() {
  getData().then((data) => {
    dataList = data;
    hmap = [0, 0, 0, 0, 0, 0];
    setSelectors(data);
    body.classList.remove("loading");
    button.disabled = true;
  });
}

loadData();

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
    if (hmap[index] === 0) {
      let str = `<option >Please select</option>`;
      selector.innerHTML = str + getStr(uniqueData[index]);
    } else {
      selector.innerHTML = getStr(uniqueData[index]);
    }
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
    hmap[index] = 1;
    startIndex = dataList[index].indexOf(selector.value.split("_").join(" "));
    endIndex = dataList[index].lastIndexOf(selector.value.split("_").join(" "));

    dataList.map((data, index) => {
      dataList[index] = data.slice(startIndex, endIndex + 1);
    });

    setSelectors(dataList);
    if (!hmap.includes(0)) button.disabled = false;
  });
});

button.addEventListener("click", (e) => {
  if (startIndex === endIndex && !hmap.includes(0)) {
    results.forEach((result, index) => {
      result.value = dataList[index + 6][0];
    });
    showInputValues();
    loadData();
  } else {
    body.classList.add("error");
    setTimeout(() => {
      body.classList.remove("error");
    }, 2000);
  }

  e.preventDefault();
});

function showInputValues() {
  let arr = [];
  selectors.forEach((selector) => {
    arr.push(selector.value.split("_").join(" "));
  });
  let str = `Showing results for <b>${arr[0]}</b>(channel), <b>${arr[1]}</b>
  (partner/placement),
  <b>${arr[2]}</b>(platform), <b>${arr[3]}</b>(App Status), <b>${arr[4]}</b>(IDFA Status (source)),
  <b>${arr[5]}</b>(IDFA Status(Client app))`;

  document.querySelector(".current_selected_inputs").innerHTML = str;
}
