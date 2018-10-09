Ext.ns("ProDefinitionSetting");
/**
 * 流程定义人员设置
 */
 var ProDefinitionSetting=function(defId,name){
 	this.defId=defId;
 	this.name=name;
 	var leftPanel=new Ext.Panel({
 		title:'流程示意图',
 		layout:'fit',
 		width:480,
 		split:true,
 		region:'west',
 		autoScroll:true,
 		margin:'5 5 5 5',
 		autoLoad:{
 			url:__ctxPath+'/flow/processImage.do?defId='+this.defId
 		}
 	});
 	
 	var rightNorthPanel=this.getRightNorthPanel(defId);
 	var rightCenterPanel=this.getRightCenterPanel(defId);
 	
 	var rightPanel=new Ext.Panel({
 		region:'center',
 		layout:'anchor',
 		height:800,
 		autoScroll:true,
 		items:[
 			rightNorthPanel,
 			rightCenterPanel
 		]
 	});
 	
 	var mainPanel=new Ext.Panel({
 		id:'ProDefinitionSetting'+this.defId,
 		title:'流程设置－'+this.name,
 		layout:'border',
 		autoScroll:true,
 		iconCls:'btn-setting',
 		items:[
 			leftPanel,
 			rightPanel
 		]
 	});
 	
 	return mainPanel;
 };
 
 ProDefinitionSetting.prototype.getRightNorthPanel=function(defId){
 	var toolbar = new Ext.Toolbar({
		items : [{
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var params = [];
				for (i = 0, cnt = store.getCount(); i < cnt; i += 1) {
					var record = store.getAt(i);
					if(record.data.assignId=='' || record.data.assignId==null){//设置未保存的assignId标记，方便服务端进行gson转化
						record.set('assignId',-1);
					}
					if (record.dirty) // 得到所有修改过的数据
						params.push(record.data);
				}
				if (params.length == 0) {
					Ext.ux.Toast.msg('信息', '没有对数据进行任何更改');
					return;
				}
				Ext.Ajax.request({
					method : 'post',
					url : __ctxPath
							+ '/flow/saveProUserAssign.do',
					success : function(request) {
						Ext.ux.Toast.msg('操作信息', '成功设置流程表单');
						store.reload();
						grid.getView().refresh();
					},
					failure : function(request) {
						Ext.MessageBox.show({
							title : '操作信息',
							msg : '信息保存出错，请联系管理员！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
					},
					params : {
						data : Ext.encode(params)
					}
				});
			}
		}]
	});
	
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/flow/listProUserAssign.do?defId='+this.defId
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id',
							fields : ['assignId', 'deployId', 'activityName',
									'userId','username', 'roleId','roleName']
						})
			}); 
     
     store.load();
	
    var row = 0;
	var col = 0;
	//用户的行选择器
	var userEditor = new Ext.form.TriggerField({
				triggerClass : 'x-form-browse-trigger',
				onTriggerClick : function(e) {
					UserSelector.getView(function(ids, names) {
								var store = grid.getStore();
								var record = store.getAt(row);
								record.set('userId', ids);
								record.set('username', names);
							},false,true).show();
				}
	});
	
	var roleEditor=new Ext.form.TriggerField({
				triggerClass : 'x-form-browse-trigger',
				onTriggerClick : function(e) {
					RoleSelector.getView(function(ids, names) {
								var store = grid.getStore();
								var record = store.getAt(row);
								record.set('roleId', ids);
								record.set('roleName', names);
							},false).show();
				}
			});
	var grid = new Ext.grid.EditorGridPanel({
				title:'人员设置',
				id:'ProDefinitionSettingGrid'+this.defId,
				autoHeight:true,
				store : store,
				tbar : toolbar,
				columns : [new Ext.grid.RowNumberer(),{
							header : "assignId",
							dataIndex : 'assignId',
							hidden : true
						}, {
							header : "deployId",
							dataIndex : 'deployId',
							hidden : true
						}, {
							header : "流程任务",
							dataIndex : 'activityName',
							width : 100,
							sortable : true
						}, {
							dataIndex:'userId',
							header:'userId',
							hidden : true
						},{
							header : "用户",
							dataIndex : 'username',
							width : 150,
							sortable : true,
							editor:userEditor
						}, {
							dataIndex : 'roleId',
							hidden:true
						}, {
							header : '角色',
							dataIndex:'roleName',
							width:150,
							editor:roleEditor
						}]
			});
			grid.on('cellclick', function(grid,rowIndex,columnIndex,e) {
				row=rowIndex;
			});		 
	return grid;
 };
 
