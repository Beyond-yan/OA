/**
 * @author
 * @createtime
 * @class DepartmentForm
 * @extends Ext.Window
 * @description DepartmentForm表单
 * @company 宏天软件
 */
DepartmentForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DepartmentForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'DepartmentFormWin',
					title : '部门信息',
					iconCls : 'menu-department',
					width : 400,
					height : 268,
					minWidth : 399,
					minHeight : 169,
					items : this.formPanel,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.form.FormPanel({
			frame : false,
			id : 'departmentForm',
			bodyStyle : 'padding : 5px;',
			layout : 'form',
			defaultType : 'textfield',
			url : __ctxPath + '/system/addDepartment.do',
			defaultType : 'textfield',
			reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
								name : 'depId',
								mapping : 'depId'
							}, {
								name : 'depName',
								mapping : 'depName'
							}, {
								name : 'depDesc',
								mapping : 'depDesc'
							}, {
								name : 'parentId',
								mapping : 'parentId'
							}, {
								name : 'appUser',
								mapping : 'appUser'
							}, {
								name : 'userId',
								mapping : 'appUser ? obj.appUser.userId : null'
							},{
								name : 'departmentLevel',
								mapping : 'departmentLevel'
							},{  	name : 'isExternal',
								mapping : 'isExternal'

                                                        },{
								name : 'depUnitCode',
								mapping : 'depUnitCode'
							}]),

			defaults : {
				anchor : '95%,95%',
				allowBlank : true,
				selectOnFocus : true,
				msgTarget : 'side'
			},
			items : [{
						xtype : 'hidden',
						name : 'department.depId',
						id : 'depId'
					}, {

                                                xtype : 'hidden',

                                                name : 'department.isExternal',

                                                id : 'isExternal'

                                        },

{
						xtype : 'hidden',
						name : 'department.parentId',
						id : 'parentId',
						value : this.nodeId
					}, {
						xtype : 'hidden',
						name : 'department.path',
						id : 'path'
					}, {
						fieldLabel : '部门名',
						name : 'department.depName',
						blankText : '部门名为必填!',
						id : 'depName'
					}, {
						fieldLabel : '部门描述',
						xtype : 'textarea',
						name : 'department.depDesc',
						blankText : '部门描述为必填!',
						id : 'depDesc'
					}, {
						xtype : 'hidden',
						name : 'department.appUser.userId',
						id: 'userId'
					}, {
						xtype : 'combo',
						hiddenName : 'appUserName',
						fieldLabel : '分管领导',
						valueField : 'userId',
						id : 'viceUserId',
						displayField : 'fullname',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						store : new Ext.data.SimpleStore({
							url : __ctxPath
									+ '/system/getViceGenMagAppUser.do?',
							autoLoad : true,
							fields : ['userId', 'fullname'],
							listeners : {
								scope : this,
								load : function() {
									
								}
							}
						}),
						listeners : {
							scope : this,
							select : function(cbo, record, index) {
								this.getCmpByName('department.appUser.userId')
										.setValue(cbo.getValue());
							}
						}
					},/* {
						xtype : 'hidden',
						maxValue : 10000,
						name : 'department.depUnitCode',
						id : 'depUnitCode'
					},*/{
						fieldLabel : '排序数值',
						xtype : 'numberfield',
						maxValue : 10000,
						allowBlank : false,
						name : 'department.departmentLevel',
						id : 'departmentLevel',
						maxText : '输入的数值必须小于10000!'
					}]
		});
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var tree1 = Ext.getCmp('treePanel');
						if (Ext.getCmp('departmentForm').getForm().isValid()) {
							Ext.getCmp('departmentForm').getForm().submit({
										waitMsg : '正在提交部门信息',
										success : function(formPanel, o) {
											Ext.ux.Toast.msg('操作信息', '添加部门成功！')
											Ext.getCmp('DepartmentFormWin')
													.close();
											tree1.root.reload();
										},failure : function(userform, o) {
											Ext.ux.Toast.msg('错误信息', o.result.msg);
											Ext.getCmp('depUnitCode').setValue('');
										}
									});
						}
					}

				}, {
					text : '取消',
					iconCls : 'btn-del',
					handler : function() {
						Ext.getCmp('DepartmentFormWin').close();
					}
				}];// end of the buttons
	}
});