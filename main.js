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
  const doElem = document.getElementById('do');
  const sigunElem = document.getElementById('sigun');

  const doList = Object.keys(regions);
  const randDo = doList[Math.floor(Math.random() * doList.length)];
  const sigunList = regions[randDo];
  const randSigun = sigunList[Math.floor(Math.random() * sigunList.length)];

  doElem.innerText = randDo;
  sigunElem.innerText = randSigun;

  const fullName = randDo + " " + randSigun;

  geocoder.addressSearch(fullName, function (result, status) {
    if (status === kakao.maps.services.Status.OK && result && result.length) {
      const lat = parseFloat(result[0].y);
      const lng = parseFloat(result[0].x);
      const coords = new kakao.maps.LatLng(lat, lng);

      map.panTo(coords);
      map.setLevel(6); // 지역이 잘 보이도록 확대

      if (marker) marker.setMap(null);
      if (circle) circle.setMap(null);

      marker = new kakao.maps.Marker({
        map: map,
        position: coords
      });

      circle = new kakao.maps.Circle({
        center: coords,
        radius: 3000,
        strokeWeight: 3,
        strokeColor: '#FF3DE5',
        strokeOpacity: 1,
        fillColor: '#FF8FE5',
        fillOpacity: 0.7,
        map: map
      });
    } else {
      alert("위치를 찾을 수 없습니다: " + fullName);
    }
  });
}
