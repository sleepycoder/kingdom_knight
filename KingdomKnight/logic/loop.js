/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/25/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */

function DoLogicLoop(time) {
  if (Controller.selected_character && Controller.destroyed) {
    Controller.selected_character = null;
  }

  Utilities.RemoveDestroyedOnes(g_releasing_effects);
  Utilities.RemoveDestroyedOnes(g_characters);
  g_map.RefillCharacters();

  for (var i = 0; i < g_releasing_effects.length; ++i) {
    g_releasing_effects[i].Do(time);
  }

  var effects = null;
  for (var i = 0; i < g_characters.length; ++i) {
    g_characters[i].Execute(time);
    g_characters[i].DoAction(time);
    if (!g_characters[i].destroyed) {
      effects = g_characters[i].effects;
      for (var j = 0; j < effects.length; ++j) {
        if (!effects[j].destroyed) {
          effects[j].Perform(time);
        }
      }
      Utilities.RemoveDestroyedOldOnes(effects, time - 3000);
    }
  }
}