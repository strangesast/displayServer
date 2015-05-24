var express = require('express');
var router = express.Router();
var Promise = require('es6-promise').Promise;
var display_addon = require('displayControlAddon/build/Release/displayaddon.node');
var display_lib = require('displayLibJS')


router.post('/', function(req, res) {
  var name = req.body.name

  var panel_l = display_lib.DLPanelDef();
  panel_l.panel_location = new display_lib.XYInfo(0,0,60,32);
  panel_l.total_size = new display_lib.XYInfo(0,0,120,32);
  panel_l.control = 1;
  panel_l.layout = 1; //reversed
  panel_l.position = 1; //PP_L
  
  var panel_r = display_lib.DLPanelDef();
  panel_r.panel_location = new display_lib.XYInfo(60,0,60,32);
  panel_r.total_size = new display_lib.XYInfo(0,0,120,32);
  panel_r.control = 2;
  panel_r.layout = 0; //normal
  panel_r.position = 2; //PP_R
  
  var clear_cmd = display_lib.DLDisplayCmd();
  clear_cmd.display_request = display_lib.DisplayRequest.DISPLAY_CLEAR;
  clear_cmd.update_type = display_lib.UpdateType.UPDATE_ALL;
  clear_cmd.panel = display_lib.GenericScope.GS_APPLIES_TO_ALL;
  clear_cmd.bright_level = 10;
  clear_cmd.is_final = 1;
  
  
  var rect = display_lib.DLRect();
  rect.xy = new display_lib.XYInfo(0, 0, 120, 32);
  rect.line_color = new display_lib.DLColor(239,112,35);
  rect.panel = 1;
  rect.line_width = 2;
  
  var textbox = display_lib.DLTextbox();
  textbox.xy = new display_lib.XYInfo(3,3,114,18);
  textbox.fg_color = new display_lib.DLColor(43,89,249);
  //textbox.bg_color = new display_lib.DLColor(249,197,166);
  textbox.bg_color = new display_lib.DLColor(0,0,0);
  textbox.border_color = new display_lib.DLColor(0, 200, 0, 80);
  textbox.border_color.set_intensity (80);
  textbox.border_width = 1;
  textbox.scroll_type = 3; //SCROLL_V
  textbox.char_buffer_size = 0;
  textbox.control = 12;
  
  var text = display_lib.DLText();
  text.text = name;
  //text.text_action = TextAction.TEXT_APPEND;
  text.text_action = 2; //TEXT_REPLACE
  text.message = 0;
  //text.position = 0;
  text.parent_control = 12;
  text.is_final = 1;
  
  //var text2  = display_lib.DLText();
  //text2.message = 0;
  //text2.text = " JUMPED";
  //text2.fg_color = new display_lib.DLColor(121,158,215);
  //text2.text_action = 1; //TEXT_APPEND
  //text2.parent_control = 12;
  //
  //var text3  = display_lib.DLText();
  //text3.message = 0;
  //text3.text = " OVER A LAZY DOG";
  //text3.text_action = 1; //TEXT_APPEND
  //text3.parent_control = 12;
  //text3.is_final = 1;
  
  //    var result = panel_l.BuildMessage ();
  //    var send_buf = result.result_buffer.slice(0,result.result_bytes);
  //    console.log ("about to write");
  //    console.log(addon.test (send_buf));
  
  //console.log ("about to open")
  //var port = display_addon.connect();
  //display_addon.open ();
  
  function reportStatus(buf) {
    console.log(buf.toString());
  }
  
  
  display_addon.set_emulator ("192.168.0.13", 1001);
  console.log ("about to write");
  var result = panel_l.BuildMessage ();
  var send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send_config(send_buf, 1);
  
  result = panel_r.BuildMessage ();
  send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send_config(send_buf, 2);
  
  result = clear_cmd.BuildMessage ();
  send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send(send_buf);
  
  display_addon.get_status(reportStatus);
  
  result = rect.BuildMessage ();
  send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send(send_buf);
  
  result = textbox.BuildMessage ();
  send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send(send_buf);
  
  result = text.BuildMessage ();
  send_buf = result.result_buffer.slice(0,result.result_bytes);
  display_addon.send(send_buf);
  
  //result = text2.BuildMessage ();
  //send_buf = result.result_buffer.slice(0,result.result_bytes);
  //display_addon.send(send_buf);
  
  //result = text3.BuildMessage ();
  //send_buf = result.result_buffer.slice(0,result.result_bytes);
  //display_addon.send_request(send_buf, reportStatus);
  
  console.log ("written");
  
  display_addon.get_status(reportStatus);
  
  res.send('hello')

});


module.exports = router;
