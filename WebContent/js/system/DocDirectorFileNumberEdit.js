/**
 * @author
 * @createtime
 * @class DocDirectorFileNumberEdit
 * @extends Ext.Window
 * @description DocDirectorFileNumberEdit表单
 * @company 宏天软件
 */
Ext.ns('DocDirectorFileNumberEdit');
DocDirectorFileNumberEdit = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocDirectorFileNumberEdit.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'DocDirectorFileNumberEditWin',
					title : '档案目录详情信息',
					iconCls : 'btn-edit',
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
							if (Ext.getCmp('DocDirectorFileNumberEdit').getForm().isValid()) {
								Ext.getCmp('DocDirectorFileNumberEdit').getForm().submit({
											waitMsg : '正在提交目录信息',
											success : function(formPanel, o) {
												Ext.ux.Toast.msg('操作信息', '件号设置成功！');
												Ext.getCmp('DocDirectoryDetailGrid').getStore().reload();
												Ext.getCmp('DocDirectoryGrid').getStore().reload();
												Ext.getCmp('DocDirectorFileNumberEditWin').close();
											}
										});
							}
						}
					}, {
						text : '取消',
						iconCls : 'btn-del',
						handler : function() {
							Ext.getCmp('DocDirectorFileNumberEditWin').close();
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
						editable : false,
						disabled :true,
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
						disabled :true,
						store : arr,
						emptyText : '---年份---'
					}, {
						fieldLabel : '保管期限',
						xtype : 'combo',
						hiddenName : 'docDirectory.retentionYear',
						id : 'retentionYear',
						mode : 'local',
						editable : false,
						allowBlank : false,
						disabled :true,
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
						xtype : 'numberfield',
						id : 'startFileNo'
					},{
						xtype : 'hidden',
						name : 'docDirectory.department.depId',
						id : 'docDirectory.department.depId'
					},{
						xtype : 'hidden',
						name : 'docDirectory.isSendDir',
						value : 0
					},{
						xtype :'hidden',
						name : 'isFileNumberFinish',
						value : 'true'
					} ];
		
		if(hasDep){
			var arr = [new TreeSelector('docDirectory.department.depName'
					, __ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId')
					, '所属部门',
					'docDirectory.department.depId', true)];
			formItems = arr.concat(formItems);
			Ext.getCmp('docDirectory.department.depName').disable();
		}
		
		
		this.formPanel = new Ext.form.FormPanel({
			frame : false,
			id : 'DocDirectorFileNumberEdit',
			bodyStyle : 'padding : 5px;',
			layout : 'form',
			defaultType : 'textfield',
			url : __ctxPath + '/system/updateFileNumberDocFiles.do',
			defaultType : 'textfield',
			defaults : {
				anchor : '95%,95%',
				allowBlank : true,
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