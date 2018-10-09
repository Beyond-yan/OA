/**
 * 分类管理
 * @class GlobalTypeManager
 * @extends Ext.Panel
 */
GlobalTypeManager=Ext.extend(Ext.Panel,{
	constructor:function(config){
		Ext.applyIf(this,config);
		this.initUIComponents();
		GlobalTypeManager.superclass.constructor.call(this,{
			id:'GlobalTypeManager',
			height:450,
			autoScroll:true,
			layout:'border',
			title:'档案分类管理',
			items:[
				this.leftPanel,
				this.centerPanel
			]
		});
	},
	initUIComponents:function(){
		 this.leftPanel=new Ext.Panel(
			{
			 	region:'west',
			 	title:'分类管理',
			 	layout:'anchor',
			 	collapsible : true,
				split : true,
				width : 200,
			 	items:[
			 		{
			 			xtype:'panel',
			 			layout:'fit',
			 			items:[
			 				{
				 				xtype:'combo',
				 				mode : 'local',
								editable : false,
								id:'comboGlobalType',
								value:'AR_FD',
								triggerAction : 'all',
				 				store:[	
				 					['AR_FD','全宗分类'],
				 					['AR_RL','案卷分类'],
				 					['AR_RLF','卷内文件分类'],
				 					['DIC','数据字典'],
				 					['REGULATION','规章制度']
				 					],
				 				listeners:{
							         scope: this,
							         'select': function(combo,record,index){
							         	var catKey=combo.getValue();
							         	var panelTree=Ext.getCmp('GlobalTypeTree');
							         	panelTree.loader=new Ext.tree.TreeLoader(
									    {
									        baseParams:{catKey:catKey},
									        dataUrl: __ctxPath+'/system/treeGlobalType.do',
									        requestMethod:'GET'
									    });
									    panelTree.selectedNode=null;
									    panelTree.root.reload();
									    var grid=Ext.getCmp('globalTypeCenGrid');
						             	if(grid!=null){
						             		var store=grid.getStore();
						             		store.url = __ctxPath + "/system/subGlobalType.do";
						             		store.baseParams={parentId:0,catKey:catKey};
											store.reload();
						             	}
							         }
							    }
			 				}
			 			]
			 		},
			 		{  
			             xtype:'treePanelEditor',
			             id:'GlobalTypeTree',
			             title:'分类树', 
			             split : true, 
			             border:false,
			             height:380,
			             autoScroll:true,
			             url:__ctxPath+'/system/treeGlobalType.do?catKey=PT',
			             onclick:function(node){
			 				this.selectedNode=node;
			             	var parentId=node.id;
			             	var grid=Ext.getCmp('globalTypeCenGrid');
			             	if(grid!=null){
			             		var catKey=Ext.getCmp('comboGlobalType').getValue();
			             		var store=grid.getStore();
			             		store.url = __ctxPath + "/system/subGlobalType.do";
			             		
			             		store.baseParams={parentId:parentId,catKey:catKey};
								store.reload();
			             	}
			             },
			             contextMenuItems:[  
			                         {  
			                             text : '新建分类',  
			                             scope : this,  
			                             iconCls:'btn-add',  
			                             handler : function(){
			                             	var globalTypeTree=Ext.getCmp('GlobalTypeTree');
			                             	var parentId=globalTypeTree.selectedNode.id;
			                             	var catKey=Ext.getCmp('comboGlobalType').getValue();

			                             	var globalTypeForm=new GlobalTypeForm({
			                             		parentId:parentId,
			                             		catKey:catKey,
			                             		callback:function(){
			                             			Ext.getCmp('GlobalTypeTree').root.reload();
			                             			Ext.getCmp('globalTypeCenGrid').getStore().reload();
			                             		}
			                             	});
			                             	globalTypeForm.show();
			                               
			                             }  
			                         },{
			                         	text:'修改分类',
			                         	scope:this,
			                         	iconCls:'btn-edit',
			                         	handler:function(){
			                         		var globalTypeTree=Ext.getCmp('GlobalTypeTree');
			                             	var proTypeId=globalTypeTree.selectedNode.id;
			                             	
			                             	var globalTypeForm = new GlobalTypeForm({
			                             		proTypeId:proTypeId,
			                             		callback:function(){
			                             			Ext.getCmp('GlobalTypeTree').root.reload();
			                             			Ext.getCmp('globalTypeCenGrid').getStore().reload();
			                             		}
			                             	});
			                             	globalTypeForm.show();
			                         	}
			                         } 
			                         ]
					 }
			 	]
			 }
			 
		 );
					
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/system/subGlobalType.do",
					baseParams:{parentId:0},
					root : 'result',
					remoteSort : true,
					fields : [{
						name : 'parentId',
						type : 'int'
					},{
								name : 'proTypeId',
								type : 'int'
							}, 'typeName', 'nodeKey',  'sn']
				});
		//this.store.setDefaultSort('proTypeId', 'desc');
		
		this.store.load();
		this.rowActions = new Ext.ux.grid.RowActions({
			header : '管理',
			width : 80,
			actions : [{
						iconCls : 'btn-last',
						qtip : '向下',
						style : 'margin:0 3px 0 3px'
					}, {
						iconCls : 'btn-up',
						qtip : '向上',
						style : 'margin:0 3px 0 3px'
					}]
		});
		this.rowActions.on('action', this.onRowAction, this);
		
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(),{
						header : 'parentId',
						dataIndex : 'parentId',
						hidden : true
					}, {
								header : 'proTypeId',
								dataIndex : 'proTypeId',
								hidden : true
							}, {
								header : '名称',
								dataIndex : 'typeName',
								editor:new Ext.form.TextField({
									allowBlank:false
								})
							}, {
								header : '节点Key',
								dataIndex : 'nodeKey',
								editor:new Ext.form.TextField({
									allowBlank:false
								})
							},{
								header : '序号',
								dataIndex : 'sn'
							},this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
		});
	
		var tbar=new Ext.Toolbar({
			items:[
			{
				text:'新建分类',
				iconCls:'btn-add',
				handler:function(){
					var globalTypeTree=Ext.getCmp('GlobalTypeTree');
					var selectedNode=globalTypeTree.selectedNode;
                 	
                 	if(!selectedNode){
                 		Ext.ux.Toast.msg('操作信息','请选择左树中的分类！');
                 		return;
                 	}
                 	var catKey=Ext.getCmp('comboGlobalType').getValue();

                 	var globalTypeForm=new GlobalTypeForm({
                 		parentId:selectedNode.id,
                 		catKey:catKey,
                 		callback:function(){
                 			Ext.getCmp('GlobalTypeTree').root.reload();
                 			Ext.getCmp('globalTypeCenGrid').getStore().reload();
                 		}
                 	});
                 	globalTypeForm.show();
				}
			},'-',{
				xtype:'button',
				text:'保存',
				iconCls:'btn-save',
				scope:this,
				handler:function(){
					var grid=this.centerPanel;
					
					var store=grid.getStore();
					var params = [];
					
					for (var i = 0; i < store.getCount(); i += 1) {
						var record = store.getAt(i);
						params.push(record.data);
					}

					Ext.Ajax.request({
							method : 'post',
							url : __ctxPath + '/system/mulSaveGlobalType.do',
							params : { data : Ext.encode(params)},
							success : function(request) {
								Ext.ux.Toast.msg('操作信息', '成功设置');
								store.reload();
								grid.getView().refresh();
								Ext.getCmp('GlobalTypeTree').root.reload();
							},
							failure : function(request) {
								Ext.ux.Toast.msg('操作信息', '设置出错，请联系管理员!');
							}
					});

				}
			},{
				text:'删除',
				iconCls:'btn-del',
				scope:this,
				handler:function(){
					var gridPanel = this.centerPanel;
					var selectRecords = gridPanel.getSelectionModel().getSelections();
					if (selectRecords.length == 0) {
						Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
						return;
					}
					var ids = Array();
					for (var i = 0; i < selectRecords.length; i++) {
						ids.push(selectRecords[i].data.proTypeId);
					}
					
					//不同类型目录的参数
					var param='';
					var reg=Ext.getCmp('comboGlobalType').getValue();
					if(reg=='AR_FD'){
						param='ArchFond';
					}else if(reg=='AR_RL'){
						param='ArchRoll';
					}else if(reg=='AR_RLF'){
						param='RollFile';
					}
					
					Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
										url : __ctxPath + '/system/multiDelGlobalType.do',
										params : {
											ids : ids,
											pageFlag : param
										},
										method : 'POST',
										success : function(response, options) {
											var res = Ext.util.JSON.decode(response.responseText);
											if(res.success==false){
												Ext.ux.Toast.msg('操作信息', res.message);
											}else{
												Ext.ux.Toast.msg('操作信息', '成功删除该分类！');
												gridPanel.getStore().reload();
												Ext.getCmp('GlobalTypeTree').root.reload();
												//Ext.getCmp('ArchRollGrid').getStore().reload();
											}
										},
										failure : function(response, options) {
											Ext.ux.Toast.msg('操作信息', '外键关系，不能删除！');
										}
									});
						}
					});
				
				}
			}
			]
		});
		
		this.centerPanel= new Ext.grid.EditorGridPanel({
			region:'center',
			title:'分类列表',
			tbar:tbar,
			clicksToEdit: 1,
			id:'globalTypeCenGrid',
	        store: this.store,
	        plugins : this.rowActions,
	        sm:sm,
	        cm: cm,
	        height:450
		});
		
	},//end of initUIComponents
	
	onRowAction : function(gridPanel, record, action, row, col) {
		var grid=Ext.getCmp('globalTypeCenGrid');
		var store=grid.getStore();
		switch (action) {
			case 'btn-up' :
				if(row==0){
					Ext.ux.Toast.msg('操作信息','已经为第一条!');
					return ;
				}
				
				var rd1=store.getAt(row-1);
				var rd2=store.getAt(row);
				store.removeAt(row);
				store.removeAt(row-1);
				store.insert(row-1,rd2);
				store.insert(row,rd1);
				break;
			case 'btn-last' :
				if(row==store.getCount()-1){
					Ext.ux.Toast.msg('操作信息','已经为最后一条!');
					return ;
				}
				var rd1=store.getAt(row);
				var rd2=store.getAt(row+1);
				
				store.removeAt(row+1);
				store.removeAt(row);
			
				store.insert(row,rd2);
				store.insert(row+1,rd1);

				break;
			default :
				break;
		}
	}
});