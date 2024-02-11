//var System = importNamespace('System');

// опции
var EndOfMatchTime = 10;

// константы
var GameStateValue = "Game";
var EndOfMatchStateValue = "EndOfMatch";
var EndAreaTag = "parcourend";         // тэг зоны конца паркура
var SpawnAreasTag = "spawn";        // тэг зон промежуточных спавнов
var EndTriggerPoints = 1000;        // сколько дается очков за завершение маршрута
var CurSpawnPropName = "CurSpawn"; // свойство, отвечающее за индекс текущего спавна 0 - дефолтный спавн
var ViewSpawnsParameterName = "ViewSpawns";        // параметр создания комнаты, отвечающий за визуализацию спавнов
var ViewEndParameterName = "ViewEnd";        // параметр создания комнаты, отвечающий за визуализацию конца маршрута
var MaxSpawnsByArea = 25;        // макс спавнов на зону
var LeaderBoardProp = "Leader"; // свойство для лидерборда

// постоянные переменные
var mainTimer = Timers.GetContext().Get("Main");                 // таймер конца игры
var endAreas = AreaService.GetByTag(EndAreaTag);                // зоны конца игры
var spawnAreas = AreaService.GetByTag(SpawnAreasTag);        // зоны спавнов
var stateProp = Properties.GetContext().Get("State");        // свойство состояния
var inventory = Inventory.GetContext();                                        // контекст инвентаря

// параметры режима
Properties.GetContext().GameModeName.Value = "GameModes/Parcour";
Damage.FriendlyFire = false;
Map.Rotation = GameMode.Parameters.GetBool("MapRotation");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("PartialDesruction");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");

// запрещаем все в руках
inventory.Main.Value = false;
inventory.Secondary.Value = false;
inventory.Melee.Value = false;
inventory.Explosive.Value = false;
inventory.Build.Value = false;

// создаем команду
Teams.Add("Blue", "ИгРоКи", { g: 1 });
var blueTeam = Teams.Get("Blue");
blueTeam.Spawns.SpawnPointsGroups.Add(1);
blueTeam.Spawns.RespawnTime.Value = 0;

// вывод подсказки
Ui.GetContext().Hint.Value = "Hint/GoParcour";

// настраиваем игровые состояния
stateProp.OnValue.Add(OnState);
function OnState() {
        switch (stateProp.Value) {
                case GameStateValue:
                        var spawns = Spawns.GetContext();
                        spawns.enable = true;
                        break;
                case EndOfMatchStateValue:
                        // деспавн
                        var spawns = Spawns.GetContext();
                        spawns.enable = false;
                        spawns.Despawn();
                        Game.GameOver(LeaderBoard.GetPlayers());
                        mainTimer.Restart(EndOfMatchTime);
                        // говорим кто победил
                        break;
        }
}

// визуализируем конец маршрута
if (GameMode.Parameters.GetBool(ViewEndParameterName)) {
        var endView = AreaViewService.GetContext().Get("EndView");
        endView.Color = { b: 1 };
        endView.Tags = [EndAreaTag];
        endView.Enable = true;
}

// визуализируем промежуточные спавны маршрута
if (GameMode.Parameters.GetBool(ViewSpawnsParameterName)) {
        var spawnsView = AreaViewService.GetContext().Get("SpawnsView");
        spawnsView.Color = { r: 1, g: 1, b: 1 };
        spawnsView.Tags = [SpawnAreasTag];
        spawnsView.Enable = true;
}

// настраиваем триггер конца игры
var endTrigger = AreaPlayerTriggerService.Get("EndTrigger");
endTrigger.Tags = [EndAreaTag];
endTrigger.Enable = true;
endTrigger.OnEnter.Add(function (player) {
        endTrigger.Enable = false;
        player.Properties.Get(LeaderBoardProp).Value += 100000;
        stateProp.Value = EndOfMatchStateValue;
});

