/**
 * @author:
 * @class sealApplyView
 * @extends Ext.Panel
 * @description [SealApply]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */

//盖章状态
function sealedStateRenderer(val, p, record){    	
	if(val == 0){
		if(record.data.applyState == 2){
			if(Ext.getCmp('curUserInfo.roles').getValue() != ''){
				return '未盖章<img src="images/system/edit.gif" style="cursor: pointer" onclick="setSealed('+ record.data.id +')" qtip="设为已盖章" />';
			}else{
				return '未盖章';			
			}
		}else{
			return '未盖章';
		}
	}else{
		return '已盖章';
	}
}

//终止流程
function sealedEndProRenderer(val, p, record){  
	var reHtml = '<img src="images/btn/flow/view.png" style="cursor: pointer" onclick="viewProcess('+ record.data.runId +','+ record.data.defId +',\''+ record.data.piId +'\',\''+ record.data.subject +'\')" qtip="查看流程" />';
	if(record.data.runStatus == 1){
		if(record.data.userId == curUserInfo.userId || Ext.getCmp('curUserInfo.roles').getValue() != ''){
			reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopSealedProcess('+ record.data.id +',\''+ record.data.piId +'\')" qtip="终止流程" />';
		}
	}
	return reHtml;
}

function viewProcess(runId, defId, piId, subject) {	
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, subject);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

/*
 * 用印流程终止
 */
function stopSealedProcess(id, piId){	
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
	    if (btn == 'yes'){	        
			//终止流程		
			Ext.Ajax.request({
				url : __ctxPath + '/flow/stopProcessRun.do',
				params:{
					'piId':piId
				},
				success : function(resp, options){
					Ext.ux.Toast.msg('操作信息','操作成功');		
					Ext.getCmp('sealApplyViewGrid').getStore().reload()
				},
				failure : function(response) {
						Ext.Msg.alert("提示", "终止失败！");
				}
			});		
			//修改数据库的审核状态		
			Ext.Ajax.request({
				url : __ctxPath + '/flow/saveSealApply.do',
				params:{
					'sealApply.id':id,						
					'sealApply.applyState':3,
					'sealApply.updateBy':new Date().dateFormat('Y-m-d H:i:s')
				},
				success : function(resp, options){
					Ext.getCmp('sealApplyViewGrid').getStore().reload();		
				}
			});
	    }
	});	
}

//盖章
function setSealed(id){	
	Ext.Ajax.request({
		url : __ctxPath + '/flow/saveSealApply.do',
		params:{
			'sealApply.id':id,
			'sealApply.sealedState':1,
			'sealApply.operatorUser.userId':curUserInfo.userId,
			'sealApply.sealedDate':new Date().dateFormat('Y-m-d H:i:s'),
			'sealApply.updateBy':curUserInfo.fullname
		},
		success : function(resp, options){
			Ext.ux.Toast.msg('操作信息','设置已盖章成功！');		
			Ext.getCmp('sealApplyViewGrid').getStore().reload()
		}
	});					
}

