/**
 * 用户选择器
 */
var MutiDeptOfUserSelector = {
	/**
	 * 
	 * @param {} callbackOrConf 回调函数或配置选项，若为map类型，则表示为配置选项
	 * @param {} isSingle 是否单选
	 * @param {} isForFlow 是否为工作流的配置选择
	 * @return {}
	 */
	getView : function(callbackOrConf,isSingle,isForFlow,depId,map) {
		
		this.depId = depId;
		//单选
		var callback=null;
		if(typeof(callbackOrConf)=='object'){
			this.scope=callbackOrConf.scope;
			callback=callbackOrConf.callback;
		}else{
			this.scope=this;
			callback=callbackOrConf;
		}
		
		var panel=this.initPanel(isSingle,depId);
		var window = new Ext.Window({
			title : '选择用户',
			iconCls:'menu-appuser',
			width : 640,
			height : 480,
			layout:'fit',
			border:false,
			closeAction: 'hide',
			items : [panel],
			resizable:true,
			modal:true,
			buttonAlign : 'center',
			buttons : [{
						text : '确认',
						iconCls:'btn-ok',
						scope:this,
						handler : function(){
							var userIds = '';
							var fullnames = '';
							
							if(isSingle){//选择单个用户
								var grid = Ext.getCmp('contactGrid');
								var rows = grid.getSelectionModel().getSelections();
								
								for (var i = 0; i < rows.length; i++) {
									if (i > 0) {
										userIds += ',';
										fullnames += ',';
									}
									userIds += rows[i].data.userId;
									fullnames += rows[i].data.fullname;
								}
							}else{
								var selStore=Ext.getCmp('selectedUserGrid').getStore();
								for(var i=0;i<selStore.getCount();i++){
									if (i > 0) {
										userIds += ',';
										fullnames += ',';
									}
									userIds += selStore.getAt(i).data.userId;
									fullnames += selStore.getAt(i).data.fullname;
								}
							}
							
							if (callback != null) {
								callback.call(this.scope, userIds, fullnames);
							}
							window.close();
						}
					}, {
						text : '关闭',
						iconCls:'btn-cancel',
						handler : function() {
							window.close();
						}
					}]
		});
		
		if(isForFlow){
			window.addButton(new Ext.Button({
				text:'发起人',
				iconCls:'menu-subuser',
				scope:this,
				handler:function(){
					callback.call(this, '__start', '[发起人]');
					window.close();
				}
			}));
			
			window.addButton(new Ext.Button({
				text:'上级',
				iconCls:'btn-super',
				scope:this,
				handler:function(){
					callback.call(this, '__super', '[上级]');
					window.close();
				}
			}));
		}
		//向集合中放入已经选择的部门
		if(map!=null){
			map.each(function(key,value,index){   
	       		//collection.add(parseInt(key),{id:parseInt(key),name:value});
	       		var userId=parseInt(key);
				var fullname=value;
				var selGrid=Ext.getCmp('selectedUserGrid');
				var selStore=selGrid.getStore();
				
				
					var newData={userId:userId,fullname:fullname};
					var newRecord=new selStore.recordType(newData);
					selGrid.stopEditing();
					selStore.add(newRecord);
				
	    	}); 
		}
		return window;
	},

	initPanel : function(isSingle,depId) {
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/system/getDeptsUserAppUser.do'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'userId',
											type : 'int'
										}, 'fullname','title']
							}),
					remoteSort : true
				});
		store.setDefaultSort('id', 'desc');

		store.load({
					params : {
						start : 0,
						limit : 12,
						depIds:this.depId
					}
				});
		var sm=null;
		if(isSingle){
			sm=new Ext.grid.CheckboxSelectionModel({singleSelect: true});
		}else{
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : "用户名",
								dataIndex : 'fullname',
								renderer:function(value,meta,record){
									var title=record.data.title;
									if(title==1){
										return '<img src="'+__ctxPath+'/images/flag/man.png"/>&nbsp;'+value;
									}else{
										return '<img src="'+__ctxPath+'/images/flag/women.png"/>&nbsp;'+value;
									}
								},
								width : 60
							}],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 120
					},
					listeners : {
						hiddenchange : function(cm, colIndex, hidden) {
							saveConfig(colIndex, hidden);
						}
					}
				});

		var treePanel = new Ext.tree.TreePanel({
					id : 'treePanels',
					autoScroll:true,
					title : '按部门分类 ',
					iconCls:'dep-user',
					loader : new Ext.tree.TreeLoader({
								url : __ctxPath + '/system/listByDepIdsDepartment.do?depIds='
									+ this.depId
							}),
					root : new Ext.tree.AsyncTreeNode({
								expanded : true
							}),
					rootVisible : false,
					listeners : {
						'click' : this.clickNode
					}
				});

		var rolePanel = new Ext.tree.TreePanel({
					id : 'rolePanel',
					autoScroll:true,
					iconCls:'role-user',
					title : '按角色分类 ',
					loader : new Ext.tree.TreeLoader({
								url : __ctxPath + '/system/treeAppRole.do'
							}),
					root : new Ext.tree.AsyncTreeNode({
								expanded : true
							}),
					rootVisible : false,
					listeners : {
						'click' : this.clickRoleNode
					}
				});
		var onlinePanel = new Ext.Panel({
					id : 'onlinePanel',
					autoScroll:true,
					iconCls:'online-user',
					title : '在线人员  ',
					listeners:{
						'expand':this.clickOnlinePanel
					}
				});

		var contactGrid = new Ext.grid.EditorGridPanel({
					title:'用户列表',
					autoScroll:true,
					id : 'contactGrid',
					region : 'center',
					height : 380,
					autoWidth:false,
					store : store,
					shim : true,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new HT.PagingBar({store : store,pageSize : 12})
				});
		
		contactGrid.on('rowdblclick',function(grid,rowIndex,e){
				var contactGrid = Ext.getCmp('contactGrid');
				var selGrid=Ext.getCmp('selectedUserGrid');
				var selStore=selGrid.getStore();
				var rows = contactGrid.getSelectionModel().getSelections();
				for(var i=0;i<rows.length;i++){
					var userId=rows[i].data.userId;
					var fullname=rows[i].data.fullname;
					var isExist=false;
					//查找是否存在该记录
					for(var j=0;j<selStore.getCount();j++){
						if(selStore.getAt(j).data.userId==userId){
							isExist=true;
							break;
						}
					}
					if(!isExist){
						var newData={userId:userId,fullname:fullname};
						var newRecord=new selStore.recordType(newData);
						selGrid.stopEditing();
						selStore.add(newRecord);
					}
				}
			
		});	//end of contact grid
		
		
		var searchPanel=new Ext.FormPanel(
			{
				height:38,
				region:'north',
				layout:'hbox',
				bodyStyle:'padding:6px 2px 2px 2px',
				layoutConfigs:{
					align:'middle'
				},
				defaultType:'label',
				defaults:{
					margins:'0 4 0 4'
				},
				items:[
						{
							text:'用户姓名'
						},
						{
							xtype:'textfield',
							name:'Q_fullname_S_LK',
							width:260
						},
						{
							xtype:'button',
							text:'查询',
							iconCls:'btn-search',
							handler:function(){
								searchPanel.getForm().submit({
									//url:__ctxPath+'/system/selectInDepAppUser.do?depId='+ curUserInfo.depId,
									url:__ctxPath+'/system/listAppUser.do',
									method:'post',
									success : function(formPanel, action) {
										contactGrid.getStore().proxy.conn.url=__ctxPath+'/system/listAppUser.do';
										var result = Ext.util.JSON.decode(action.response.responseText);
										contactGrid.getStore().loadData(result);
									}
								});
							}
						}
					]
			}
		);
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		
		var selectedUserGrid = new Ext.grid.EditorGridPanel({
			id : 'selectedUserGrid',
			title:'已选用户',
			height : 400,
			width:165,
			autoScroll:true,
			store : new Ext.data.ArrayStore({
    			fields: ['userId', 'fullname']
			}),
			trackMouseOver : true,
			sm:csm,
			columns:[
					csm,
					new Ext.grid.RowNumberer(),
					{
						header : "用户名",
						dataIndex : 'fullname'
					}
			]
		});
		
		var southPanel=new Ext.Panel({
			width:200,
			region:'east',
			layout:'column',
			border:false,
			items:[
				new Ext.Panel({
					frame:true,
					width:35,
					height:430,
					layout: {
                                type:'vbox',
                                pack:'center',
                                align:'stretch'
                            },
                            defaults:{margins:'0 0 5 0'},
					items:[
						{
							xtype:'button',
							iconCls:'add-all',
							text:'',
							handler:function(){
								var contactGrid = Ext.getCmp('contactGrid');
								var selGrid=Ext.getCmp('selectedUserGrid');
								var selStore=selGrid.getStore();
								var rows = contactGrid.getSelectionModel().getSelections();
								for(var i=0;i<rows.length;i++){
									
									var userId=rows[i].data.userId;
									var fullname=rows[i].data.fullname;
									var isExist=false;
									//查找是否存在该记录
									for(var j=0;j<selStore.getCount();j++){
										if(selStore.getAt(j).data.userId==userId){
											isExist=true;
											break;
										}
									}
									if(!isExist){
										var newData={userId:userId,fullname:fullname};
										var newRecord=new selStore.recordType(newData);
										selGrid.stopEditing();
										selStore.add(newRecord);
									}
								}
							}
						},
						{
							xtype:'button',
							text:'',
							iconCls:'rem-all',
							handler:function(){
								var selGrid=Ext.getCmp('selectedUserGrid');
								var rows = selGrid.getSelectionModel().getSelections();
								var selStore=selGrid.getStore();
								
								for(var i=0;i<rows.length;i++){
									selGrid.stopEditing();
									selStore.remove(rows[i]);
								}
							}
						}
					]
				}),selectedUserGrid
			]
		});
		
		//TODO
		var contactPanel = new Ext.Panel({
					id : 'contactPanel',
					width : 540,
					height : 410,
					layout : 'border',
					border:false,
					items : [searchPanel,{
								region : 'west',
								split : true,
								header:false,
								collapsible : true,
								width : 160,
								layout : 'accordion',
								items : [treePanel]
							}, contactGrid]
		});
		if(!isSingle){//非单用户的
			contactPanel.add(southPanel);
			contactPanel.doLayout();
		}
		return contactPanel;
	},

	clickNode : function(node) {
		if (node != null) {
			var users = Ext.getCmp('contactGrid');
			var store = users.getStore();
			store.proxy.conn.url = __ctxPath + '/system/selectAppUser.do';
			store.baseParams = {
				depId : node.id
			};
			store.load({
						params : {
							start : 0,
							limit : 12
						}
					});
		}
	},

	clickRoleNode : function(node) {
		if (node != null) {
			var users = Ext.getCmp('contactGrid');
			var store = users.getStore();
			store.baseParams = {
				roleId : node.id
			};
			store.proxy.conn.url =__ctxPath + '/system/findAppUser.do';
			store.load({
					params : {
						start : 0,
						limit : 12
					}
				});
		}
	},
	clickOnlinePanel:function(){
		var users = Ext.getCmp('contactGrid');
		var store = users.getStore();
		store.proxy.conn.url =__ctxPath + '/system/onlineAppUser.do';
		store.load({
				params : {
					start : 0,
					limit : 200
				}
		});
	}
};
