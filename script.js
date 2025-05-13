const championGrid = document.getElementById("championGrid");
const API_KEY = "RGAPI-32c0199c-efb0-4f04-8085-603de799c378";
const API_BASE_URL = "https://europe.api.riotgames.com";
const ICON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/";


document.getElementById("form").addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const gameTag = document.getElementById("gametag").value;

  championGrid.innerHTML = "";
  
  try {
    await getChampionsOfMasteries(username, gameTag);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

async function fetchChampionData() {
  const champions = new Map();
  const jsonFetch = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json"
  );
  const response = await jsonFetch.json();

  for (const champion in response.data) {
    champions.set(
      response.data[champion].key,
      [response.data[champion].image['full'], response.data[champion].name])
  }

  return champions;
}

async function fetchPUUID(username, gameTag) {
  const apiUrl = `${API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${username}/${gameTag}/?api_key=${API_KEY}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.puuid;
}

async function fetchChampionMasteries(username, gameTag) {
  var puuid = await fetchPUUID(username, gameTag);

  const apiUrl = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const response = await fetch(apiUrl);

  return response.json();
}
async function getChampionsOfMasteries(username, gameTag) {
  const mastery = await fetchChampionMasteries(username, gameTag)
  const champions = await fetchChampionData();

  mastery.forEach(element => {
    const champion = champions.get(element['championId'].toString());
    const iconUrl = `${ICON_BASE_URL}${champion[0]}`
    const championDiv = document.createElement("div");
    championDiv.className = "champion";

    let imageStyle = "";
    if(element['championLevel'] < 5){
      imageStyle = "filter: grayscale(100%); opacity: 0.8;";
    }
    championDiv.innerHTML = `
          <img src="${iconUrl}" alt="${champion[1]}" style="${imageStyle}"/>
          <p>${champion[1]}</p>
        `;
    championGrid.appendChild(championDiv);
  });
}
