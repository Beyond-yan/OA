CheckSelectEditUser  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CheckSelectEditUser.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'CheckSelectEditUserWin',
			title : '人员变更',
			iconCls : 'menu-product',
			width : 850,
			height : 180,
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
			id : 'CheckSelectEditUser',
			url : __ctxPath + '/work/updateUserWorkContent.do',
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
			},{
				name : 'workContent.userid',
				mapping : 'userid'
			},{
				name : 'workContent.username',
				mapping : 'username'
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
				fieldLabel : '现有人员',
				items:[{
					border : false,
					layout : 'column',
					items:[{
						xtype : 'textfield',
						width:700,
						name : 'workContentUserName',
						id:'workContentUserName',
						value:this.username,
						allowBlank : false
					}]
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
					xtype : 'hidden',
					name : 'workContentUserId',
					id : 'workContentUserId',
					value:this.userid
				},{
					xtype : 'label',
					text : '本部门变更：',
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
					    var url1=__ctxPath + '/system/sentListByParentIdDepartment.do?externalLimitLevel=1&innerLimitLevel=90&deptId='+curUserInfo.depId;
						var url2=__ctxPath + '/system/selectAppUser.do?depId='+curUserInfo.depId;
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
			}]
		});
		this.buttons = [{
			text : '提交',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('CheckSelectEditUserWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var url=__ctxPath + '/work/updateUserWorkContent.do';
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
				Ext.getCmp('CheckSelectEditUserWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}
});