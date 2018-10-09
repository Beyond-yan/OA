/**
 * @author
 * @createtime
 * @class ProUserFeeForm
 * @extends Ext.Window
 * @description ProUserFee表单
 * @company 捷达世软件
 */
ProUserFeeForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProUserFeeForm.superclass.constructor.call(this, {
			id : 'ProUserFeeFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '物业费用管理',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, 
//			{
//				text : '重置',
//				iconCls : 'btn-reset',
//				scope : this,
//				handler : this.reset
//			}, 
			{
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ProUserFeeForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proUserFee.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '员工名称',
				name : 'proUserFee.appUser.fullname',
				id:'fullname',
				readOnly : true,
				maxLength : 30
			}, 
			{
				fieldLabel : '水费',
				name : 'proUserFee.waterFee',
				maxLength : 9
			},
			{
				fieldLabel : '电费',
				name : 'proUserFee.powerFee',
				maxLength : 9
			},
			{
				fieldLabel : '房费',
				name : 'proUserFee.roomFee',
				maxLength : 9
			},{
				fieldLabel : '总费用',
				name : 'proUserFee.amount',
				maxLength : 9
			},  {
				fieldLabel : '开始日期',
				name : 'proUserFee.startTime',
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '截止日期',
				name : 'proUserFee.endTime',
				xtype : 'datefield',
				format : 'Y-m-d'
			}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/operations/getProUserFee.do?id=' + this.id,
				root : 'data',
				preName : 'proUserFee'
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
			url : __ctxPath + '/operations/saveProUserFee.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ProUserFeeGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});