/**
 * @author
 * @createtime
 * @class DocFilesForm
 * @extends Ext.Window
 * @description DocFilesForm表单
 */
DocFilesForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocFilesForm.superclass.constructor.call(this, {
					layout : 'form',
					id : 'DocFilesFormWin',
					title : '文件详情',
					iconCls : 'menu-docFiles',
					modal : true,
					width : 650,
					height : 400,
					minWidth : 650,
					minHeight : 300,
					items : [this.formPanel],
					border : false,
					buttonAlign : 'center',
					buttons : [{
									text : '保存',
									iconCls : 'btn-save',
									scope : this,
									handler : this.save
							  }, {
									text : '重置',
									iconCls : 'btn-reset',
									scope : this,
									handler : function() {
										this.formPanel.getForm().reset();
									}
							  }, {
								  	text : '关闭',
								  	iconCls : 'btn-cancel',
								  	scope : this,
								  	handler : function() {
								  		this.close();
								  	}
							  }]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear  = nowYear -13;
		var _url = __ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId');
		var depSelector = new TreeSelector('docFiles.department.depName', _url, '所属部门',
				'docFiles.department.depId', false);
		var arr = [];
		for(var i = 0; i<=14; i++){
			arr[i] = startYear + i;
		}
		this.formPanel = new Ext.FormPanel({
			id : 'DocFilesForm',
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			items : [
			         {
			        	 xtype : 'hidden',
			        	 name : 'docFiles.id',
			        	 value : this.fileId == null ? '' : this.fileId
			         },{
							xtype : 'hidden',
							name : 'docFiles.department.depId',
							id : 'docFiles.department.depId'
						},{
						border : false,
						layout:'form',
						labelWidth : 60,
						items : { fieldLabel : '标题',
				        	 width : 475,
				        	 xtype : 'textfield',
				        	 name : 'docFiles.fileName',
				        	 editable : false,
				        	 allowBlank : false,
				        	 maxLength : 128
				        	 }
				        	 
			   },{
				layout : 'column',
				border : false,
				defaults : {
					border : false,
					layout : 'form',
					columnWidth : 0.5,
					width : 604,
					labelWidth : 60
				},
				items:[{
					items : [depSelector, {
						fieldLabel : '责任人',
						width : 165,
						xtype : 'textfield',
						name : 'docFiles.dutyPerson',
						maxLength : 128
					},{
						fieldLabel : '文号',
						width : 165,
						xtype : 'textfield',
						name : 'docFiles.fileNo',
						allowBlank : true,
						maxLength : 128
					},{
						fieldLabel : '年份',
						hiddenName : 'docFiles.fileYear',
						id : 'dirYear',
						width : 165,
						xtype : 'combo',
						mode : 'local',
						allowBlank : false,
						editable : false,
						triggerAction : 'all',
						store : arr,
						emptyText : '---年份---'
					},{
						fieldLabel : '件号',
						width : 165,
						xtype : 'numberfield',
						name : 'docFiles.fileNumber',
						allowBlank : true
					}]
				}, {
					items : [{
						fieldLabel : '页数',
						width : 165,
						xtype : 'numberfield',
						name : 'docFiles.pageCount',
						maxLength : 128
					},{
						fieldLabel : '文件类型',
						xtype : 'combo',
						hiddenName : 'docFiles.fileType',
						id : 'fileType',
						mode : 'local',
						editable : false,
						allowBlank : false,
						triggerAction : 'all',
						width : 165,
						store : [[ '0', '发文' ],
						         [ '1', '收文' ]],
						emptyText : '---请选择文件类型---'
					},{
						fieldLabel : '密级',
						width : 165,
						name : 'docFiles.secretLevel',
						xtype : 'combo',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						store : [ [ '0', '一般' ],
						          [ '1', '秘密' ],
						          [ '2', '机密' ],
						          [ '3', '绝密' ]],
						emptyText : '---密级---'
					},{
						fieldLabel : '文件日期',
						width : 165,
						name : 'docFiles.fileDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date(),
						editable:false
					},{
						fieldLabel : '保管期限',
						width : 165,
						hiddenName : 'docFiles.retentionYear',
						xtype : 'combo',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						store : [[ '0', '永久' ],
						          [ '1', '待分类' ],
						          [ '10', '10年' ],
						          [ '30', '30年' ]],
						emptyText : '---保管期限---'
					}]
				}]
			},{
				border : false,
				layout:'form',
				labelWidth : 60,
				items : { fieldLabel : '责任者',
		        	 width : 475,
		        	 xtype : 'textfield',
		        	 name : 'docFiles.fileIssup',
		        	 allowBlank : false
		        	 }
		        	 
			},{
				border : false,
				layout:'form',
				labelWidth : 60,
				items : {
					fieldLabel : '备注',
					width : 475,
					height : 40,
					name : 'docFiles.remark',
					xtype : 'textarea',
					maxLength : 4000
				}
			},{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
							columnWidth : .8,
							items : [{
										fieldLabel : '附件',
										width : 350,
										xtype : 'panel',
										id : 'DocFilesForm.filePanel',
										name:'docFiles.fileList',
										frame : false,
										border : true,
										bodyStyle : 'padding:4px 4px 4px 4px;',
										height : 80,
										autoScroll : true,
										html : ''
									}]
						}, {
							columnWidth : .2,
							padding : '0 0 0 20px',
							items : [{
								border : false,
								xtype : 'button',
								text : '添加文件',
								iconCls : 'menu-attachment',
								handler : function() {
									var dialog = App.createUploadDialog({
										file_cat : 'document',
										judge_size : 'no',
										upload_autostart : true,
										callback : function(data) {
											var fileIds = Ext
													.getCmp('DocFilesForm.fileIds');
											var filePanel = Ext
													.getCmp('DocFilesForm.filePanel');

											for (var i = 0; i < data.length; i++) {
												if (fileIds.getValue() != '') {
													fileIds.setValue(fileIds
															.getValue()
															+ ',');
												}
												fileIds.setValue(fileIds
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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'DocFilesForm.fileIds\','
																		+ data[i].fileId
																		+ ')"/>&nbsp;|&nbsp;</span>');

											}
										}
									});
									dialog.show(this);
								}
							}, {
								xtype : 'button',
								text : '清除文件',
								iconCls : 'reset',
								handler : function() {
									var fileAttaches = Ext
											.getCmp('DocFilesForm.fileIds');
									var filePanel = Ext
											.getCmp('DocFilesForm.filePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'DocFilesForm.fileIds',
								name : 'attachIds'
							}]
						}]
			},{
				xtype :'hidden',
				name : 'docFiles.sourceType',
				value : 0
			}]
		});
		this.load();
	},
	load : function() {
		// 加载表单对应的数据
		if (this.fileId != null && this.fileId != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/system/getDocFiles.do?fileId='
								+ this.fileId,
						root : 'data',
						preName : 'docFiles'
					});
			Ext.Ajax.request({
				url : __ctxPath+ '/system/getAttachDocFiles.do?fileId='+ this.fileId,
				method : 'POST',
				success : function(fp, action) {
					var respText = Ext.util.JSON.decode(fp.responseText);
					var af = respText.result;
						var filePanel = Ext.getCmp('DocFilesForm.filePanel');
						var fileIds = Ext.getCmp('DocFilesForm.fileIds');
										
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
													+ '/images/system/delete.gif" onclick="removeFile(this,\'DocFilesForm.fileIds\','
													+ af[i].fileId
													+ ')"/>&nbsp;|&nbsp;</span>');
						}
				}
			});
		}
	},
	save : function() {
		var fileId=this.fileId;
		var freshId=this.freshId;
		if (this.formPanel.getForm().isValid()) {
			var myMask = new Ext.LoadMask(Ext.getBody(), {
				 msg: '正在提交，请稍候！',
				 removeMask: true // 完成后移除
			});
			myMask.show();
			
			this.formPanel.getForm().submit({
				url : __ctxPath + '/system/saveDocFiles.do',
				success : function(form, action) {
					if(Ext.getCmp('ToBeDocFilesViewGrid')!=null){
						Ext.getCmp('ToBeDocFilesViewGrid').getStore().reload();
					}
					if(Ext.getCmp('ToBeDocFilesFormGrid')!=null){
						Ext.getCmp('ToBeDocFilesFormGrid').getStore().reload();
					}
					if(Ext.getCmp('DocDirectoryDetailGrid')!=null){
						Ext.getCmp('DocDirectoryDetailGrid').getStore().reload();
					}
				/*	if(freshId=='ToBeDocFilesViewGrid'){
					}*/
					if(freshId=='DocFilesDetailForm'){
						Ext.getCmp('DocFilesDetailPanel').load({
							url : __ctxPath
							+ '/pages/doc/DocFileDetail.jsp?docFilesId='+fileId,
							nocache : true
						});
					}
					myMask.hide();	
				    Ext.getCmp('DocFilesFormWin').close();
				},
				failure : function(form, action) {
					myMask.hide();
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '信息保存出错，请确认信息或请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					

				}
			});

		}
	}
});