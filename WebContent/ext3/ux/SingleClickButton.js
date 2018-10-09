Ext.ns('Ext.ux.SingleClickButton');

Ext.define('Ext.ux.ButtonLimitingPlugin', { 
	alias: ['plugin.buttonlimiting','plugin.buttonlimitingplugin'], 
	seconds: 2, 
	constructor: function(config) { 
		var me = this; 
		Ext.apply(me, config); 
	}, 
	init: function(button) { 
		var me = this; 
		me.button = button; 
		me.getDelayedTask(); 
		button.on('click', me.onClickButton, me); 
	}, 
	onClickButton: function() { 
		var me = this, 
		button = me.button; 
		button.setDisabled(true); 
		me.task.delay(me.seconds * 1000); 
		return true; 
	}, 
	setButtonEnabled: function() { 
		var button = this.button; 
		button.setDisabled(false); 
	}, 
	getDelayedTask: function() { 
		this.task = new Ext.util.DelayedTask(this.setButtonEnabled, this); 
	}, 
	destory: function() { 
		var me = this, 
		button = me.button; 
		Ext.destroy(me.task); 
		delete me.button; 
		delete me.task; 
	} 
});