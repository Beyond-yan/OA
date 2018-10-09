/**
 * @author:Ropen
 * @createtime
 * @class OdFlowtypeForm
 * @extends Ext.Window
 * @description OdFlowtype表单
 * @company 捷达世软件
 */
OdFlowtypeForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		OdFlowtypeForm.superclass.constructor.call(this, {
					id : 'OdFlowtypeFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 400,
					width : 500,
					maximizable : true,
					title : '公文流程详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							},/* {
								text : '重置',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset
							}, */{
								text : '取消',
								iconCls : 'btn-cancel',
								scope : this,
								handler : this.cancel
							}]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			id : 'OdFlowtypeForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'odFlowtype.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : '公文流程名称',
						name : 'odFlowtype.flowName',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '公文流程描述',
						name : 'odFlowtype.flowDesc',
						xtype : 'textarea',
						maxLength : 400
					}, {
						fieldLabel : '公文流程类型',
						hiddenName : 'odFlowtype.flowType',
						xtype : 'combo',
						emptyText : '请选择',
						mode : 'local',
						editable : false,
						allowBlank : false,
						triggerAction : 'all',
						store : [['1', '内发文流程'], ['2', '外发文流程'],
											['3', '外收文流程'], ['4', '内收文流程']]
					}, {
						xtype : 'container',
						// style : 'padding-top:3px;',
						layout : 'column',
						items : [{
									xtype : 'label',
									text : '公文流程:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'odFlowtype.proDefinition.name',
									id : 'odFlowtype.proDefinition.name',
									width : 273
								}, {
									xtype : 'hidden',
									name : 'odFlowtype.proDefinition.defId',
									id : 'odFlowtype.proDefinition.defId'
								}, {
									xtype : 'button',
									text : '选择流程',
									iconCls : 'menu-flow',
									handler : function() {
										FlowSelector.getView(
												function(id, name) {
													var fm = Ext
															.getCmp('OdFlowtypeForm');
													fm
															.getCmpByName('odFlowtype.proDefinition.defId')
															.setValue(id);
													fm
															.getCmpByName('odFlowtype.proDefinition.name')
															.setValue(name);
												}, true).show();
									}
								}]

					}, /*
						 * { fieldLabel : '是否自动保存', name :
						 * 'odFlowtype.isAutoSave', xtype : 'numberfield' },
						 */
					{
						xtype : 'radiogroup',
						fieldLabel : '是否自动保存',
						items : [{
									boxLabel : '是',
									name : 'odFlowtype.isAutoSave',
									inputValue : 1
								}, {
									boxLabel : '否',
									name : 'odFlowtype.isAutoSave',
									inputValue : 0,
									checked : true
								}]
					}/*
						 * , { fieldLabel : '创建日期', name :
						 * 'odFlowtype.createDate', xtype : 'datefield', format :
						 * 'Y-m-d', value : new Date() }, { fieldLabel : '创建人',
						 * name : 'odFlowtype.createBy', maxLength : 50 }, {
						 * fieldLabel : '修改日期', name : 'odFlowtype.updateDate',
						 * xtype : 'datefield', format : 'Y-m-d', value : new
						 * Date() }, { fieldLabel : '修改人', name :
						 * 'odFlowtype.updateBy', maxLength : 50 }
						 */]
		});

/*		Ext.Ajax.request({
					url : __ctxPath + '/archive/getArchFlowConf.do',
					success : function(response, options) {
						var fm = Ext.getCmp('OdFlowtypeForm');
						var obj = Ext.util.JSON.decode(response.responseText).data;
						fm.getCmpByName('odFlowtype.proDefinition.defId')
								.setValue(obj.recProcessId);
						fm.getCmpByName('odFlowtype.proDefinition.name')
								.setValue(obj.recProcessName);
					}
				});*/
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/archive/getOdFlowtype.do?id='
								+ this.id,
						root : 'data',
						preName : 'odFlowtype'
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
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/archive/saveOdFlowtype.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('OdFlowtypeGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}// end of save

});