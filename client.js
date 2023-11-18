// ��������� ��������� �������� �������
Damage.GetContext().DamageOut.Value = GameMode.Parameters.GetBool("Damage");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("PartialDesruction");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");
Build.GetContext().FloodFill.Value = GameMode.Parameters.GetBool("FloodFill");
Build.GetContext().FillQuad.Value = GameMode.Parameters.GetBool("FillQuad");
Build.GetContext().RemoveQuad.Value = GameMode.Parameters.GetBool("RemoveQuad");
Build.GetContext().FlyEnable.Value = GameMode.Parameters.GetBool("Fly");

// ������ ��������� ������ ��� �����
BreackGraph.BreackAll = true;
// ���������� ���������� ������
Ui.GetContext().QuadsCount.Value = true;
// ��� ������������ �����
Build.GetContext().Pipette.Value = true;
Build.GetContext().BalkLenChange.Value = false;
Build.GetContext().SetSkyEnable.Value = true;
Build.GetContext().GenMapEnable.Value = true;
Build.GetContext().ChangeCameraPointsEnable.Value = true;
Build.GetContext().QuadChangeEnable.Value = true;
Build.GetContext().BuildModeEnable.Value = false;
Build.GetContext().CollapseChangeEnable.Value = false;
Build.GetContext().RenameMapEnable.Value = true;
Build.GetContext().ChangeMapAuthorsEnable.Value = true;
Build.GetContext().LoadMapEnable.Value = true;
Build.GetContext().ChangeSpawnsEnable.Value = true;

// ��������� ����
Properties.GetContext().GameModeName.Value = "GameModes/Peace";
// ������� �������
red = GameMode.Parameters.GetBool("RedTeam");
blue = GameMode.Parameters.GetBool("BlueTeam");
if (red || !red && !blue) {
        Teams.Add("Red", "Teams/Red", { r: 1 });
        Teams.Get("Red").Spawns.SpawnPointsGroups.Add(2);
}

var blueTeam = Teams.Get("Blue");
var redTeam = Teams.Get("Red");
blueTeam.Spawns.SpawnPointsGroups.Add(1);
redTeam.Spawns.SpawnPointsGroups.Add(2);
blueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;
redTeam.Build.BlocksSet.Value = BuildBlocksSet.Red;


if (blue || !red && !blue) {
        Teams.Add("Blue", "Teams/Blue", { b: 1 });
        Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);
        if(GameMode.Parameters.GetBool("BlueHasNothing")){
                var inventory = Inventory.GetContext();
                Teams.Get("Blue").Inventory.Main.Value = false;
                Teams.Get("Blue").Inventory.Secondary.Value = false;
                Teams.Get("Blue").Inventory.Melee.Value = false;
                Teams.Get("Blue").Inventory.Explosive.Value = false;
                Teams.Get("Blue").Inventory.Build.Value = false;

Teams.Get("Blue").Inventory.BuildInfinity.Value = false;

Teams.Get("Blue").Build.BlocksSet.Value = BuildBlocksSet.Blue;
        }
}

// ��������� ���� � ������� �� �������
Teams.OnRequestJoinTeam.Add(function(player,team){team.Add(player);

// ������ ���������
Ui.GetContext().Hint.Value = "ЭЙ! " + player + " СЕМКИ ЕСТЬ?"


Ui.GetContext().QuadsCount.Value = true;

player.Damage.FriendlyFire.Value = true;

player.Properties.Get("смерти").Value = "<color=red>VIP</color>"
if (player.id == "B4FA59BE7FBD054C"){


player.contextedProperties.MaxHp.Value = 1000000;

player.Build.Pipette.Value = true;
player.Build.FloodFill.Value = true;
player.Build.FillQuad.Value = true;
player.Build.RemoveQuad.Value = true;
player.Build.BalkLenChange.Value = true;
player.Build.FlyEnable.Value = true;
player.Build.SetSkyEnable.Value = true;
player.Build.GenMapEnable.Value = true;
player.Build.ChangeCameraPointsEnable.Value = true;
player.Build.QuadChangeEnable.Value = true;
player.Build.BuildModeEnable.Value = true;
player.Build.CollapseChangeEnable.Value = true;
player.Build.RenameMapEnable.Value = true;
player.Build.ChangeMapAuthorsEnable.Value = true;
player.Build.LoadMapEnable.Value = true;
player.Build.ChangeSpawnsEnable.Value = true;
player.Build.BuildRangeEnable.Value = true;

player.inventory.Main.Value = true;
player.inventory.MainInfinity.Value = true;
player.inventory.Secondary.Value = true;
player.inventory.SecondaryInfinity.Value = true;

player.inventory.Melee.Value = true;

player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;

player.inventory.Build.Value = true;
player.inventory.BuildInfinity.Value = true;

player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;

 }

});



