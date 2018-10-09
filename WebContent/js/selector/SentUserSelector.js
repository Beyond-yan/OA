/**
 * 用户选择器
 */
var SentUserSelector = {
	/**
	 * 
	 * @param {} callbackOrConf 回调函数或配置选项，若为map类型，则表示为配置选项
	 * @param {} isSingle 是否单选
	 * @param {} isForFlow 是否为工作流的配置选择
	 * @return {} isSchema 是否根据schema选择
	 */
	getView : function(callbackOrConf,isSingle,map,isForFlow,isSchema) {
		//单选
		var callback=null;
		if(typeof(callbackOrConf)=='object'){
			this.scope=callbackOrConf.scope;
			callback=callbackOrConf.callback;
		}else{
			this.scope=this;
			callback=callbackOrConf;
		}
		var panel=this.initPanel(isSingle,isSchema,map);
		var window = new Ext.Window({
			title : '选择用户',
			iconCls:'menu-appuser',
			width : 765,
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
							var depName = '';
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
									depName += rows[i].data.depName;
								}
							}else{
								var selStore=Ext.getCmp('selectedUserGrid').getStore();
								for(var i=0;i<selStore.getCount();i++){
									if (i > 0) {
										userIds += ',';
										fullnames += ',';
										depName+=',';
									}
									userIds += selStore.getAt(i).data.userId;
									fullnames += selStore.getAt(i).data.fullname;
									depName += selStore.getAt(i).get('department.depName');
								}
							}
							if (callback != null) {
								callback.call(this.scope, userIds, fullnames,depName);
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
		return window;
	},

	initPanel : function(isSingle,isSchema,map) {
		var postUrl = new Ext.form.Hidden({
			id : 'postUrl',
			value:'/system/selectAppUser.do'
		});
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + Ext.getCmp('postUrl').getValue()
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'userId',
											type : 'int'
										}, 'fullname','title', {name: 'depName', mapping: 'department.depName'}]
							}),
					remoteSort : true
				});
		store.setDefaultSort('id', 'desc');

		store.load({
					params : {
						start : 0,
						limit : 20
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
		var schemaUrl = '/system/listDepartment.do';
		if(isSchema) schemaUrl = '/system/innerSentListDepartment.do?opt='+roleMap.get('DepartmentCommonId')+'&innerLimitLevel=90';
        var treePanel = new Ext.tree.TreePanel({
					id : 'treePanels',
					autoScroll:true,
					title : '部门列表',
					region : 'west',
					split : true,
					collapsible : true,
					width : 160,
					layout : 'fit',
					iconCls:'dep-user',
					loader : new Ext.tree.TreeLoader({
								url : __ctxPath + schemaUrl
							}),
					root : new Ext.tree.AsyncTreeNode({
								expanded : true
							}),
					rootVisible : false,
					listeners : {
						'click' : this.clickNode
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
					bbar : new HT.PagingBar({store : store,pageSize : 20})
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
		if(map!=null){
			map.each(function(key,value,index){ 
				var newData={userId:parseInt(key),fullname:value};
				var selGrid=Ext.getCmp('selectedUserGrid');
				var selStore=selGrid.getStore();
				var newRecord=new selStore.recordType(newData);
				selStore.add(newRecord);
	    	}); 
		}
		//TODO
		var contactPanel = new Ext.Panel({
					id : 'contactPanel',
					width : 540,
					height : 410,
					layout : 'border',
					border:false,
					items : [searchPanel, treePanel, contactGrid]
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
		users.reconfigure(new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/system/selectAppUser.do'
							}),
					baseParams:{
						depId : node.id
					},
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'userId',
											type : 'int'
										}, 'fullname','title',{name: 'depName', mapping: 'department.depName'}]
							}),
					remoteSort : true
				}), users.getColumnModel()) ;
		var store = users.getStore();
		users.getBottomToolbar().bind(store);
		store.load({
					params : {
						start : 0,
						limit : 20
					}
				});
	}
	}
};