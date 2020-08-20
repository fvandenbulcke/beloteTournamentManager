let data = [
  {
    "number": 1,
    "first": "Florian",
    "second": "Thomas",
    "results": []
  },
  {
    "number": 2,
    "first": "Oliv",
    "second": "Julien",
    "results": []
  },
  {
    "number": 3,
    "first": "Eric",
    "second": "Matthieu",
    "results": []
  },
  {
    "number": 4,
    "first": "Christophe",
    "second": "Seb",
    "results": []
  }
];

let currentTurn = 1;

$(document).ready(function(e) {
  init();
});

function init() {
  let content = '<h2>Team suivante :</h2>';
  content += '<input id="player_one" />';
  content += ' <input id="player_two" />';
  content += ' <button onclick="addTeam()">VALIDATE</button>';
  content += '<div id="teams"></div>';
  $("#belote").html(content);
  insertTeams();
}

function insertTeams(){
  const htmlContent = data.map((team) => {
    let newTeamContent = `<p> Team N° ${team.number}  J1: ${team.first}  J2: ${team.second}</p>`
    return `<div>${newTeamContent}</div>`
  })
  $("#teams").html(htmlContent.join(''));
}

function addTeam(){
  data.push({
    "number": data.length+1,
    "first": $('#player_one').val(),
    "second": $('#player_two').val(),
    "results": []
  });
  insertTeams();
}

let freezedTeams = [];
let movedTeams  = [];

function loadTables(){
  if (data.length%2 !== 0) {
    alert('Tables can not be loaded: teams number is odd')
  } else {
    data.forEach((t, index) => t.isFixed = (index%2 === 0));
    insertTables();
  }
}

function nextTurn(){
  console.log('nextTurn');
  currentTurn++;
  insertTables();
}

function insertTables(){
  freezedTeams = data.filter(t => t.isFixed && t.results.length < currentTurn);
  movedTeams = data.filter(t => !t.isFixed && t.results.length < currentTurn);
  let htmlContent = `<p> Tour N° ${currentTurn}</p>`
  if(!freezedTeams.length){
    htmlContent += '<button onclick="nextTurn()">next_turn</button>';
  } else {
    htmlContent += buildTables(freezedTeams, movedTeams);
  }
    
  $("#belote").html(htmlContent);
}

function buildTables(freezedTeams, movedTeams){
  return freezedTeams.map((team, index) => {
    const idOne = `${currentTurn}_${team.number}_points`;
    const idTwo = `${currentTurn}_${movedTeams[index].number}_points`;
    return `<p> Table N° ${index + 1}</p>
    <p>${team.first} / ${team.second} vs. ${movedTeams[index].first} / ${movedTeams[index].second}</p>
    <p><input id="${idOne}" />
    <input id="${idTwo}" />
    <button onclick="registerPoints('${idOne}','${idTwo}')">REGISTER</button></p>`
  }).join('');
}

function registerPoints(inputOne, inputTwo){
  
  let ids = inputOne.split('_');
  const teamOne = data.find(t => t.number === Number(ids[1]))
  const teamOnePoints = Number($(`#${inputOne}`).val());
  const teamTwoPoints = Number($(`#${inputTwo}`).val());

  teamOne.results.push({
    win: teamOnePoints > teamTwoPoints,
    points: teamOnePoints,
  })

  ids = inputTwo.split('_');
  const teamTwo = data.find(t => t.number === Number(ids[1]))
  teamTwo.results.push({
    win: teamTwoPoints > teamOnePoints,
    points: teamTwoPoints,
  })

  insertTables();
}

function loadResults(){
  const htmlBody = data.map(t => {
    const results = t.results.reduce((accumulator, currentValue) => accumulator + Number(currentValue.points), 0);
    const nbOfVictories = t.results.filter(r => r.win).length;
    t.results = results;
    t.nbOfVictories = nbOfVictories;
    return t;
  })
  .sort((team1, team2) => {
    if (team1.results < team2.results) {
      return 1;
    }
    else if (team1.results > team2.results) {
      return -1;
    }
    return 0;
  })
  .map((team, index) => {
    return `<tr>
    <td>${index+1}</td>
    <td>Team ${team.number}</td>
    <td>${team.nbOfVictories}</td>
    <td>${team.results}</td>
    </tr>`
  }).join('');

  const htmlContent = `
  <table style="text-align: center;">
    <thead>
      <tr>
        <th>Classement</th>
        <th>Equipe</th>
        <th>Nombre de victoires</th>
        <th>Points gagnés</th>
      </tr>
    </thead>
    <tbody>
      ${htmlBody}
    </tbody>
  </table>`;
  
  $("#belote").html(htmlContent);
}