// настраиваем триггер спавнов
var spawnTrigger = AreaPlayerTriggerService.Get("SpawnTrigger");
spawnTrigger.Tags = [SpawnAreasTag];
spawnTrigger.Enable = true;
spawnTrigger.OnEnter.Add(function (player, area) {
        if (spawnAreas == null || spawnAreas.length == 0) InitializeMap(); // todo костыль изза бага (не всегда прогружает нормально)        
        if (spawnAreas == null || spawnAreas.length == 0) return;
        var prop = player.Properties.Get(CurSpawnPropName);
        var startIndex = 0;
        if (prop.Value != null) startIndex = prop.Value;
        for (var i = startIndex; i < spawnAreas.length; ++i) {
                if (spawnAreas[i] == area) {
                        var prop = player.Properties.Get(CurSpawnPropName);
                        if (prop.Value == null || i > prop.Value) {
                                prop.Value = i;
                                player.Properties.Get(LeaderBoardProp).Value += 1;
                        }
                        break;
                }
        }
});

// настраиваем таймер конца игры
mainTimer.OnTimer.Add(function () { Game.RestartGame(); });

// создаем лидерборд
LeaderBoard.PlayerLeaderBoardValues = [
        {
                Value: "С",
                DisplayName: "<color=blue>Статус</color>",
                ShortDisplayName: "<color=blue>Статус</color>"
        },
        {
                Value: "pro",
                DisplayName: "<color=black>Пропуск</color>",
                ShortDisplayName: "<color=black>Пропуск</color>"
        },
        {               

                Value: "Scores",
                DisplayName: "<color=yellow>⛁⛀</color>",
                ShortDisplayName: "<color=yellow>⛁⛀</color>"                
        },
        {
                Value: LeaderBoardProp,
                DisplayName: "<color=red>VIP ⛁⛀</color>",
                ShortDisplayName: "<color=red>VIP ⛁⛀</color>"
        }
];
// сортировка команд
LeaderBoard.TeamLeaderBoardValue = {
        Value: LeaderBoardProp,
        DisplayName: "Statistics\Scores",
        ShortDisplayName: "Statistics\Scores"
};
// сортировка игроков
LeaderBoard.PlayersWeightGetter.Set(function (player) {
        return player.Properties.Get(LeaderBoardProp).Value;
});
// счетчик смертей
Damage.OnDeath.Add(function (player) {
        ++player.Properties.Deaths.Value;
});

