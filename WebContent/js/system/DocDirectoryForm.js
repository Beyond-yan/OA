/**
 * @author
 * @createtime
 * @class DocDirectoryForm
 * @extends Ext.Window
 * @description DocDirectoryForm表单
 * @company 宏天软件
 */
Ext.ns('DocDirectoryForm');
DocDirectoryForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocDirectoryForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'DocDirectoryFormWin',
					title : '新建档案目录',
					iconCls : 'menu-docDirectory',
					width : 400,
					height : 240,
					minWidth : 399,
					minHeight : 169,
					items : [this.formPanel],
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : [{
						text : '保存',
						iconCls : 'btn-save',
						handler : function() {
							if (Ext.getCmp('docDirectoryForm').getForm().isValid()) {
								Ext.getCmp('docDirectoryForm').getForm().submit({
											waitMsg : '正在提交目录信息',
											success : function(formPanel, o) {
												Ext.ux.Toast.msg('操作信息', '添加目录成功！');
												 Ext.getCmp('DocDirectoryGrid').getStore().reload();
												Ext.getCmp('DocDirectoryFormWin')
														.close();
											}
										});
							}
						}
					}, {
						text : '取消',
						iconCls : 'btn-del',
						handler : function() {
							Ext.getCmp('DocDirectoryFormWin').close();
						}
					}]
				});
	},
	initUIComponents : function() {
		var hasDep = this.recId?false:!Ext.num(this.nodeId);
		var nowYear = parseInt(new Date().format('Y'));
		var startYear  = nowYear -13;
		var arr = [];
		for(var i = 0; i<=14; i++){
			arr[i] = startYear + i;
		}
		var formItems = [{
						xtype : 'hidden',
						name : 'docDirectory.id',
						id : 'id'
					},{
						xtype : 'hidden',
						name : 'docDirectory.parentId',
						id : 'parentId',
						value : this.nodeId
					}, {
						fieldLabel : '题名',
						name : 'docDirectory.directoryName',
						id : 'directoryName',
						allowBlank : false
					},  {  
						id : 'dirYear',
						fieldLabel : '年份',
						width : 100,
						hiddenName : 'docDirectory.dirYear',
						xtype : 'combo',
						mode : 'local',
						allowBlank : false,
						editable : false,
						triggerAction : 'all',
						store : arr,
						emptyText : '---年份---'
					}, /*{
						fieldLabel : '类型',
						xtype : 'combo',
						hiddenName : 'docDirectory.isSendDir',
						id : 'isSendDir',
						mode : 'local',
						editable : false,
						allowBlank : false,
						triggerAction : 'all',
						width : 100,
						store : [['0','发文'],
						         ['1','收文']],
						emptyText : '---请选择期限---'
					}, */{
						fieldLabel : '保管期限',
						xtype : 'combo',
						hiddenName : 'docDirectory.retentionYear',
						id : 'retentionYear',
						mode : 'local',
						editable : false,
						allowBlank : false,
						triggerAction : 'all',
						width : 100,
						store : [ [ '10', '10年' ],
						          [ '30', '30年' ],
						          [ '0', '永久' ] ,
						          [ '1', '待分类' ]  ],
						emptyText : '---请选择期限---'
					}, {
						fieldLabel : '起始件号',
						name : 'docDirectory.startFileNo',
						allowBlank : true,
						id : 'startFileNo'
					},{
						xtype : 'hidden',
						name : 'docDirectory.department.depId',
						id : 'docDirectory.department.depId'
					},{
						xtype : 'hidden',
						name : 'docDirectory.isSendDir',
						value : 0
					} ];
		
		if(hasDep){
			var arr = [new TreeSelector('docDirectory.department.depName'
					, __ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId')
					, '所属部门','docDirectory.department.depId',false)];
			formItems = arr.concat(formItems);
		}
		
		
		this.formPanel = new Ext.form.FormPanel({
			frame : false,
			id : 'docDirectoryForm',
			bodyStyle : 'padding : 5px;',
			layout : 'form',
			defaultType : 'textfield',
			url : __ctxPath + '/system/saveDocDirectory.do',
			defaultType : 'textfield',
			defaults : {
				anchor : '95%,95%',
				allowBlank : false,
				selectOnFocus : true
			},
			items : formItems
		});
		this.load();
		
	},
	load : function() {
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/system/getDocDirectory.do?dicId='
								+ this.id,
						root : 'data',
						preName : 'docDirectory'
					});
		}
	},
});