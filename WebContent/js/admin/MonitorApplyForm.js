/**
 * @author
 * @createtime
 * @class MonitorApplyForm
 * @extends Ext.Window
 * @description MonitorApply表单
 * @company 捷达世软件
 */
MonitorApplyForm = Ext
		.extend(
				Ext.Window,
				{
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 必须先初始化组件
						this.initUIComponents();
						MonitorApplyForm.superclass.constructor.call(this, {
							id : 'MonitorApplyFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 600,
							width : 700,
							maximizable : true,
							title : '督办申请详细信息',
							buttonAlign : 'center',
							buttons : [ {
								text : '关闭',
								iconCls : 'btn-cancel',
								scope : this,
								handler : this.cancel
							} ]
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {
						var monitryTypecomboStore = new Ext.data.SimpleStore({
							url : __ctxPath + '/admin/getTypeComboMonitorApply.do',
							autoLoad : true,
							fields : ['typeId', 'typeName']
						});
						this.formPanel = new Ext.FormPanel(
								{
									layout : 'form',
									id:'MonitorApplyForm',
									bodyStyle : 'padding:10px',
									border : false,
									// autoScroll : true,
									// id : 'MonitorApplyForm',
									defaults : {
										anchor : '98%,98%',
										margins : {
											top : 4,
											right : 4,
											bottom : 4,
											left : 4
										}
									},
									reader : new Ext.data.JsonReader({
										root : 'data'
									}, [{
									            name:'monitorApply.id',
									            mapping:'id'
									        },{
												name : 'monitorApply.topic',
												mapping : 'topic'
											},{
												name : 'monitorApply.description',
												mapping : 'description'
											},{
												name : 'monitorApply.finishDt',
												mapping : 'finishDt'
											},{
												name : 'monitorApply.remark',
												mapping : 'remark'
											},{
												name : 'monitorApply.type',
												mapping : 'type'
											},{
												name : 'monitorApply.type',
												mapping : 'type'
											},{
												name : 'resPonsDeptName',
												type : 'string'
											},{
												name : 'resPonsUserName',
												type : 'string'
											},{
												name : 'resPonsDeptNamePh',
												type : 'string'
											},{
												name : 'resPonsUserNamePh',
												type : 'string'
											}]),
									// defaultType : 'textfield',
									items : [
											// 用于接收督办人员
											{
												xtype : 'hidden',
												id : 'monitorApply.monitorUserIds',
												name : 'monitorApply.monitorUserIds'
											},
											{
												xtype : 'hidden',
												id : 'depIdTemp',
												name : 'depIdTemp'
											},
											{
												name : 'monitorApply.id',
												xtype : 'hidden',
												value : this.id == null ? ''
														: this.id
											},
											{

												xtype : "combo",
												// hiddenName :
												// 'monitorApply.type',
												name : 'monitorApply.type',
												id : "monitorApplyType",
												fieldLabel : "督办类型",
												valueField : 'typeId',
												displayField : 'typeName',
												mode : 'local',
												editable : false,
												typeAhead : true,
												triggerAction : 'all',
												forceSelection : true,
												width : 150,
												allowBlank : false,
												store : monitryTypecomboStore,
												readOnly : true

											},
											/*{
												fieldLabel : '督办事项来源类型',
												name : 'monitorApply.sourceType',
												anchor : '98%',
												xtype : 'numberfield'
											},
											{
												fieldLabel : '督办事项来源ID',
												name : 'monitorApply.sourceId',
												anchor : '98%',
												xtype : 'numberfield'
											},*/
											{
												xtype : 'textfield',
												fieldLabel : '督办主题',
												name : 'monitorApply.topic',
												anchor : '98%',
												allowBlank : false,
												maxLength : 100,
												readOnly : true
											},
											{

												layout : 'column',
												border : false,
												defaults : {
													border : false
												},
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '责任部门:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'resPonsDeptName',
															//id : 'monitorDepartment',
															allowBlank : false,
															editable : false,
															readOnly : true,
															width : 320,
															readOnly : true
														} ]

											},
											{

												layout : 'column',
												border : false,
												defaults : {
													border : false
												},
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '责任人员:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'resPonsUserName',
															//id : 'monitorUserIdsTemp',
															allowBlank : false,
															editable : false,
															readOnly : true,
															width : 320,
															readOnly : true
														} ]

											},
											{

												layout : 'column',
												border : false,
												defaults : {
													border : false
												},
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '配合部门:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'resPonsDeptNamePh',
															//id : 'monitorDepartment',
															editable : false,
															readOnly : true,
															width : 320,
															readOnly : true
														} ]

											},{

												layout : 'column',
												border : false,
												defaults : {
													border : false
												},
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '配合人员:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'resPonsUserNamePh',
															id : 'monitorUserIdsTemp',
															editable : false,
															readOnly : true,
															width : 320,
															readOnly : true
														} ]

											},
											{
												xtype : 'textfield',
												fieldLabel : '督办内容说明',
												name : 'monitorApply.description',
												xtype : 'textarea',
												anchor : '98%',
												maxLength : 400,
												readOnly : true
											},
											{
												fieldLabel : '申请日期',
												name : 'monitorApply.finishDt',
												xtype : 'datefield',
												format : 'Y-m-d',
												anchor : '98%',
												readOnly : true
											// value : new Date()
											},
											{
												xtype : 'textfield',
												fieldLabel : '备注',
												name : 'monitorApply.remark',
												xtype : 'textarea',
												anchor : '98%',
												maxLength : 400,
												readOnly : true
											}/*,
											{
												fieldLabel : '督办层级',
												name : 'monitorApply.level',
												anchor : '98%',
												xtype : 'numberfield'
											},
											{
												fieldLabel : '申请部门ID',
												name : 'monitorApply.applyDeptId',
												anchor : '98%',
												xtype : 'numberfield'
											},
											{
												fieldLabel : '是否删除',
												name : 'monitorApply.isDeleted',
												allowBlank : false,
												anchor : '98%',
												xtype : 'numberfield'
											}*/,
											{
												layout : 'column',
												border : false,
												defaults : {
													border : false
												},
												items : [
														{
															columnWidth : .7,
															layout : 'form',
															border : false,
															items : [ {
																fieldLabel : '附件',
																xtype : 'panel',
																id : 'personFilePanel',
																frame : false,
																border : true,
																bodyStyle : 'padding:4px 4px 4px 4px',
																height : 80,
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
																									.getCmp("MonitorApplyForm.fileIds");
																							var filePanel = Ext
																									.getCmp('personFilePanel');

																							for ( var i = 0; i < data.length; i++) {
																								if (fileIds
																										.getValue() != '') {
																									fileIds
																											.setValue(fileIds
																													.getValue() + ',');
																								}
																								fileIds
																										.setValue(fileIds
																												.getValue()
																												+ data[i].fileId);

																								Ext.DomHelper
																										.append(
																												filePanel.body,
																												'<span><a href="#" onclick="FileAttachDetail.show('
																														+ data[i].fileId
																														+ ')">'
																														+ data[i].filename
																														+ '</a> <img class="img-delete" src="'
																														+ __ctxPath
																														+ '/images/system/delete.gif" onclick="removeFile(this,'
																														+ data[i].fileId
																														+ ')"/>&nbsp;|&nbsp;</span>');
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
																			var fileAttaches = Ext
																					.getCmp("MonitorApplyForm.fileIds");
																			var filePanel = Ext
																					.getCmp('personFilePanel');

																			filePanel.body
																					.update('');
																			fileAttaches
																					.setValue('');
																		}
																	},
																	{
																		xtype : 'hidden',
																		id : 'MonitorApplyForm.fileIds',
																		name : 'fileIds'
																	} ]
														} ]
											} ]
								});
						// 加载表单对应的数据
						/*if (this.id != null && this.id != 'undefined') {
							this.formPanel.loadData( {
								url : __ctxPath
										+ '/admin/getMonitorApply.do?id='
										+ this.id,
								root : 'data',
								preName : 'monitorApply'
							});
						}*/
						
						if (this.id != null && this.id != 'undefined') {
							this.formPanel.getForm().load({
								url : __ctxPath
								+ '/admin/getMonitorApply.do?id='
								+ this.id,	
								waitMsg : '正在载入数据...',
								success : function(form, action) {
								//Ext.getCmp('monitorDepartmentTemp').setValue(Ext.util.JSON.decode(action.response.responseText).data.resPonsDeptName);
								var filePanel = Ext.getCmp('personFilePanel');
								var fileIds = Ext.getCmp("MonitorApplyForm.fileIds");
								var af=Ext.util.JSON.decode(action.response.responseText).data.attachFiles;
								
								for (var i = 0; i < af.length; i++) {
									if (fileIds.getValue() != '') {
										fileIds.setValue(fileIds.getValue() + ',');
									}
									fileIds.setValue(fileIds.getValue() + af[i].fileId);
									Ext.DomHelper
											.append(
													filePanel.body,
													'<span><a href="#" onclick="FileAttachDetail.show('
															+ af[i].fileId
															+ ')">'
															+ af[i].fileName
															+ '</a><img class="img-delete" src="'
															+ __ctxPath
															+ '/images/system/delete.gif" onclick="removeFile(this,'
															+ af[i].fileId
															+ ')"/>&nbsp;|&nbsp;</span>');
								}
						
								
							}
							});
						}

					},// end of the initcomponents

					/**
					 * 重置
					 * 
					 * @param {}
					 *            formPanel
					 */
					reset : function() {
						this.formPanel.getForm().reset();
					},
					/**
					 * 取消
					 * 
					 * @param {}
					 *            window
					 */
					cancel : function() {
						this.close();
					},
					/**
					 * 保存记录
					 */
					save : function() {
						$postForm( {
							formPanel : this.formPanel,
							scope : this,
							url : __ctxPath + '/admin/saveMonitorApply.do',
							callback : function(fp, action) {
								var gridPanel = Ext.getCmp('MonitorApplyGrid');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}
								this.close();
							}
						});
					}// end of save

				});