SealApplyView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SealApplyView.superclass.constructor.call(this, {
							id : 'SealApplyView',
							title : '用印申请管理',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				this.applyStateRenderer = function(val, p, record){    	
					if(val == 1){
						return '审批中';
					}else if(val == 2){
						return '审批通过';
					}else if(val == 3){
						return '终止';
					}
				}
				
				// 初始化搜索条件Panel
				this.searchPanel=new HT.SearchPanel({
							layout : 'form',
							region : 'north',
							colNums:1,
							items:[{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									id : 'curUserInfo.roles',
									xtype : 'hidden',
									flex:1
																	
								},{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '申请人:',
									width : 105
								},
										{
											xtype : 'textfield',
											name : 'sealApplyView.userName',
											id : 'sealApplyView.userName',
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择人员',
											handler : function() {
												UserSelector
														.getView(
																function(id, name) {
																	Ext.getCmp('sealApplyView.userName').setValue(name);
																	Ext.getCmp('sealApplyView_Q_appUser.userId_L_EQ').setValue(id);
																},true,false).show();
											}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('sealApplyView.userName').setValue('');
												Ext.getCmp('sealApplyView_Q_appUser.userId_L_EQ').setValue('');
											}
										} ]
							},{
									fieldLabel:'申请人',
									name : 'Q_appUser.userId_L_EQ',
									id : 'sealApplyView_Q_appUser.userId_L_EQ',
									xtype : 'hidden',
									flex:1
																	}
																,{
																	xtype : 'container',
																	style : 'padding-left:0px;margin-bottom:4px;',
																	id : 'depContainer',
																	layout : 'column',
																	items : [
																			{
																				xtype : 'label',
																				style : 'padding-left:0px;',
																				text : '申请部门:',
																				width : 105
																			},
																			{
																				xtype : 'textfield',
																				name : 'sealApplyView.department',
																				id : 'sealApplyView.department',
																				editable : false,
																				readOnly : true,
																				width : 320
																			},
																			{
																				xtype : 'button',
																				iconCls : 'btn-dep-sel',
																				text : '选择部门',
																				handler : function() {
																					DepSelector
																							.getView(
																									function(id,name) {
																										Ext.getCmp('sealApplyView.department').setValue(name);
																										Ext.getCmp('sealApplyView_department.depId_L_EQ').setValue(id);
																									},true)
																							.show();
																				}
																			},
																			{
																				xtype : 'button',
																				text : '清除记录',
																				iconCls : 'reset',
																				handler : function() {
																					Ext.getCmp('sealApplyView.department').setValue('');
																					Ext.getCmp('sealApplyView_department.depId_L_EQ').setValue('');
																				}
																			} ]
																},
															 							 																																					 								{
									fieldLabel:'departmentId',
									name : 'Q_department.depId_L_EQ',
									id : 'sealApplyView_department.depId_L_EQ',
									flex:1,xtype:'hidden'
																	}
																,{
																	xtype : 'radiogroup',
																	fieldLabel : '审批状态',
																	width : 240,
																	flex:1,
																	items : [{
																		boxLabel : '所有',
																		name : 'Q_processRun.runStatus_SN_EQ',
																		inputValue : null,
																		checked : true
																	},{
																				boxLabel : '审批中',
																				name : 'Q_processRun.runStatus_SN_EQ',
																				inputValue : 1
																			}, {
																				boxLabel : '审批通过',
																				name : 'Q_processRun.runStatus_SN_EQ',
																				inputValue : 2
																			}]
																}
															 							 							 															],
								buttons:[
									{
										text:'查询',
										scope:this,
										iconCls:'btn-search',
										handler:this.search
									},{
										text:'重置',
										scope:this,
										iconCls:'btn-reset',
										handler:this.reset
									}							
								]	
				});// end of searchPanel
								
				this.topbar = new Ext.Toolbar({
					items : [{
						iconCls : 'btn-add',
						text : '添加',
						xtype : 'button',
						scope : this,
						handler : this.createRs
					}]
				});
	
				this.gridPanel=new HT.GridPanel({
					region:'center',
					// 使用RowActions
					rowActions:true,
					tbar:this.topbar,
					id:'sealApplyViewGrid',
					url : __ctxPath + "/flow/listSealApply.do",
					fields : [{
									name : 'id',
									type : 'int'
								},{name:'userId',mapping:'appUser.userId'},{name:'fullname',mapping:'appUser.fullname'},
								{name:'department',mapping:'department.depName'},
								'sealName','oppositeName','reason','sealedState',
								'sealedDate', 'applyState','processInsId','createDate'
								,{name:'runId',mapping:'processRun ? obj.processRun.runId : null'}
								,{name:'runStatus',mapping:'processRun ? obj.processRun.runStatus : null'}
								,{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'}
								,{name:'piId',mapping:'processRun ? obj.processRun.piId : null'}
								,{name:'subject',mapping:'processRun ? obj.processRun.subject : null'}
								,'useCount'
								,{name:'operatorUserName',mapping:'operatorUser ? obj.operatorUser.fullname : null'}
								],
					columns:[
								{
									header : 'id',
									dataIndex : 'id',
									hidden : true
								}
																																																								,{
																	header : '申请人',
																	dataIndex : 'fullname'
								}
																																																,{
																	header : '申请部门',
																	dataIndex : 'department'
								}
																																																,{
																	header : '用章文档名称',
																	dataIndex : 'sealName'
								}
																																																/*,{
																	header : '对方单位名称',
																	dataIndex : 'oppositeName'
								}*/
																																																,{
																	header : '申请用途',
																	dataIndex : 'reason'
								},{
									
																	header : '用印次数',
																	dataIndex : 'useCount'
								
								}
																																																,{
																	header : '盖章状态',
																	dataIndex : 'sealedState',
																	renderer : sealedStateRenderer
								}
																																																,{
																	header : '盖章时间',
																	dataIndex : 'sealedDate'
								},{								
									
																	header : '经办人',
																	dataIndex : 'operatorUserName'								
								}
																																																,{
																	header : '审批状态',
																	width:100,
																	dataIndex : 'runStatus',
																	renderer : this.applyStateRenderer
								}
																																																,{
																	header : '申请时间',
																	dataIndex : 'createDate'
								},{
																	header : '管理',
																	dataIndex : 'runId',
																	renderer : sealedEndProRenderer
								}
																																								, new Ext.ux.grid.RowActions({
									header:'管理',
									width:100,
									hidden:true,
									actions:[{
											 iconCls:'btn-edit',qtip:'终止流程',style:'margin:0 3px 0 10px'
										}
									],
									listeners:{
										scope:this,
										'action':this.onRowAction
									}
								})
					]// end of columns
				});
				
				//this.gridPanel.addListener('rowdblclick',this.rowClick);
								
				//获取当前用户角色
				var rolesStore = new Ext.data.SimpleStore({
					url : __ctxPath + '/system/selectedRolesAppUser.do?userId=' + curUserInfo.userId,
					autoLoad : true,
					fields : ['id', 'name']
				});
				
				rolesStore.on("load",function(){  
					for(var i=0;i<rolesStore.getCount();i++){    		
						if(rolesStore.getAt(i).data.id==43 || rolesStore.getAt(i).name == '用印管理员'){
							Ext.getCmp('curUserInfo.roles').setValue(rolesStore.getAt(i).data.id);
						}
					}
					Ext.getCmp('sealApplyViewGrid').getStore().reload();					
			    }); 
				
					
			},// end of the initComponents()
			// 重置查询表单
			reset : function(){
				this.searchPanel.getForm().reset();
			},
			// 按条件搜索
			search : function() {
				$search({
					searchPanel:this.searchPanel,
					gridPanel:this.gridPanel
				});
			},
			// GridPanel行点击处理事件
			rowClick:function(grid,rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
					new SealApplyViewForm({id:rec.data.id}).show();
				});
			},
			// 创建记录
			createRs : function() {
				//new SealApplyForm().show();
				SealApplyView.newFlow(FlowDefIdPro.SealApplydefId, FlowDefIdPro.SealApplyFlowName);
			},
			// 按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/flow/multiDelSealApply.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			// 把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/flow/multiDelSealApply.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			// 终止流程
			endSelRs : function(id,pid) {
				//Ext.MessageBox.confirm('提示', '确定终止该申请，终止后不可恢复？',endSelRs2(btn,id));
				
			},
			
			// 编辑Rs
			editRs : function(record) {
				new sealApplyViewForm({
					id : record.data.id
				}).show();
			},
			// 行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					case 'btn-edit' :
						this.endSelRs.call(this,record.data.id,record.data.runId);
						break;
					default :
						break;
				}
			}
});

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
SealApplyView.newFlow = function(defId, name) {

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};
