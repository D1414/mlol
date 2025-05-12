const championGrid = document.getElementById("championGrid");
// Riot Games API constants
const API_KEY = "RGAPI-ee158dc7-30d9-41fb-a6e1-0499a265812d";
const USERNAME = "odnamra";
const GAME_TAG = "euw";
const API_BASE_URL = "https://europe.api.riotgames.com";
const ICON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/";

// Function to fetch champion data
async function fetchChampionData() {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json");
  console.log(response);
  return response.json();
}

// Function to fetch PUUID
async function fetchPUUID(username, gameTag) {
  const apiUrl = `${API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${username}/${gameTag}/?api_key=${API_KEY}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data.puuid)
  return data.puuid;
}

// Function to fetch champion masteries
async function fetchChampionMasteries(puuid) {
  const apiUrl = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Function to generate champion icons
async function generateChampionIcons() {
  try {
    const championsJson = await fetchChampionData();
    const puuid = await fetchPUUID(USERNAME, GAME_TAG);
    const masteries = await fetchChampionMasteries(puuid);
    const champions = {};
    for (const champion in championsJson.data) {
      const championId = parseInt(championsJson.data[champion]["key"]);
      champions[championId] = champion;
    }
    masteries.forEach((mastery) => {
      const championId = mastery.championId;
      const championName = champions[championId];
      if (championName) {
        const iconUrl = `${ICON_BASE_URL}${championName}.png`;
        const championDiv = document.createElement("div");
        championDiv.className = "champion";
        championDiv.innerHTML = `
          <img src="${iconUrl}" alt="${championName}" />
          <p>${championName}</p>
        `;
        championGrid.appendChild(championDiv);
      }
    });
  } catch (error) {
    console.error("Error generating champion icons:", error);
  }
}

// Initialize the script
generateChampionIcons();
