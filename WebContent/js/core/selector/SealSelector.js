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
//							var sealIds = '';
							var sealNames = '';
							var path='';
							var belongName='';
							if(rows.length>0){
							   sealName = rows[0].data.sealName;
							   belongName=rows[0].data.belongName;
							   path=rows[0].data.sealPath;
							}

							if (this.callback != null) {
								this.callback.call(this,sealName,path,belongName);
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
		var base = __ctxPath + "/js/core/sign_esp/";
	    this.gridPanel = new Ext.grid.GridPanel({
					region : 'center',
					tbar : this.topbar,
					// 使用RowActions
					rowActions : false,
					sm : sm,
					store : new Ext.data.ArrayStore({
						fields:['sealName','sealPath','belongName'],
						data:[['交委办公室',base+'1.gif.esp','办公室_123456'],
						      ['重庆市交通运行监测与应急调度中心',base+'cqjt_ddzx.esp','重庆市交通运行监测与应急调度中心_yxjcyddzx']]
					}),
					columns : [new Ext.grid.RowNumberer(), sm, {
								header : '印章名称',
								width:150,
								dataIndex : 'sealName'
							},{
								header : '所属人员',
								width:150,
								dataIndex : 'belongName'
							}]
				});
	    
	}
	
});