const search = document.getElementById('search')
const mainContent = document.getElementById('mainContent')
const detailsCard = document.getElementById('detailsCard')
const closeDetails = document.getElementById('closeDetails')
const detailsName = document.getElementById('detailsName')
const detailsImage = document.getElementById('detailsImage')
const detailsStats = document.getElementById('detailsStats')

const RESULTS_MAX = 50
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/'

const dictionaryTypes = {
  grass: {
    backgroundCard: 'backgroundColorGrass',
    backgroundType: 'typeGrass',
    icon: 'compost',
    color: 'typeGrassTitle'
  },
  poison: {
    backgroundCard: 'backgroundColorPoison',
    backgroundType: 'typePoison',
    icon: 'vaping_rooms',
    color: 'typePoisonTitle'
  },
  fire: {
    backgroundCard: 'backgroundColorFire',
    backgroundType: 'typeFire',
    icon: 'local_fire_department',
    color: 'typeFireTitle'
  },
  water: {
    backgroundCard: 'backgroundColorWater',
    backgroundType: 'typeWater',
    icon: 'water_do',
    color: 'typeWaterTitle'
  },
  flying: {
    backgroundCard: 'backgroundColorFlying',
    backgroundType: 'typeFlying',
    icon: 'flight',
    color: 'typeFlyingTitle'
  },
  bug: {
    backgroundCard: 'backgroundColorBug',
    backgroundType: 'typeBug',
    icon: 'emoji_nature',
    color: 'typeColorBugTitle'
  },
  electric: {
    backgroundCard: 'backgroundColorElectric',
    backgroundType: 'typeElectric',
    icon: 'bolt',
    color: 'typeColorElectricTitle'
  },
  normal: {
    backgroundCard: 'backgroundColorNormal',
    backgroundType: 'typeNormal',
    icon: 'atr',
    color: 'typeColorNormalTitle'
  },
  ground: {
    backgroundCard: 'backgroundColorGround',
    backgroundType: 'typeGround',
    icon: 'landscape',
    color: 'typeColorGroundTitle'
  },
  fairy: {
    backgroundCard: 'backgroundColorFairy',
    backgroundType: 'typeFairy',
    icon: 'temp_preferences_custom',
    color: 'typeColorFairyTitle'
  },
  default: {
    backgroundCard: 'noneType',
    backgroundType: 'noneTypeText',
    icon: 'error_med',
    color: 'noneTypeTextTitle'
  }
}

function generateStat (name, value, color) {
  const MAX_POINT = 200
  const porcent = (value / MAX_POINT) * 100
  const stat = `
  <div class="stats-content">
    <div class="stats-content-header">
      <p class="content-header-text">${name}</p>
      <p class="content-header-numbers">${value} / ${MAX_POINT}</p>
    </div>
    <div class="stats-content-stick"><div class="content-stick-stat ${color}" style="width: ${porcent}%"></div></div>
  </div>`
  return stat
}

function generateDestailsCard (name, id, typeDominate, stats) {
  const typeSelected = dictionaryTypes[typeDominate] || dictionaryTypes.default
  const className = 'details-card'
  detailsCard.setAttribute('class', `${className} ${typeSelected.backgroundCard}`)
  const uriImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  detailsImage.setAttribute('src', uriImage)
  const classNameText = 'info-type-text details-name'
  detailsName.innerHTML = name
  detailsName.setAttribute('class', `${classNameText} ${typeSelected.color}`)
  let statsContruction = ''
  stats.forEach(element => {
    const nameStat = element.stat.name
    const baseStat = element.base_stat
    const stat = generateStat(nameStat, baseStat, typeSelected.backgroundType)
    statsContruction += stat
  })
  detailsStats.innerHTML = statsContruction
}

function dataDetailsEstructure (data) {
  const { name, types, id, stats } = data
  const typePrimary = types[0].type.name
  generateDestailsCard(name, id, typePrimary, stats)
}

function generateDetailsCard (id) {
  return fetch(`${BASE_URL}${id}`)
    .then(response => response.json())
    .then(data => dataDetailsEstructure(data))
}

closeDetails.addEventListener('click', () => {
  detailsCard.classList.add('hide')
  detailsCard.classList.remove('append')
})

search.addEventListener('input', () => {
  const valueText = search.value.toLowerCase()
  fetch(`${BASE_URL}${valueText}`)
    .then(response => response.json())
    .then(data => {
      mainContent.innerHTML = ''
      valueText === ''
        ? generateFirstCards()
        : dataController(data)
    })
    .then(() => addEventListenersToCards(selectAllCards()))
})

function selectAllCards () {
  return document.querySelectorAll('.grid-card')
}

function addEventListenersToCards (cards) {
  cards.forEach(element => {
    element.addEventListener('click', async () => {
      const namePokemon = element.id
      await generateDetailsCard(namePokemon)
      detailsCard.classList.remove('hide')
      detailsCard.classList.add('append')
    })
  })
}

function createCard (name, types, image) {
  const typeDominate = types[0].type.name
  const typeSelected = dictionaryTypes[typeDominate] || dictionaryTypes.default

  let cardTypes = ''
  types.forEach(element => {
    const typeName = element.type.name
    const typeSend = dictionaryTypes[typeName] || dictionaryTypes.default
    cardTypes += createCardType(typeName, typeSend.backgroundType, typeSend.icon)
  })

  const card = `
  <div class="grid-card ${typeSelected.backgroundCard}" id="${name}">
    <div class="card-description">
      <p class="description-name info-type-text">${name}</p>
      <img src="./img/pokeball.svg" class="card-svg" alt="">
      <div class="card-types">
        <div class="type-info">
          ${cardTypes}
        </div>
      </div>
    </div>
    <img src="${image}" alt="" class="card-image">
  </div>`

  mainContent.innerHTML += card
}

function createCardType (name, background, icon) {
  const cardType = `
  <div class="type-info ${background}">
    <span class="material-symbols-outlined info-icon">${icon}</span>
    <p class="info-type-text">${name}</p>
  </div>`
  return cardType
}

function dataController (datos) {
  const { name, types, sprites } = datos
  const image = sprites.other['official-artwork'].front_default
  createCard(name, types, image)
}

async function generateFirstCards () {
  mainContent.innerHTML = ''
  for (let i = 1; i <= RESULTS_MAX; i++) {
    await fetch(`${BASE_URL}${i}`)
      .then(response => response.json())
      .then(data => dataController(data))
  }
  addEventListenersToCards(selectAllCards())
}
generateFirstCards()
