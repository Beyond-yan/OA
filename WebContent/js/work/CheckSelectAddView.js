CheckSelectAddView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CheckSelectAddView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'CheckSelectAddViewWin',
			title : '事项登记',
			iconCls : 'menu-product',
			width : 850,
			height : 400,
			items:this.formPanel,
			maximizable : true,
			border : false,
			modal : true,
			plain : true,
			buttonAlign : 'center',
			buttons : this.buttons
		});
	},
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'CheckSelectAddView',
			url : __ctxPath + '/work/saveWorkContent.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 800,
			padding : '5px',
		    reader : new Ext.data.JsonReader({
				root : 'data'
			},[{
				name : 'workContent.id',
				mapping : 'id'
			}, {
				name : 'workContent.workContentId',
				mapping : 'workContentId'
			}, {
				name : 'workContent.name',
				mapping : 'name'
			}, {
				name : 'workContent.deptname',
				mapping : 'deptname'
			}, {
				name : 'workContent.deptid',
				mapping : 'deptid'
			}, {
				name : 'workContent.orderid',
				mapping : 'orderid'
			},{
				name : 'workContent.type',
				mapping : 'type'
			}, {
			    name:'workContent.createtime',
			    mapping:'createtime'
			}, {
				name : 'workContent.status',
				mapping : 'status'
			},{
				name : 'workContent.limitdate',
				mapping : 'limitdate'
			},{
				name : 'workContent.userid',
				mapping : 'userid'
			},{
				name : 'workContent.username',
				mapping : 'username'
			},{
				name : 'workContent.descript',
				mapping : 'descript'
			}]),
			items : [{
				xtype : 'hidden',
				name:'workContent.id',
				id : 'workContent.id',
				value:this.id
			},{
				border : false,
				layout : 'column',
				defaults : {
					border : false,
					layout : 'form',
					defaults : {
						width : 150,
						allowBlank : false
					}
				},
				fieldLabel : '事项名称',
				items:[{
					border : false,
					layout : 'column',
					items:[{
						xtype : 'textfield',
						width:700,
						name : 'workContent.name',
						id:'workContent.name',
						allowBlank : false
					}]
				}]
			},{
				border : false,
				layout : 'column',
				defaults : {
					border : false,
					columnWidth : .33,
					layout : 'form',
					defaults : {
						width : 150,
						allowBlank : false
					}
				},
				items:[{
					items:[{
						fieldLabel : '限办日期',
					    id : 'workContent.limitdate',
					    name : 'workContent.limitdate',
						xtype : 'datefield',
						width : 150,
						format : 'Y-m-d',
						allowBlank : false
					}]
				},{
					items:[{
						fieldLabel : '事项分类',
						xtype : 'combo',
						hiddenName : 'workContent.type',
						id:'workContent.type',
						mode : 'local',
						editable : false,
						value : '1',
						triggerAction : 'all',
						store : [['1', '市领导批示'],
								['2', '重要决策部署'],['3', '主任会党委会'],['4', '委领导指示'],['5', '其他']]
					}]
				},{
					items:[{
					    fieldLabel : '排序号',
					    id : 'workContent.orderid',
					    name : 'workContent.orderid',
						xtype : 'textfield',
						width : 150,
						value:'0',
						allowBlank : false
					}]
				}]
			},/*{
				width : 620,
				fieldLabel : '责任部门',
				id : 'workContent.deptid',
				hiddenName : 'workContent.deptid',
				triggerAction : 'all',
				editable : false,
				xtype : 'combo',
				displayField : 'name',
				valueField : 'id',
				store : new Ext.data.SimpleStore({
					autoLoad : true,
					url : __ctxPath
							+ '/system/comboParentDepartment.do',
					fields : ['id', 'name'],
					baseParams:{
						start : 0,
						limit : 10000
					}
				})
			},*/{
				xtype : 'container',
				layout : 'column',
				id : 'workContent.sentGroup',
				style : 'padding:0px 0px 5px 0px;margin-left:0px;',
				defaults : {
					border : false
				},
				items : [{
					xtype : 'hidden',
					width : '60%',
					name:'workContent.deptid',
					id : 'workContent.deptid'
				},{
					xtype : 'label',
					style : 'padding-top:4px;',
					hideParent :true,
					text : '责任部门：',
					width : 75
				}, {
					xtype : 'textfield',
					width : 620,
					hideParent :true,
					allowBlank: false,
					readOnly : true,
					name:'workContent.deptname',
					id : 'workContent.deptname'
				}, {
					style : 'padding-left:5px;',
					xtype : 'button',
					iconCls : 'menu-department',
					hideParent :true,
					text : '责任部门',
					handler : function() {
						var url1=__ctxPath + '/system/sentListByParentIdDepartment.do';
						var url2=__ctxPath + '/system/selectChildDepartment.do?depId='+curUserInfo.parentDepId;
						//var url2=__ctxPath + '/system/selectDepartment.do?depId='+curUserInfo.parentDepId;
						var depIdsTemp = Ext.getCmp('workContent.deptid').getValue();
						var depNamesTemp = Ext.getCmp('workContent.deptname').getValue();
						var array1 = [];
						var array2 = [];
						var map= new Map();
						if (depIdsTemp != null&& depIdsTemp != '') {
							array1 = depIdsTemp.split(',');
							array2 = depNamesTemp.split(',');
							for (var i = 0; i < array1.length; i++) {
								map.put(array1[i],array2[i]);
							}
						}
						DepSelector.getView(function(formPanel,id, name) {
							Ext.getCmp('workContent.deptname').setValue(name);
							Ext.getCmp('workContent.deptid').setValue(id);
						},false,map,url1,url2).show();
					}
				}]
			},{
				xtype : 'container',
				layout : 'column',
				style : 'padding:0px 0px 8px 0px;margin-left:0px;',
				defaults : {
					allowBlank : false,
					border : false
				},
				items : [{
					xtype : 'hidden',
					name : 'workContent.userid',
					id : 'workContent.userid'
				},{
					xtype : 'label',
					text : '相关人员：',
					width : 75
				}, {
					xtype : 'textarea',
					width : 615,
					allowBlank : true,
					readOnly : true,
					name : 'workContent.username',
					id : 'workContent.username'
				}, {
					style : 'padding-left:5px;',
					xtype : 'button',
					iconCls : 'menu-department',
					text : '选择人员',
					scope:this,
					handler : function() {
					    var url1=__ctxPath + '/system/sentListByParentIdDepartment.do?externalLimitLevel=1&innerLimitLevel=90';
						var url2=__ctxPath + '/system/selectAppUser.do';
						var depIdsTemp = Ext.getCmp('workContent.userid').getValue();
						var depNamesTemp = Ext.getCmp('workContent.username').getValue();
						var array1 = [];
						var array2 = [];
						var map= new Map();
						if (depIdsTemp != null&& depIdsTemp != '') {
							array1 = depIdsTemp.split(',');
							array2 = depNamesTemp.split(',');
							for (var i = 0; i < array1.length; i++) {
								map.put(array1[i],array2[i]);
							}
						}
						DeptUserSelector.getView(function(userId, fullName, depName) {
							Ext.getCmp('workContent.username').setValue(fullName);
							Ext.getCmp('workContent.userid').setValue(userId);
						},false,map,url1,url2).show();
					}
				}]
			}, {
				fieldLabel : '事项描述',
				xtype : 'textarea',
				width : 615,
				allowBlank : true,
				name : 'workContent.descript',
				id : 'workContent.descript'
			},{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					padding : '5px',
					border : false
				},
				items : [{
							columnWidth : .8,
							items : [{
										fieldLabel : '上传附件',
										xtype : 'panel',
										id : 'WorkContentView.personFilePanel',
										frame : false,
										border : true,
										bodyStyle : 'padding:4px 4px 4px 4px;',
										height : 80,
										autoScroll : true,
										html : ''
									}]
						}, {
							columnWidth : .2,
							padding : '5px 0 0 20px',
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
											var fileIds = Ext.getCmp('WorkContentView.fileIds');
											var filePanel = Ext.getCmp('WorkContentView.personFilePanel');

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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'WorkContentView.fileIds\','
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
									var fileAttaches = Ext.getCmp('WorkContentView.fileIds');
									var filePanel = Ext.getCmp('WorkContentView.personFilePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'WorkContentView.fileIds',
								name : 'fileIds'
							}]
						}]
			}]
		});
	if (this.id) {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/work/getByIdWorkContent.do?id='+ this.id,
				waitMsg : '正在载入数据...',
				method:'post',
				success : function(form, action) {
				},
				failure : function(form, action) {
				}
			});
		}
		this.buttons = [{
			text : '提交',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('CheckSelectAddViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var url=__ctxPath + '/work/saveWorkContent.do';
		this.formPanel.getForm().submit({
			method : 'POST',
			waitMsg : '正在提交表单数据...',
			url : url,
			params : {		
			},
			success : function(fp, action) {
				var gridPanel = Ext.getCmp('CheckSelectGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				var gridPanel = Ext.getCmp('CheckSelectViewGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				Ext.getCmp('CheckSelectAddViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}
});