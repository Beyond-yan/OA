/**
 * @author
 * @createtime
 * @class AttendVacationApplyForm
 * @extends Ext.Window
 * @description AttendVacationApply表单
 * @company 捷达世软件
 */
CompanyEditForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CompanyEditForm.superclass.constructor.call(this, {
			id : 'AttendVacationApplyFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 170,
			width : 300,
			maximizable : true,
			title : '',
			buttonAlign : 'center',
			buttons : [ {
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
				text : '关闭',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'AttendVacationApplyForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
				fieldLabel : '标题',
				name : 'title',
				allowBlank : false,
				xtype : 'textfield',
				id:"title"
			},{
				fieldLabel : '日期',
				name : 'day',
				xtype : 'datefield',
				format : 'Y-m-d',
				id:'day'
			},{
				fieldLabel : '日期类型',
				name : 'dayCategory',
				allowBlank : false,
				xtype : 'textfield',
				id:"dayCategory"
			}]
		});
		
		
		

	},// end of the initcomponents

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
			url : __ctxPath + '/attend/saveAttendVacationApply.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('AttendVacationApplyGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});