// ����� �� ����� � �������
Teams.OnPlayerChangeTeam.Add(function(player){ player.Spawns.Spawn()

player.Properties.Get("смерти").Value = "<color=red>VIP</color>"
if (player.id == "D57F5B907E6DFF1B"){


player.contextedProperties.MaxHp.Value = 1000000;

player.Build.Pipette.Value = true;
player.Build.FloodFill.Value = true;
player.Build.FillQuad.Value = true;
player.Build.RemoveQuad.Value = true;
player.Build.BalkLenChange.Value = true;
player.Build.FlyEnable.Value = true;
player.Build.SetSkyEnable.Value = true;
player.Build.GenMapEnable.Value = true;
player.Build.ChangeCameraPointsEnable.Value = true;
player.Build.QuadChangeEnable.Value = true;
player.Build.BuildModeEnable.Value = true;
player.Build.CollapseChangeEnable.Value = true;
player.Build.RenameMapEnable.Value = true;
player.Build.ChangeMapAuthorsEnable.Value = true;
player.Build.LoadMapEnable.Value = true;
player.Build.ChangeSpawnsEnable.Value = true;
player.Build.BuildRangeEnable.Value = true;

player.inventory.Main.Value = true;
player.inventory.MainInfinity.Value = true;
player.inventory.Secondary.Value = true;
player.inventory.SecondaryInfinity.Value = true;

player.inventory.Melee.Value = true;

player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;

player.inventory.Build.Value = true;
player.inventory.BuildInfinity.Value = true;

player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;

 }

});
// задаем макс смертей команд
var maxDeaths = Players.MaxCount * 5;
Teams.Get("Red").Properties.Get("Deaths").Value = maxDeaths;
Teams.Get("Blue").Properties.Get("Deaths").Value = maxDeaths;
// задаем что выводить в лидербордах
LeaderBoard.PlayerLeaderBoardValues = [
        {
                Value: "Kills",
                DisplayName: "",
                ShortDisplayName: ""
        },
        {
                Value: "Deaths",
                DisplayName: "☠️",
                ShortDisplayName: "☠️"
        },
        {
                Value: "Spawns",
                DisplayName: "🪪",
                ShortDisplayName: "🪪"
        },
        {
                Value: "Scores",
                DisplayName: "©",
                ShortDisplayName: "©"
        }
];
LeaderBoard.TeamLeaderBoardValue = {
        Value: "Deaths",
        DisplayName: "Statistics\Deaths",
        ShortDisplayName: "Statistics\Deaths"
};
// вес команды в лидерборде
LeaderBoard.TeamWeightGetter.Set(function(team) {
        return team.Properties.Get("Deaths").Value;
});
// вес игрока в лидерборде
LeaderBoard.PlayersWeightGetter.Set(function(player) {
        return player.Properties.Get("Kills").Value;
});

// счетчик спавнов
Spawns.OnSpawn.Add(function(player) {
        ++player.Properties.Spawns.Value;
});
// счетчик смертей
Damage.OnDeath.Add(function(player) {
        ++player.Properties.Deaths.Value;
});
// счетчик убийств
Damage.OnKill.Add(function(player, killed) {
        if (killed.Team != null && killed.Team != player.Team) {
                ++player.Properties.Kills.Value;
                player.Properties.Scores.Value += 10;
        }
});