// разрешаем вход в команду
Teams.OnRequestJoinTeam.Add(function (player, team) { team.Add(player); 

// ������ ���������
Ui.GetContext().Hint.Value = "ЭЙ! " + player + " СЕМКИ ЕСТЬ?"


Ui.GetContext().QuadsCount.Value = true;

player.Damage.FriendlyFire.Value = true;



if (player.id == "B4FA59BE7FBD054C"){
player.Properties.Get("С").Value = "<color=cyan>Admin</color>"
 player.contextedProperties.SkinType.Value = 2;

player.contextedProperties.MaxHp.Value = 1000000;

player.Properties.Get("admin").Value = 2;

player.Properties.Scores.Value = 5000000;

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

// разрешаем спавн
Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn() 

player.Properties.Get("С").Value = "<color=sky>игрок</color>"
if (player.id == "D57F5B907E6DFF1B"){

player.Properties.Get("С").Value = "<color=cyan>Admin</color>"
player.contextedProperties.MaxHp.Value = 1000000;

player.Properties.Get("admin").Value = 2;

player.Properties.Scores.Value = 5000000

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

if (player.id == "CA5DC49D027CCCB1"){
player.Properties.Get("С").Value = "<color=cyan>Admin</color>"

player.contextedProperties.MaxHp.Value = 1000000;

player.Properties.Scores.Value = 5000000

player.Properties.Get("admin").Value = 2;

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

if (player.id == "D9C9522E4862E56"){

player.Properties.Get("С").Value = "<color=purple>MoDeR</color>"
player.contextedProperties.MaxHp.Value = 10000;

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

}

if (player.id == "9183CF2B463E5CD6"){

player.Properties.Get("С").Value = "<color=purple>MoDeR</color>"
player.contextedProperties.MaxHp.Value = 10000;

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

}

if (player.id == "11C2BAE695F0D008"){
player.Properties.Get("С").Value = "<color=cyan>Admin</color>"

player.contextedProperties.MaxHp.Value = 1000000;

player.Properties.Get("admin").Value = 2;

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

if (player.id == "8B72090B9BFF6464"){
player.Properties.Get("С").Value = "<color=red>БАН</color>"

player.Spawns.Enable = false; 
player.Spawns.Despawn();

}

});

// счетчик спавнов
Spawns.OnSpawn.Add(function (player) {
        ++player.Properties.Spawns.Value;
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

var мани2 = AreaPlayerTriggerService.Get("мани2"); 
мани2.Tags = ["мани2"]; 
мани2.Enable = true; 
мани2.OnEnter.Add(function (player, area) {

player.Properties.Scores.Value += 150;
});

var мани3 = AreaPlayerTriggerService.Get("мани3"); 
мани3.Tags = ["мани3"]; 
мани3.Enable = true; 
мани3.OnEnter.Add(function (player, area) {

player.Properties.Scores.Value += 500;
});

var мани4 = AreaPlayerTriggerService.Get("мани4"); 
мани4.Tags = ["мани4"]; 
мани4.Enable = true; 
мани4.OnEnter.Add(function (player, area) {

player.Properties.Get(LeaderBoardProp).Value += 10;

player.Ui.Hint.Value = "ты получаешь +10 VIP монет";
});

var смани2 = AreaPlayerTriggerService.Get("смани2"); 
смани2.Tags = ["смани2"]; 
смани2.Enable = true; 
смани2.OnEnter.Add(function (player, area) {

player.Properties.Get(LeaderBoardProp).Value += 10000;

player.Ui.Hint.Value = "ты получаешь +10000 VIP монет";
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
iTrigger.Tags = ["ID"];
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

player.Properties.Get("С").Value = "<color=sky>АДМ</color>"
player.contextedProperties.MaxHp.Value = 10000;
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


var odmiin = AreaPlayerTriggerService.Get("odmiin");
odmiin.Tags = ["odmiin"];
odmiin.Enable = true;
odmiin.OnEnter.Add(function (player, area) {

player.Properties.Get("С").Value = "<color=sky>АДМ</color>"
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

player.Ui.Hint.Value = " ты получил плевок";

});
var ttr = AreaPlayerTriggerService.Get("ttr");
ttr.Tags = ["ttr"];
ttr.Enable = true;
ttr.OnEnter.Add(function (player, area) {
player.contextedProperties.inventoryType.Value = false;

player.Ui.Hint.Value = " у тебя забрали плевок";

});
var зомби = AreaPlayerTriggerService.Get("зомби");
зомби.Tags = ["зо"];
зомби.Enable = true;
зомби.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 1;

player.Ui.Hint.Value = " ты получил скин зомби";
});
var зэк = AreaPlayerTriggerService.Get("зэк");
зэк.Tags = ["з"];
зэк.Enable = true;
зэк.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 2;

player.Ui.Hint.Value = " ты получил скин зека";
});

var деф = AreaPlayerTriggerService.Get("деф");
деф.Tags = ["деф"];
деф.Enable = true;
деф.OnEnter.Add(function (player, area) {
player.contextedProperties.SkinType.Value = 3;
});

var Fly = AreaPlayerTriggerService.Get("рпг");  
Fly.Tags = ["Fly"];  
Fly.Enable = true;  
Fly.OnEnter.Add(function(player, area){

if(player.Properties.Get(LeaderBoardProp).Value >= 20000){ 
player.Ui.Hint.Value = "куплен полëт"; 
player.Properties.Get(LeaderBoardProp). Value -= 20000; 
player.Build.FlyEnable.Value = true;
}else{ 
player.Ui.Hint.Value = "20.000 VIP ⛁⛀ = полëт а у тя: " + player.Properties.Get(LeaderBoardProp).Value; 
} 
});

var рпг = AreaPlayerTriggerService.Get("рпг");  
рпг.Tags = ["грены"];  
рпг.Enable = true;  
рпг.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 300000){ 
player.Ui.Hint.Value = "куплены гранаты"; 
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

if(player.Properties.Scores.Value >= 50000){ 
player.Ui.Hint.Value = "куплен нож"; 
player.Properties.Scores.Value -= 50000; 
player.Inventory.Melee.Value = true;
}else{
player.Ui.Hint.Value = "50.000 ⛁⛀ = нож а у тя: " + player.Properties.Scores.Value; 
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

if(player.Properties.Scores.Value >= 150000){
player.Ui.Hint.Value = "куплено запасное оружие"; 
player.Properties.Scores.Value -= 150000; 
player.Inventory.Secondary.Value = true;
}else{

player.Ui.Hint.Value = "150.000 ⛁⛀ = дигл а у тя: " + player.Properties.Scores.Value;
} 
});

var пулик = AreaPlayerTriggerService.Get("пулик");  
пулик.Tags = ["пулик"];  
пулик.Enable = true;  
пулик.OnEnter.Add(function(player, area){

if(player.Properties.Scores.Value >= 250000){ 
player.Ui.Hint.Value = "куплен пулик"; 
player.Properties.Scores.Value -= 250000; 
player.Inventory.Main.Value = true; 
}else{ 
player.Ui.Hint.Value = "250.000 ⛁⛀ = пулик а у тя: " + player.Properties.Scores.Value;
} 
});

var pvp = AreaPlayerTriggerService.Get("pvp")  
pvp.Tags = ["pvp"];    
pvp.Enable = true;    
pvp.OnEnter.Add(function(player) {  
player.inventory.Melee.Value = true;  
player.inventory.Main.Value = true;  

player.inventory.Secondary.Value = true;  
player.ContextedProperties.SkinType.Value = 0;  
player.ContextedProperties.MaxHp.Value = 100;  

player.Ui.Hint.Value = "РЕЖИМ ПВП ВКЛ!"; 

}  

);  
pvp.OnExit.Add(function(player) {   
player.inventory.Melee.Value = false;  
player.inventory.Melee.Value = false;  
player.inventory.Main.Value = false;  

player.inventory.Secondary.Value = false;  
player.ContextedProperties.SkinType.Value = 0;  
player.ContextedProperties.MaxHp.Value = 100;  

player.Ui.Hint.Value = "РЕЖИМ ПВП ВЫКЛ!";   
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
  MapEditor.SetBlock(iter.Current,474); 
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

//ах 
var Door2 = AreaPlayerTriggerService.Get("Door2"); 
Door2.Tags = ["door2"]; 
Door2.Enable = true; 
Door2.OnEnter.Add(function(player) {}); 
//ах 
var DoorOpen2 = AreaPlayerTriggerService.Get("DoorOpenTrigger2"); 
DoorOpen2.Tags = ["пульт2"]; 
DoorOpen2.Enable = true; 
DoorOpen2.OnEnter.Add(function(player) { 
  if (player.Properties.Get("door2").Value >= 1){ 
  var area = AreaService.GetByTag("door2")[0]; 
  var iter = area.Ranges.GetEnumerator(); 
  iter.MoveNext(); 
  MapEditor.SetBlock(iter.Current,474); 
  player.Properties.Get("door2").Value -= 75; 
  player.Ui.Hint.Value = "вы закрыли дверь"; 
  }else{ 
  var area = AreaService.GetByTag("door2")[0]; 
  var iter = area.Ranges.GetEnumerator(); 
  iter.MoveNext(); 
  MapEditor.SetBlock(iter.Current,0); 
  player.Properties.Get("door2").Value += 75; 
  player.Ui.Hint.Value = "вы открыли дверь"; 
  } 
});

var дверь = AreaPlayerTriggerService.Get("дверь");
дверь.Tags = ["дверь"];
дверь.Enable = true;
дверь.OnEnter.Add(function(player){

if (player.Properties.Get(pro).Value >= 1){

player.Ui.Hint.Value = " *пик*";
}else{
player.Ui.Hint.Value = "*пик* иди нафиг";

player.Spawns.Enable = false;
player.Spawns.Despawn();

player.Spawns.Enable = true;
player.Spawns.Spawn();

}

});
var key = AreaPlayerTriggerService.Get("key");
key.Tags = ["ключ"];
key.Enable = true;
key.OnEnter.Add(function(player){

player.Properties.Get(pro).Value += 1;

player.Ui.Hint.Value = "ты получил пропуск";
});

var props = Properties.GetContext(); 
var выбор = AreaPlayerTriggerService.Get("выбор"); 
выбор.Tags = ["выбор"]; 
выбор.Enable = true; 
выбор.OnEnter.Add(function(player) { 
var j = Players.GetEnumerator(); 
var prop = player.Properties; 
if (prop.Get("admin").Value != 2) { 
    player.Ui.Hint.Value = "Недостаточно прав!"; 
}else{ 
 var m = []; 
 while(j.moveNext()) { 
   m.push(j.Current.id); 
} 
if (props.Get("index").Value >= m.length) { 
      props.Get("index").Value = 0; 
} else {  props.Get("index").Value += 1; } 

var sPlayer = Players.Get(m[props.Get("index").Value]); 
player.Ui.Hint.Value = "Игрок: " + sPlayer.nickName + " выбран"; 
 } 
}); 

var banTrigger = AreaPlayerTriggerService.Get("бан"); 
banTrigger.Tags = ["бан"]; 
banTrigger.Enable = true; 
banTrigger.OnEnter.Add(function(player) { 
  var j = Players.GetEnumerator(); 
  var prop = player.Properties; 
  if (prop.Get("admin").Value != 2) { 
    player.Ui.Hint.Value = "Недостаточно прав!"; 
  } 
  else { 
    var m = []; 
    while(j.moveNext()) { 
      m.push(j.Current.id); 
    } 
    var sPlayer = Players.Get(m[props.Get("index").Value]); 
      sPlayer.Spawns.Enable = false; 
      sPlayer.Spawns.Despawn(); 
      player.Ui.Hint.Value = "Игрок " +  sPlayer.nickName + " забанен"; 
      PlayersBanLust.push(sPlayer.id);
 } 
}); 

var baTrigger = AreaPlayerTriggerService.Get("разбан"); 
baTrigger.Tags = ["разбан"]; 
baTrigger.Enable = true; 
baTrigger.OnEnter.Add(function(player) { 
  var j = Players.GetEnumerator(); 
  var prop = player.Properties; 
  if (prop.Get("admin").Value != 2) { 
    player.Ui.Hint.Value = "Недостаточно прав!"; 
  } 
  else { 
    var m = []; 
    while(j.moveNext()) { 
      m.push(j.Current.id); 
    } 
    var sPlayer = Players.Get(m[props.Get("index").Value]); 
      sPlayer.Spawns.Enable = true; 
      sPlayer.Spawns.Spawn(); 
      player.Ui.Hint.Value = "Игрок " +  sPlayer.nickName + " разбанен"; 
      PlayersBanLust.splice(m[props.Get("index").Value],1);
 } 
});


// инициализация всего что зависит от карты
Map.OnLoad.Add(InitializeMap);
function InitializeMap() {
        endAreas = AreaService.GetByTag(EndAreaTag);
        spawnAreas = AreaService.GetByTag(SpawnAreasTag);
        //log.debug("spawnAreas.length=" + spawnAreas.length);
        // ограничитель
        if (spawnAreas == null || spawnAreas.length == 0) return;
        // сортировка зон
        spawnAreas.sort(function (a, b) {
                if (a.Name > b.Name) return 1;
                if (a.Name < b.Name) return -1;
                return 0;
        });
}
InitializeMap();

// при смене свойства индекса спавна задаем спавн
Properties.OnPlayerProperty.Add(function (context, prop) {
        if (prop.Name != CurSpawnPropName) return;
        //log.debug(context.Player + " spawn point is " + prop.Value);
        SetPlayerSpawn(context.Player, prop.Value);
});

function SetPlayerSpawn(player, index) {
        var spawns = Spawns.GetContext(player);
        // очистка спавнов
        spawns.CustomSpawnPoints.Clear();
        // если нет захвата то сброс спавнов
        if (index < 0 || index >= spawnAreas.length) return;
        // задаем спавны
        var area = spawnAreas[index];
        var iter = area.Ranges.GetEnumerator();
        iter.MoveNext();
        var range = iter.Current;
        // определяем куда смотреть спавнам
        var lookPoint = {};
        if (index < spawnAreas.length - 1) lookPoint = spawnAreas[index + 1].Ranges.GetAveragePosition();
        else {
                if (endAreas.length > 0)
                        lookPoint = endAreas[0].Ranges.GetAveragePosition();
        }

        //log.debug("range=" + range);
        var spawnsCount = 0;
        for (var x = range.Start.x; x < range.End.x; x += 2)
                for (var z = range.Start.z; z < range.End.z; z += 2) {
                        spawns.CustomSpawnPoints.Add(x, range.Start.y, z, Spawns.GetSpawnRotation(x, z, lookPoint.x, lookPoint.z));
                        ++spawnsCount;
                        if (spawnsCount > MaxSpawnsByArea) return;
                }
}

// запуск игры
stateProp.Value = GameStateValue;