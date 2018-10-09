/**
 * @author:LiuSicen
 * @class ArchivesFreeJumpWin
 * @extends Ext.Panel
 * @description 自由跳转管理
 */
ArchivesFreeJumpWin = Ext.extend(Ext.Window, {
			// 条件搜索Panel
			searchPanel : null,
			// 数据展示Panel
			gridPanel : null,
			// GridPanel的数据Store
			store : null,
			// 头部工具栏
			buttons : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				ArchivesFreeJumpWin.superclass.constructor.call(this, {
							id : 'ArchivesFreeJumpWin',
							iconCls : 'btn-edit',
							title : '流程编辑',
							layout : 'form',
							modal : true,
							height : 350,
							border :false,
							width : 500,
							bottons : this.bottons,
							buttonAlign : 'center',
							items : [this.rightPanel,this.bottomPanel]
						});
			},// end of constructor

			// 初始化组件
			initUIComponents : function() {
				var submitType=1;
				this.rightPanel = new Ext.Panel({
					layout : 'fit',
					id : 'freeJumpFormPanel',
					bodyStyle : 'padding:5px',
					title : '自由跳转',
					split : true
				});
				this.bottomPanel = new Ext.Panel({
					layout : 'fit',
					id : 'changeTaskPanel',
					bodyStyle : 'padding:5px',
					title : '变更处理人',
					split : true,
					items:[new Ext.FormPanel({
					id : 'changeTaskFormPanel',
					border:false,
					layout:'form',
					hideLabels:true,
					autoHeight:true,
					items : [{
								xtype : 'label',
								text : '变更处理人'
							},{
								xtype : 'container',
								layout : 'column',
								style : 'padding:0 0 5px;',
								defaults : {
									border : false
								},
								items : [{
											id : 'changeTaskFormPanel.changeTaskNames',
											xtype : 'textfield',
											maxLength :500,
											width : 370,
											allowBlank : false,
											readOnly : true
										}, {
											id : 'changeTaskFormPanel.changeTaskIds',
											xtype : 'hidden'
										}, {
											xtype : 'button',
											style:'padding-left:10px;',
											iconCls : 'menu-department',
											text : '选择人员',
											handler : function() {
												submitType=2;
												Ext.getCmp('freeJumpFormPanel').disable();
												roles = roleMap.get('DepartmentCommonId');
												var url = __ctxPath + '/system/depUsersTreeDepartment.do?depIds='+roles;
												DepLeaders.getView(
													function(userIds, userNames) {
														Ext.getCmp('changeTaskFormPanel.changeTaskNames').setValue(userNames);
														Ext.getCmp('changeTaskFormPanel.changeTaskIds').setValue(userIds);
													}, true, null,url).show();
											}
										}]
							}]
				})]
				});
				this.genFreeJumpPanel.call(this);
				this.rightPanel.add(this.freeJumpPanel);
				this.rightPanel.doLayout();
				this.buttons = [{
					xtype:'button',
					text:'确认',
					iconCls:'btn-transition',
					scope:this,
					handler:function(){
						if(submitType==1){
							this.freeJump.call(this);
						}else if(submitType==2){
							this.changeTaskSubmit.call(this);
						}
						
					}
				},{
					iconCls : 'btn-del',
					text  : '关闭',
					xtype : 'button',
					handler : this.colseWIn.createCallback(this),
					scope : this
				}];
			},// end of the initComponents()
			//自由跳转Panel
			genFreeJumpPanel:function(){
				var flowAssignId='';
				this.freeTransCombo=new Ext.form.ComboBox({
									xtype:'combo',
									allowBlank:false,
									editable : false,
									lazyInit: false,
									anchor:'96%,96%',
									hiddenName:'freeCombo',
									triggerAction : 'all',
									listeners:{
										scope:this,
										select : function(combo,record,index){
											submitType=1;
											Ext.getCmp('changeTaskPanel').disable();
											this.destName=record.data.destName;
											this.userJumpPanel.removeAll();
											this.destType='false';
											if("fork"==record.data.sourceType){
												//目标节点为fork
												this.destType='fork';
												this.genForkUserAssign.call(this);
											}else if("true"==record.data.isForkFlow){
												//目标节点为fork
												this.destType='true';
												this.genCommonUserAssign.call(this);
											}else if(record.data.sourceType.indexOf('end')==-1){
												this.genCommonUserAssign.call(this);
											}
										} 
									},
									store : new Ext.data.ArrayStore({
											autoLoad : true,
											url : __ctxPath + '/flow/freeTransNewProcessActivity.do?taskId='+this.taskId,
											fields : ['signalName', 'destName','sourceType','isForkFlow']
									}),
									displayField : 'destName',
									valueField : 'signalName'
				});
				
				this.userJumpPanel=new Ext.Panel({border:false,autoHeight:true,layout:'form',hideLabels:true,style:'padding-top:10px; '});
				
				this.freeJumpPanel=new Ext.FormPanel({
					border:false,
					layout:'form',
					hideLabels:true,
					autoHeight:true,
					items : [		{
										xtype : 'label',
										text : '跳转任务'
									},
									this.freeTransCombo,
									this.userJumpPanel
//									,
//									{
//										xtype:'button',
//										text:'自由跳转',
//										iconCls:'btn-transition',
//										scope:this,
//										handler:function(){
//											this.freeJump.call(this);
//										}
//									}
							]
				});		
			},//end of freeJumpPanel
			//gen common user assign
			genCommonUserAssign:function(){
				this.userJumpPanel.add([
					{
						xtype : 'label',
						text : this.destName+'任务执行人:'
					}, {
						xtype : 'container',
						layout : 'column',
						items : [{
								xtype : 'textfield',
								name : 'nextAssignUserNames',
								width : 370,
								allowBlank : false,
								readOnly : true
							}, {
								xtype : 'button',
								name : 'userSelectButton',
								style:'padding-left:10px;',
								text : '选择人员...',
								iconCls : 'btn-users',
								scope:this,
								handler : function() {
									var userAssignNames=this.freeJumpPanel.getCmpByName('nextAssignUserNames');
									UserSelector.getView({
										scope:this,
										callback:function(uIds, uNames) {
											userAssignNames.setValue(uNames);
											this.flowAssignId = uIds;
										}
									}).show();
								}
							}]}
				]);
				this.userJumpPanel.doLayout();
			},
			
			//为汇集节点产生自由跳转的人员选择
			genForkUserAssign:function(){
					Ext.Ajax.request({
						url:__ctxPath+'/flow/outerTransProcessActivity.do?taskId='+this.taskId,
						params:{
							nodeName:this.destName
						},
						scope:this,
						success:function(resp,options){
							var outers=Ext.decode(resp.responseText);
							this.flowForkAssignId=new Array(outers.length);
							for(var i=0;i<outers.length;i++){
								this.userJumpPanel.add(this.genUserFieldSel.call(this,outers[i]));
							}
							this.userJumpPanel.doLayout();
						}
					});
			},
			//产生用户选择
			genUserFieldSel:function(outers){
				//目标节点名称
				var destName=outers[1];
				var textField=new Ext.form.TextField({
					value:destName
				});
				var flowAssignUserName=new Ext.form.TextField({allowBlank:false});
				var cmpField=new Ext.form.CompositeField({
					border:false,
					items:[
						{
							xtype:'displayfield',
							value:destName
						},
						flowAssignUserName,
						{
							xtype:'button',
							text:'...',
							iconCls : 'btn-users',
							scope:this,
							handler:function(){
								UserSelector.getView({
									scope:this,
									callback:function(uIds, uNames) {
										flowAssignUserName.setValue(uNames);
										eval('this.flowForkAssignId[\''+destName+'\']=uIds;');
									}
								}).show();
							}
						}
					]
				});
				
				return cmpField;
										
			},
			/**
			 * 自由跳转提交
			 */
			freeJump:function(){
					if(!this.freeJumpPanel.getForm().isValid()){
						return;
					}
					var form=this.freeJumpPanel.getForm();
					var flowAssignId='';
					if(this.destType=='fork'){//目标为fork节点
						var i=0;
						for(var tname in this.flowForkAssignId){
							if(i++>=this.flowForkAssignId.length)break;
							if(flowAssignId!=''){
								flowAssignId+='|';
							}
							flowAssignId+=tname+':'+this.flowForkAssignId[tname];	
						}
					}else{//目标为普通节点
						flowAssignId=this.flowAssignId;
					}
					var signalName=this.freeTransCombo.getValue();
					var params={
							taskId:this.taskId,
							signalName:signalName,
							activityName:this.activityName,
							destName:this.destName,
							isBack : true,
							status : '流程编辑'
					};
					if(this.destType=="true"){
						Ext.apply(params,{
							flowAssignId:flowAssignId,
							isForkFlow:true
						});
					}else if(signalName.toString().indexOf("会签")!=-1||signalName.toString().indexOf("领导批示")!=-1||signalName.toString().indexOf("协办")!=-1){
						Ext.apply(params,{
							signUserIds : flowAssignId
						});
					}else{
						Ext.apply(params,{
							flowAssignId:flowAssignId
						});
					}
					form.submit({
						url:__ctxPath+ "/flow/nextProcessActivity.do",
						method:'post',
						waitMsg:'正在提交处理，请稍等',
						scope:this,
						params: params,
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息','成功保存！');
							var archivesIssueGrid=Ext.getCmp("ArchivesIssueGrid");
							var archivesRecCtrlGrid=Ext.getCmp("ArchivesRecCtrlGrid");
							var appHomeTaskGrid=Ext.getCmp('TaskPanelView');
							Ext.getCmp('ArchivesFreeJumpWin').close();
							if(appHomeTaskGrid!=null){
								appHomeTaskGrid.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
							}
							if(archivesIssueGrid!=null){
								archivesIssueGrid.getStore().reload();
							}
							if(archivesRecCtrlGrid!=null){
								archivesRecCtrlGrid.getStore().reload();
							}
						},
						failure : function(fp, action) {
							Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
						}
					});
			},
			/**
			 * 变更处理人提交
			 */
			changeTaskSubmit:function(){
					var formPanel=Ext.getCmp('changeTaskFormPanel');
					if (formPanel.getForm().isValid()) {
						formPanel.getForm().submit({
							url:__ctxPath+ "/flow/changeAssignIdTask.do",
							method:'post',
							waitMsg:'正在提交处理，请稍等',
							scope:this,
							params: {
								'taskId': this.taskId,
								'fullname': Ext.getCmp('changeTaskFormPanel.changeTaskNames').getValue(),
								'userId': Ext.getCmp('changeTaskFormPanel.changeTaskIds').getValue(),
								'msg': ""
							},
							success : function(form, action) {
								Ext.ux.Toast.msg('操作信息提示','任务已经成功转交代办人来处理！');
								var archivesIssueGrid=Ext.getCmp("ArchivesIssueGrid");
								var archivesRecCtrlGrid=Ext.getCmp("ArchivesRecCtrlGrid");
								var appHomeTaskGrid=Ext.getCmp('TaskPanelView');
								Ext.getCmp('ArchivesFreeJumpWin').close();
								if(appHomeTaskGrid!=null){
									appHomeTaskGrid.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
								}
								if(archivesIssueGrid!=null){
									archivesIssueGrid.getStore().reload();
								}
								if(archivesRecCtrlGrid!=null){
									archivesRecCtrlGrid.getStore().reload();
								}
							}
						});
					}
			},
			/**
			 * 关闭窗口
			 */
			colseWIn : function(win){
				win.close();
			}
		});
