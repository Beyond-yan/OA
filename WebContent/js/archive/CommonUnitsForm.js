/**
 * @author:Ropen
 * @createtime
 * @class CommonUnitsForm
 * @extends Ext.Window
 * @description CommonUnits表单
 * @company 捷达世软件
 */
CommonUnitsForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CommonUnitsForm.superclass.constructor.call(this, {
					id : 'CommonUnitsFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 300,
					width : 500,
					maximizable : true,
					title : '常用单位详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, /*{
								text : '重置',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset
							},*/ {
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
			id : 'CommonUnits.formPanel',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'commonUnits.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : '单位名称',
						name : 'commonUnits.unitName',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '单位描述',
						name : 'commonUnits.unitDesc',
						xtype : 'textarea',
						maxLength : 400
					},{
						xtype : 'radiogroup',
						fieldLabel : '单位类型',
						items : [{
									boxLabel : '主送',
									name : 'commonUnits.unitType',
									inputValue : 1,
									checked : true
								}, {
									boxLabel : '抄送',
									name : 'commonUnits.unitType',
									inputValue : 2
								}]

					}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/archive/getCommonUnits.do?id='
								+ this.id,
						root : 'data',
						preName : 'commonUnits'
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
		var fm = Ext.getCmp("CommonUnits.formPanel");
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/archive/saveCommonUnits.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('CommonUnitsGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}// end of save

});