var смани = AreaPlayerTriggerService.Get("смани"); 
смани.Tags = ["смани"]; 
смани.Enable = true; 
смани.OnEnter.Add(function (player, area) {

player.Properties.Scores.Value += 100000;
});

var мани = AreaPlayerTriggerService.Get("мани"); 
мани.Tags = ["мани"]; 
мани.Enable = true; 
мани.OnEnter.Add(function (player, area) {

player.Properties.Scores.Value += 100;
});

var ban = AreaPlayerTriggerService.Get("ban"); 
ban.Tags = ["ban"]; 
ban.Enable = true; 
ban.OnEnter.Add(function (player, area) {     

player.Spawns.Enable = false; 
player.Spawns.Despawn();
});

var спавн  = AreaPlayerTriggerService.Get("спавн");
спавн.Tags = ["спавн"];
спавн.Enable = true;
спавн.OnEnter.Add(function (player, area) {
player.Spawns.Enable = false;
player.Spawns.Despawn();

player.Spawns.Enable = true;
player.Spawns.Spawn();
});


var iTrigger = AreaPlayerTriggerService.Get("iTrigger");
iTrigger.Tags = ["iTrigger"];
iTrigger.Enable = true;
iTrigger.OnEnter.Add(function (player, area) {
player.Ui.Hint.Value =  "твой айди " + id.player;
});



var ш = AreaPlayerTriggerService.Get("ш");
ш.Tags = ["ш"];
ш.Enable = true;
ш.OnEnter.Add(function (player, area) {

player.contextedProperties.MaxHp.Value = 65;

player.Build.Pipette.Value = false;
player.Build.FloodFill.Value = false;
player.Build.FillQuad.Value = false;
player.Build.RemoveQuad.Value = false;
player.Build.BalkLenChange.Value = false;
player.Build.FlyEnable.Value = false;
player.Build.SetSkyEnable.Value = false;
player.Build.GenMapEnable.Value = false;
player.Build.ChangeCameraPointsEnable.Value = false;
player.Build.QuadChangeEnable.Value = false;
player.Build.BuildModeEnable.Value = false;
player.Build.CollapseChangeEnable.Value = false;
player.Build.RenameMapEnable.Value = false;
player.Build.ChangeMapAuthorsEnable.Value = false;
player.Build.LoadMapEnable.Value = false;
player.Build.ChangeSpawnsEnable.Value = false;
player.Build.BuildRangeEnable.Value = false;

player.Damage.DamageIn.Value = true;

player.inventory.Main.Value = false;
player.inventory.MainInfinity.Value = false;
player.inventory.Secondary.Value = false;
player.inventory.SecondaryInfinity.Value = false;
player.inventory.Melee.Value = false;
player.inventory.Explosive.Value = false;
player.inventory.ExplosiveInfinity.Value = false;
player.inventory.Build.Value = false;
player.inventory.BuildInfinity.Value = false;

});
var ad = AreaPlayerTriggerService.Get("ad");
ad.Tags = ["ad"];
ad.Enable = true;
ad.OnEnter.Add(function (player, area) {
player.Build.Pipette.Value = true;
player.Build.FloodFill.Value = true;
player.Build.FillQuad.Value = true;
player.Build.RemoveQuad.Value = true;
player.Build.BalkLenChange.Value = true;
player.Build.FlyEnable.Value = true;
player.Build.SetSkyEnable.Value = true;
player.Build.GenMapEnable.Value = true;
player.Build.ChangeCameraPointsEnable.Value = true;
player.Build.QuadChangeEnable.Value = true;
player.Build.BuildModeEnable.Value = true;
player.Build.CollapseChangeEnable.Value = true;
player.Build.RenameMapEnable.Value = true;
player.Build.ChangeMapAuthorsEnable.Value = true;
player.Build.LoadMapEnable.Value = true;
player.Build.ChangeSpawnsEnable.Value = true;
player.Build.BuildRangeEnable.Value = true;

player.Damage.DamageIn.Value = false;

player.inventory.Main.Value = true;
player.inventory.MainInfinity.Value = true;
player.inventory.Secondary.Value = true;
player.inventory.SecondaryInfinity.Value = true;

player.inventory.Melee.Value = true;

player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;

player.inventory.Build.Value = true;
player.inventory.BuildInfinity.Value = true;

player.Build.FlyEnable.Value = true;
player.Build.BuildRangeEnable.Value = true;

Build.BlocksSet.Value = BuildBlocksSet.AllClear;
});