/**
 * 表单编辑器
 * @param {} defId
 */
ProDefinitionSetting.prototype.getRightCenterPanel=function(defId){
	
	var store = new Ext.data.JsonStore({
		url : __ctxPath + "/flow/listFormDef.do?defId=" + defId,
		root : 'result',
		remoteSort : true,
		fields : [{
					name : 'formDefId',
					type : 'int'
				}, 'formName', 'activityName',
				'deployId']
	});
	// 加载数据
	store.load();

	
	var gridPanel = new Ext.grid.EditorGridPanel({
				tbar : new Ext.Toolbar({
							height : 30,
							items : [{
										text:'添加所有定义',
										iconCls:'btn-add',
										handler:function(){
											Ext.Ajax.request({
												method : 'post',
												url : __ctxPath
														+ '/flow/addAllFormDef.do',
												success : function(request) {
													Ext.ux.Toast.msg('操作信息', '成功添加所有流程任务表单定义');
													store.reload();
												},
												failure : function(request) {
													Ext.MessageBox.show({
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
												},
												params : {
													defId:defId
												}
											});
										}
									}]
						}),
				title : '表单设置',
				id : 'ProDefinitionFormGrid' + defId,
				autoHeight : true,
				store : store,
				columns : [new Ext.grid.RowNumberer(), {
							header : "formDefId",
							dataIndex : 'assignId',
							hidden : true
						}, {
							dataIndex:'deployId',
							hidden:true
						},{
							header : "流程任务",
							dataIndex : 'activityName',
							width : 100,
							sortable : true
						}, {
							header : "表单",
							dataIndex : 'formName'
						},{
							header:'管理',
							dataIndex:'formDefId',
							renderer:function(formDefId, metadata, record){
								var str='';
								var activityName=record.data.activityName;
								var deployId=record.data.deployId;
								if(formDefId==null || formDefId==''){
									return '';
								}else{
									str+='<button onclick="ProDefinitionSetting.formDesign('+formDefId + ',\'' + activityName+'\')" class="btn-form-design" title="设置表单">&nbsp;</button>';
								}
								str+='&nbsp;<button onclick="ProDefinitionSetting.formEditor('+deployId + ',\'' + activityName+'\')" class="btn-form-tag" title="编辑表单源代码">&nbsp;</button>'
								
								return str;
							}
						}]
			});
	gridPanel.on('cellclick', function(grid,rowIndex,columnIndex,e) {
		row=rowIndex;
	});	
	return gridPanel;
};
 
 /**
  * 角色选择
  * @param {} rowIndex
  * @param {} colIndex
  * @param {} defId
  */
 ProDefinitionSetting.roleSelect=function(rowIndex,colIndex,defId){
 	var grid=Ext.getCmp("ProDefinitionSettingGrid"+defId);
 	var record=grid.getStore().getAt(rowIndex);
 	grid.getStore().reload();
 	grid.doLayout();
 };
 /**
  * 
  */
 ProDefinitionSetting.formDesign=function(formDefId,activityName){
 	var designWin=new FormDesignWindow(
 		{
 			formDefId:formDefId,
 			activityName:activityName
 		}
 	);
 	designWin.show();
 };
 
 ProDefinitionSetting.formEditor=function(deployId,activityName){
 	var vmEditorWin=new FormEditorWindow({
 		deployId:deployId,
 		activityName:activityName
 	});
 	vmEditorWin.show();
 }
 
