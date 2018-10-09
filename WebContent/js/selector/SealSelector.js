/**
 * 
 * @class SealSelector
 * @extends Ext.Window
 */
SealSelector=Ext.extend(Ext.Window,{
    searchFormPanel:null,
    gridPanel:null,
	constructor:function(_cfg){
	   Ext.applyIf(this,_cfg);
	   this.initUI();
	   SealSelector.superclass.constructor.call(this,{
	        layout:'border',
	        width : 630,
			height : 380,
			title:'印章选择器',
	        border : false,
	        modal : true,
	        buttonAlign : 'center',
			buttons : [{
					iconCls : 'btn-ok',
					text : '确定',
					scope:this,
					handler : function() {
						var grid = this.gridPanel;
						var rows = grid.getSelectionModel().getSelections();
						var tName = '';
						var tpath='';
						var base = __ctxPath + "/attachFiles/";
						if(rows.length>0){
							var present=this;
						   new passwordForm({
							   'ptemplateId':rows[0].data.ptemplateId,
							   'callback':function(){
								   tpath=base+rows[0].data.path;
								   if (present.callback!= null) {
									   present.callback.call(present,tpath);
									}
							 }
						   }).show();
						   
						}
					}
					}, {
						text : '取消',
						iconCls : 'btn-cancel',
						scope:this,
						handler : function() {
							this.close();
						}
					}],
	        items:[this.searchFormPanel,this.gridPanel]
	   });
	},
	initUI:function(){
		this.searchFormPanel=new Ext.FormPanel({
			region : 'north',
			height : 40,
			frame : false,
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				xtype : 'label',
				margins : {
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [{
						text : '请输入查询条件:'
					}, {
						text : '印章名称'
					}, {
						xtype : 'textfield',
						name : 'Q_sealName_S_LK'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						scope:this,
						handler : function() {
							$search({
								searchPanel : this.searchFormPanel,
								gridPanel : this.gridPanel
							});

						}
					}]
		});
		
		var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
		//var base = "http://10.224.5.179:8080/oa/z/";
		var base = __ctxPath + "/attachFiles/";
	    this.gridPanel = new Ext.grid.GridPanel({
					region : 'center',
					tbar : this.topbar,
					// 使用RowActions
					rowActions : false,
					sm : sm,
					store :new Ext.data.ArrayStore({
						autoLoad : true,
						url : __ctxPath + '/archive/comboArchTemplate.do?Q_isGenre_L_EQ=1',
						fields : ['ptemplateId', 'templateName','path']
					}),
					columns : [new Ext.grid.RowNumberer(), sm, {
								dataIndex : 'ptemplateId',
								hidden : true
							}, {
								header : '印章名称',
								width:300,
								dataIndex : 'templateName'
							}]
				});
	    
	}
	
});