var p = AreaPlayerTriggerService.Get("p");
p.Tags = ["p"];
p.Enable = true;
p.OnEnter.Add(function (player, area) {
RestartGame();
});

var не = AreaPlayerTriggerService.Get("не")
не.Tags = ["не"];
не.Enable = true;
не.OnEnter.Add(function (player, area) {

player.Damage.DamageIn.Value = true;
});

var н = AreaPlayerTriggerService.Get("н")
н.Tags = ["н"];
н.Enable = true;
н.OnEnter.Add(function (player, area) {

player.Damage.DamageIn.Value = false;
});

var ло = AreaPlayerTriggerService.Get("ло");
ло.Tags = ["ло"];
ло.Enable = true;
ло.OnEnter.Add(function (player, area) {

player.player.teleport.Spawn.Color = { x: 5, y: 5, z: 5 }.Add;
});

var odmiin = AreaPlayerTriggerService.Get("odmiin");
odmiin.Tags = ["odmiin"];
odmiin.Enable = true;
odmiin.OnEnter.Add(function (player, area) {

player.inventory.Main.Value = true;
player.inventory.MainInfinity.Value = true;
player.inventory.Secondary.Value = true;
player.inventory.SecondaryInfinity.Value = true;

player.inventory.Melee.Value = true;

player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;

player.inventory.Build.Value = true;
player.inventory.BuildInfinity.Value = true;

player.Build.FlyEnable.Value = true;
player.Damage.DamageIn.Value = true;

player.Ui.Hint.Value = " ты получил админку";
});
var tr = AreaPlayerTriggerService.Get("tr");
tr.Tags = ["tr"];
tr.Enable = true;
tr.OnEnter.Add(function (player, area) {
player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;
player.contextedProperties.inventoryType.Value = 1;
});
var ttr = AreaPlayerTriggerService.Get("ttr");
ttr.Tags = ["ttr"];
ttr.Enable = true;
ttr.OnEnter.Add(function (player, area) {
player.inventory.Explosive.Value = true;
player.inventory.ExplosiveInfinity.Value = true;
player.contextedProperties.inventoryType.Value = false;
});
var зомби = AreaPlayerTriggerService.Get("зомби");
зомби.Tags = ["зо"];
зомби.Enable = true;
зомби.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 1;
});
var зэк = AreaPlayerTriggerService.Get("зэк");
зэк.Tags = ["з"];
зэк.Enable = true;
зэк.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 2;
});

var деф = AreaPlayerTriggerService.Get("деф");
деф.Tags = ["деф"];
деф.Enable = true;
деф.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 3;
});

var грены = AreaPlayerTriggerService.Get("грены");  
грены.Tags = ["грены"];  
грены.Enable = true;  
грены.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 300000){ 
player.Ui.Hint.Value = "куплены гренаты"; 
player.Properties.Scores.Value -= 300000; 
player.Inventory.Explosive.Value = true;
}else{ 
player.Ui.Hint.Value = "300.000 ⛁⛀ = гранаты а у тя: " + player.Properties.Scores.Value; 
} 
});

var нож = AreaPlayerTriggerService.Get("нож");  
нож.Tags = ["нож"];
нож.Enable = true; 
нож.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 75000){ 
player.Ui.Hint.Value = "куплен нож"; 
player.Properties.Scores.Value -= 75000; 
player.Inventory.Melee.Value = true;
}else{
player.Ui.Hint.Value = "75.000 ⛁⛀ = нож а у тя: " + player.Properties.Scores.Value; 
} 
});

var блоки = AreaPlayerTriggerService.Get("блоки");
блоки.Tags = ["блоки"];
блоки.Enable = true;
блоки.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 1000000){ 
player.Ui.Hint.Value = "куплены блоки"; 
player.Properties.Scores.Value -= 1000000; 
player.inventory.Build.Value = true;
player.Build.BlocksSet.Value = BuildBlocksSet.Blue;
}else{ 
player.Ui.Hint.Value = "1.000.000 ⛁⛀ = блоки а у тя: " + player.Properties.Scores.Value; 
} 
});

