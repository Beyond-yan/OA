PaintTemplateSelector=Ext.extend(Ext.Window,{
    searchFormPanel:null,
    gridPanel:null,
	constructor:function(_cfg){
	   Ext.applyIf(this,_cfg);
	   this.initUI();
	   PaintTemplateSelector.superclass.constructor.call(this,{
	        layout:'border',
	        width : 630,
	        iconCls:'menu-template',
	        title:'套红模板选择器',
			height : 380,
			modal : true,
	        border : false,
	        buttonAlign : 'center',
			buttons : [{
						iconCls : 'btn-ok',
						text : '确定',
						scope:this,
						handler : function() {
							var grid = this.gridPanel;
							var rows = grid.getSelectionModel().getSelections();
							var tNames = '';
							var tpath='';
							if(rows.length>0){
							   tName = rows[0].data.templateName;
							   tpath=rows[0].data.path;
							}
							if (this.callback != null) {
								this.callback.call(this,tName,tpath);
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
	        items:[/*this.searchFormPanel,*/this.gridPanel]
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
						name : 'Q_templateName_S_LK'
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
		var base = __ctxPath + "/js/core/redhead/";
	    this.gridPanel = new Ext.grid.GridPanel({
					region : 'center',
					tbar : this.topbar,
					// 使用RowActions
					rowActions : false,
					sm : sm,
					store : new Ext.data.ArrayStore({
						fields:['ptemplateId','templateName','path'],
						data:[[1,'t.doc',base+'t.doc']]
					}),
					columns : [new Ext.grid.RowNumberer(), sm, {
								dataIndex : 'ptemplateId',
								hidden : true
							}, {
								header : '模板名称',
								width:300,
								dataIndex : 'templateName'
							}]
				});
	    
	}
	
});