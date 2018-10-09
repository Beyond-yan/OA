/**
 * @author 
 * @createtime 
 * @class PublicApplyForm
 * @extends Ext.Window
 * @description PublicApply表单
 * @company 捷达世软件
 */
PublicApplyForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				PublicApplyForm.superclass.constructor.call(this, {
					id : 'PublicApplyFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 400,
					width : 600,
					maximizable : true,
					title : '公关接待方案详细',
					buttonAlign : 'center',
					buttons : [
								{
									text : '保存',
									iconCls : 'btn-save',
									scope : this,
									handler : this.save
								}, {
									text : '取消',
									iconCls : 'btn-cancel',
									scope : this,
									handler : this.cancel
								}
					         ]
				});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				
				var buylistStore = new Ext.data.Store({
					remoteSort : false,
					proxy : new Ext.data.HttpProxy({
						url : __ctxPath
								+ '/admin/publistPublicPlanDetail.do?pubPlanId='
								+ this.planId
					}),
					//autoLoad : true,
					reader : new Ext.data.JsonReader({
						root : 'result',
						fields : ['itemName', {name:'execTime',type:'date',dateFormat:'Y-m-d'},
							 {name:'userId', mapping: 'appUser.id'}, 
							 {name: 'userName', mapping :'appUser.fullname'}, 
							 {name:'total', type : 'int'}]
					})		
				});
				
				var row = 0;
				var col = 0;
				//用户的行选择器
				var userEditor = new Ext.form.TriggerField({
					triggerClass : 'x-form-browse-trigger',
					onTriggerClick : function(e) {
						UserSelector.getView(function(ids, names) {
									var grid = Ext.getCmp("buyListFormGrid");
									var store = grid.getStore();
									var record = store.getAt(row);
									record.set('userId', ids);
									record.set('userName', names);
								},true,true).show();
					}
				});
				
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(),  {
						header : '计划事项',
						dataIndex : 'itemName',
						editor : new Ext.form.TextField({
									allowBlank : false
								})
					}, {
						header : '执行时间',
						dataIndex : 'execTime',
						type:'date', renderer:Ext.util.Format.dateRenderer('y-m-d'),
						editor : new Ext.form.DateField({
									allowBlank : false,
									format:'Y-m-d'
								})

					},{						
						header : '负责人',
						dataIndex : 'userName',
						editor : userEditor
					
					}, {
						header : '费用(元)',
						dataIndex : 'total',
						editor : new Ext.form.NumberField({
									allowBlank : false
								}),
						renderer: this.editColumn

					}
					],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});// end of the cm
				
				this.topbar = new Ext.Toolbar({
					id : 'BoardrooFormtopBar',
					height : 30,
					bodyStyle : 'text-align:right',
					menuAlign : 'center',
					items : []
				});
				
				// 新增
				this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '新增',
					scope : this,
					handler : function() {
						var recordType = buylistStore.recordType;
						buylistStore.add(new recordType());
					}
				}));
				
				// 删除
				this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除',
					scope : this,
					handler : function() {
						var grid = Ext.getCmp("buyListFormGrid");
						var selectRecords = grid.getSelectionModel().getSelections();
						buylistStore.remove(selectRecords);
						publicCheckFeeAmount();
					}
				}));	
				
				this.buyListFormGridPanel = new Ext.grid.EditorGridPanel({
					id : 'buyListFormGrid',
					tbar : this.topbar,
					region : 'center',
					store : buylistStore,
				    trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					frame : true,
					//autoHeight : true,
					 clicksToEdit:1,
				    stripeRows:true,
					 height : 150,
					cm : cm,
					sm : sm,
					// plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true
					},
					listeners: {
						"afteredit": function(e) {
							publicCheckFeeAmount();
						},
						'cellclick':function(grid,rowIndex,columnIndex,e) {
							row=rowIndex;
						}
					}
				});
		
				// 自动计算费用合计
			 	var publicCheckFeeAmount = function() {		
					var gridPanel = Ext.getCmp('buyListFormGrid');
					if(gridPanel != null) {
						var store = gridPanel.getStore();
						var sum = 0;
						for (var i = 0; i < store.getCount(); i++) {
							if(store.getAt(i).get('total') != null) {
								sum += store.getAt(i).get('total');
							}
						}
						Ext.getCmp('publicApplyForm.publicPlan.moneyTotal').setValue(sum);
					}		
				};
				
				this.formPanel = new Ext.FormPanel({
					layout : 'form',
					bodyStyle : 'padding:10px',
					border : false,
					autoScroll:true,
					//id : 'PublicPlanForm',
					defaults : {
						anchor : '96%,96%'
					},
					//defaultType : 'textfield',
					items : [{
						name : 'publicPlan.id',
						id: 'publicApplyForm.publicPlan.id',
						xtype : 'hidden',
						value : this.planId == null ? '' : this.planId
					},{
						name : 'publicApply.id',
						id: 'publicApply.id',
						xtype : 'hidden',
						value : this.applyId == null ? '' : this.applyId
					},{
						fieldLabel : 'PLAN_USER_ID',
						name : 'publicPlan.planUserId'
						,id : 'publicApplyForm.publicPlan.planUserId'
						,allowBlank:false
						,xtype:'hidden'
						,value : curUserInfo.userId
					},{
					
						fieldLabel : '计划人',
						name : 'publicPlan.planUserName',
						allowBlank:false
						,xtype:'textfield',
						readOnly : true,
						value : curUserInfo.fullname
					
					},{
						fieldLabel : '计划时间',
						name : 'publicPlan.planTime'
						,xtype:'datefield',
						format:'Y-m-d',
						value:new Date().dateFormat('Y-m-d')
					},{
						name : 'publicPlan.createDate',
						xtype:'hidden',
						value:new Date().dateFormat('Y-m-d H:i:s')
					},{
						name : 'publicPlan.createBy',
						xtype:'hidden',
						value: curUserInfo.fullname
					},{
							
						layout : 'column',
						border : false,
						defaults : {
							border : false
						},
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;padding-bottom:10px',
									text : '详细信息:',
									width : 105
								},this.buyListFormGridPanel ]
							
					},{
						fieldLabel : '费用总额',
						name : 'publicPlan.moneyTotal',
						id : 'publicApplyForm.publicPlan.moneyTotal'
						,maxLength: 18
						,xtype : 'numberfield'
					}, {
						xtype : 'hidden',
						id : 'publicApplyForm.MonitorApplyForm.fileIds',
						name : 'fileIds'
					},{
						 								
						layout : 'column',
						border : false,
						defaults : {
							border : false
						},
						items : [ {
									layout : 'form',
									columnWidth : .7,
									border : false,
									items : [ {
										fieldLabel : '附件',
										xtype : 'panel',
										id : 'publicApplyForm.personFilePanel',
										frame : false,
										border : true,
										bodyStyle : 'padding:4px 4px 4px 4px',
										height : 50,
										width:750,
										autoScroll : true,
										html : ''
									} ]
								},
								{
									columnWidth : .3,
									items : [
											{
												border : false,
												xtype : 'button',
												text : '添加附件',
												iconCls : 'menu-attachment',
												handler : function() {
													var dialog = App
															.createUploadDialog( {
																file_cat : 'document',
																judge_size : 'no',
																callback : function(
																		data) {
																	var fileIds = Ext
																			.getCmp("publicApplyForm.MonitorApplyForm.fileIds");
																	var filePanel = Ext
																			.getCmp('publicApplyForm.personFilePanel');

																	for ( var i = 0; i < data.length; i++) {
																		if (fileIds.getValue() != '') {
																			fileIds.setValue(fileIds.getValue() + ',');
																		}
																		fileIds.setValue(fileIds.getValue() + data[i].fileId);
																		
																		Ext.DomHelper.append(
																						filePanel.body,
																						'<span><a href="#" onclick="FileAttachDetail.show('
																								+ data[i].fileId
																								+ ')">'
																								+ data[i].filename
																								+ '</a> <img class="img-delete" src="'
																								+ __ctxPath
																								+ '/images/system/delete.gif" onclick="removeFile(this, \'publicApplyForm.MonitorApplyForm.fileIds\','
																								+ data[i].fileId
																								+ ')"/>&nbsp;|&nbsp;</span>');
																								
																		Ext.getCmp('publicApplyForm.MonitorApplyForm.fileIdsHtml').setValue(Ext.getCmp('publicApplyForm.MonitorApplyForm.fileIdsHtml').getValue()+'<span><a href="#" onclick="FileAttachDetail.show('
																								+ data[i].fileId
																								+ ')">'
																								+ data[i].filename
																								+ '</a> &nbsp;|&nbsp;</span>');
																							
																	}
																}
															});
													dialog
															.show(this);
												}
											},
											{
												xtype : 'button',
												text : '清除附件',
												iconCls : 'reset',
												handler : function() {
													var fileAttaches = Ext.getCmp("publicApplyForm.MonitorApplyForm.fileIds");
													var filePanel = Ext.getCmp('publicApplyForm.personFilePanel');

													filePanel.body.update('');
													fileAttaches.setValue('');
													Ext.getCmp('publicApplyForm.MonitorApplyForm.fileIdsHtml').setValue('');
												}
											}, {
												xtype : 'hidden',
												id : 'publicApplyForm.MonitorApplyForm.fileIdsHtml',
												name : 'publicApplyForm.MonitorApplyForm.fileIdsHtml'
											} ]
								} ]
						
				 							}
																																	]
				});
				//加载表单对应的数据	
				if (this.planId != null && this.planId != 'undefined') {
					//加载详细列表
					buylistStore.load();
					
					//加载表单
					this.formPanel.loadData({
						url : __ctxPath + '/admin/getPublicPlan.do?id='+ this.planId,
						root : 'data',
						preName : 'publicPlan'
					});
					
					//加载附件
					var filesStore = new Ext.data.Store({
						remoteSort : false,
						proxy : new Ext.data.HttpProxy({
									url : __ctxPath
											+ '/admin/filesPublicPlan.do?id='
											+ this.planId
								}),
						autoLoad : true,
						reader : new Ext.data.JsonReader({
							root : 'data.attachFiles',
							fields : ['fileId','fileName', 'filePath', 'ext']
						})			
					});
					
					filesStore.on("load",function(){						
						var filePanel = Ext.getCmp('publicApplyForm.personFilePanel');
						var fileIds = Ext.getCmp("publicApplyForm.MonitorApplyForm.fileIds");
						filesStore.each(function(record){
							if (fileIds.getValue() != '') {
								fileIds.setValue(fileIds.getValue() + ',');
							}
							fileIds.setValue(fileIds.getValue() + record.data.fileId);
																		
							Ext.DomHelper.append(filePanel.body,
								'<span><a href="#" onclick="FileAttachDetail.show('
										+ record.data.fileId
										+ ')">'
										+ record.data.fileName
										+ '</a> <img class="img-delete" src="'
										+ __ctxPath
										+ '/images/system/delete.gif" onclick="removeFile(this, \'publicApplyForm.MonitorApplyForm.fileIds\','
										+ record.data.fileId
										+ ')"/>&nbsp;|&nbsp;</span>');							
						});
					}); 
				}
				
			},//end of the initcomponents
			
			
			/**
			 * 重置
			 * @param {} formPanel
			 */
			reset : function() {
				this.formPanel.getForm().reset();
			},
			/**
			 * 取消
			 * @param {} window
			 */
			cancel : function() {
				this.close();
			},
			/**
			 * 保存记录
			 */
			save : function() {					
				//修改時：先刪除所有对应申请信息
				if (this.planId != null && this.planId != 'undefined') {
					var planId = this.planId;
					var dataStore = Ext.getCmp("buyListFormGrid").getStore();
					Ext.Ajax.request({
						url : __ctxPath + '/admin/allDelPublicPlanDetail.do',
						params:{
							'publicPlanDetail.pubPlanId':this.planId
						},
						success: function(response, options){
							 for(var i=0;i<dataStore.getCount();i++){ 	
							 	var pdId = dataStore.getAt(i).get('id');
							 	Ext.Ajax.request({
									url : __ctxPath + '/admin/savePublicPlanDetail.do',
									params:{
										'publicPlanDetail.id':pdId,
										'publicPlanDetail.publicPlanId':planId,
										'publicPlanDetail.itemName':dataStore.getAt(i).get('itemName'),
										'publicPlanDetail.execTime':dataStore.getAt(i).get('execTime').dateFormat('Y-m-d'),
										'publicPlanDetail.appUser.userId':dataStore.getAt(i).get('userId'),
										'publicPlanDetail.total':dataStore.getAt(i).get('total'),
										'publicPlanDetail.createBy':curUserInfo.fullname,
										'publicPlanDetail.createDate':new Date().dateFormat('Y-m-d H:i:s')
									}
								});
							 }
						}
					});
				}
								
				$postForm({
						formPanel:this.formPanel,
						scope:this,
						url:__ctxPath + '/admin/savePublicPlan.do',
						callback:function(fp, action){
							var result = Ext.util.JSON.decode(action.response.responseText);
							var publicApplyId = Ext.getCmp('publicApply.id').getValue();
							var planId = result.data.id;
							
							//保存计划ID到接待申请表
							Ext.Ajax.request({
								url : __ctxPath + '/admin/savePublicApply.do',
								params:{
									'publicApply.id':publicApplyId,
									'publicApply.planId':planId
									
								},
								success: function(response, options){									
									var gridPanel = Ext.getCmp('PublicApplyGrid');
									if (gridPanel != null) {
										gridPanel.getStore().reload();
									}
								}
							})
							
							 //费用明细 新增
							if (this.planId == null) {
							     var dataStore = Ext.getCmp("buyListFormGrid").getStore();
								 for(var i=0;i<dataStore.getCount();i++){ 									 	
								 	var pdId = dataStore.getAt(i).get('id');
								 	Ext.Ajax.request({
										url : __ctxPath + '/admin/savePublicPlanDetail.do',
										params:{
											'publicPlanDetail.id':pdId,
											'publicPlanDetail.publicPlanId':planId,
											'publicPlanDetail.itemName':dataStore.getAt(i).get('itemName'),
											'publicPlanDetail.execTime':dataStore.getAt(i).get('execTime').dateFormat('Y-m-d H:i:s'),
											'publicPlanDetail.appUser.userId':dataStore.getAt(i).get('userId'),
											'publicPlanDetail.total':dataStore.getAt(i).get('total'),
											'publicPlanDetail.createBy':curUserInfo.fullname,
											'publicPlanDetail.createDate':new Date().dateFormat('Y-m-d H:i:s')
										}
									});
								 }
							}
							this.close();
						}
					}
				);
			}//end of save

		});