// main.js
let map, geocoder, marker, circle;

window.onload = function () {
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: new kakao.maps.LatLng(36.5, 127.5),
    level: 13
  };

  map = new kakao.maps.Map(mapContainer, mapOption);
  geocoder = new kakao.maps.services.Geocoder();

  document.getElementById('spinBtn').addEventListener('click', spin);
};

function spin() {
  showLoading();
  const doElem = document.getElementById('do');
  const sigunElem = document.getElementById('sigun');

  const doList = Object.keys(regions);
  const randDo = doList[Math.floor(Math.random() * doList.length)];
  const sigunList = regions[randDo];
  const randSigun = sigunList[Math.floor(Math.random() * sigunList.length)];

  doElem.innerText = randDo;
  sigunElem.innerText = randSigun;

  const fullName = randDo + " " + randSigun;
  sendToGPT(randDo, randSigun)
  geocoder.addressSearch(fullName, function (result, status) {
    if (status === kakao.maps.services.Status.OK && result && result.length) {
      const lat = parseFloat(result[0].y);
      const lng = parseFloat(result[0].x);
      const coords = new kakao.maps.LatLng(lat, lng);

      //map.panTo(coords);
      map.setLevel(13); // 지역이 잘 보이도록 확대

      if (marker) marker.setMap(null);
      if (circle) circle.setMap(null);

      marker = new kakao.maps.Marker({
        map: map
        //position: coords
      });

      circle = new kakao.maps.Circle({
        center: coords,
        radius: 3000,
        strokeWeight: 3,
        strokeColor: '#FF3DE5',
        strokeOpacity: 1,
        fillColor: '#FF8FE5',
        fillOpacity: 1,
        map: map
      });
    } else {
      alert("위치를 찾을 수 없습니다: " + fullName);
    }
  });
  
}

async function sendToGPT(randDo, randSigun) {
  const el = document.getElementById('gptResult');
  el.textContent = "GPT 추천을 불러오는 중...";

  if (!window.askGPT) {
    el.textContent = "chat.js(askGPT)가 로드되지 않았습니다.";
    return;
  }

  try {
    const fullName = `${randDo} ${randSigun}`;
    const content = await window.askGPT({
      prompt: `
당신은 한국 여행 큐레이터입니다.
지역: ${fullName}
요청: 3시간 안에 가볍게 즐길 수 있는 명소 3곳과 대표 먹거리 3가지를, 한 줄 설명과 함께 추천해 주세요. 먹거리는 가게도 추천해 주세요.
형식:
[관광지]
1) ...
2) ...
3) ...
[먹거리]
1) ...
2) ...
3) ...
`
    });

    // 문자열을 HTML로 변환
    el.innerHTML = formatGPTResponse(content);

  } catch (e) {
    hideLoading();
    console.error(e);
    el.textContent = "GPT 추천을 불러오지 못했습니다.\n" + e.message;
  }
}

// GPT 응답 문자열 → HTML 변환 함수
function formatGPTResponse(text) {
  hideLoading();
  let html = "";
  const sections = text.split(/\[(.*?)\]/g); 
  // → ["", "관광지", "\n1) ...", "먹거리", "\n1) ..."]

  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].trim();
    const body = sections[i + 1].trim();

    const items = body.split(/\d+\)\s*/).filter(Boolean); 
    // ["장소 - 설명", "장소 - 설명", ...]

    html += `<h4>${title}</h4><ul>`;
    for (const item of items) {
      html += `<li>${item.trim()}</li>`;
    }
    html += "</ul>";
  }
  return html;
};

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