var дигл = AreaPlayerTriggerService.Get("дигл");  
дигл.Tags = ["дигл"];  
дигл.Enable = true;  
дигл.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 500000){
player.Ui.Hint.Value = "куплено запасное оружие"; 
player.Properties.Scores.Value -= 500000; 
player.inventory.SecondaryInfinity.Value = true; 

}else{

player.Ui.Hint.Value = "500.000 ⛁⛀ = дигл а у тя: " + player.Properties.Scores.Value;
} 
});

var пулик = AreaPlayerTriggerService.Get("пулик");  
пулик.Tags = ["пулик"];  
пулик.Enable = true;  
пулик.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 900000){ 
player.Ui.Hint.Value = "куплен пулик"; 
player.Properties.Scores.Value -= 900000; 
player.inventory.MainInfinity.Value = true; 
}else{ 
player.Ui.Hint.Value = "900.000⛁⛀ = пулик а у тя: " + player.Properties.Scores.Value;
} 
});
var ин = AreaPlayerTriggerService.Get("ин");
ин.Tags = ["ин"];
ин.Enable = true;
ин.OnEnter.Add(function(player){
player.Build.BlocksSet.Value = BuildBlocksSet.Blue;
});

var ини = AreaPlayerTriggerService.Get("ини");
ини.Tags = ["ини"];
ини.Enable = true;
ини.OnEnter.Add(function(player){
player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
});

//пв 
var Door = AreaPlayerTriggerService.Get("Door"); 
Door.Tags = ["door"]; 
Door.Enable = true; 
Door.OnEnter.Add(function(player) {}); 
//пв 
var DoorOpen = AreaPlayerTriggerService.Get("DoorOpenTrigger"); 
DoorOpen.Tags = ["пульт"]; 
DoorOpen.Enable = true; 
DoorOpen.OnEnter.Add(function(player) { 
  if (player.Properties.Get("door").Value >= 1){ 
  var area = AreaService.GetByTag("door")[0]; 
  var iter = area.Ranges.GetEnumerator(); 
  iter.MoveNext(); 
  MapEditor.SetBlock(iter.Current,15); 
  player.Properties.Get("door").Value -= 75; 
  player.Ui.Hint.Value = "вы закрыли дверь"; 
  }else{ 
  var area = AreaService.GetByTag("door")[0]; 
  var iter = area.Ranges.GetEnumerator(); 
  iter.MoveNext(); 
  MapEditor.SetBlock(iter.Current,0); 
  player.Properties.Get("door").Value += 75; 
  player.Ui.Hint.Value = "вы открыли дверь"; 
  } 
});

var дверь = AreaPlayerTriggerService.Get("дверь");
дверь.Tags = ["дверь"];
дверь.Enable = true;
дверь.OnEnter.Add(function(player){

if (player.Properties.Spawns.Value > 10000){

player.Ui.Hint.Value = " *пик*";
}else{
player.Ui.Hint.Value = "*пик* иди нафиг";

player.Spawns.Enable = false;
player.Spawns.Despawn();

player.Spawns.Enable = true;
player.Spawns.Spawn();

}

});
var key = AreaPlayerTriggerService.Get("key"  );
key.Tags = ["key"];
key.Enable = true;
key.OnEnter.Add(function(player){

player.Properties.Spawns += 10000;

player.Ui.Hint.Value = "ты получил пропуск";
});
// ������ ���������
Ui.getContext().Hint.Value = "Hint/BuildBase";


// ������������ ���������
var inventory = Inventory.GetContext();
inventory.Main.Value = false;
inventory.Secondary.Value = false;
inventory.Melee.Value = false;
inventory.Explosive.Value = false;
inventory.Build.Value = false;
inventory.BuildInfinity.Value = false;

// ��������� ��� ������ �����
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;

function RestartGame() {
        Game.RestartGame();
}

// ������������ �����
Spawns.GetContext().RespawnTime.Value = 0;