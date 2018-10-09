/**
 * @author
 * @createtime
 * @class DiningBookingDetailForm
 * @extends Ext.Window
 * @description DiningBookingDetail表单
 * @company 捷达世软件
 */
DiningBookingDetailForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningBookingDetailForm.superclass.constructor.call(this, {
			id : 'DiningBookingDetailFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '[DiningBookingDetail]详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, {
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
			// id : 'DiningBookingDetailForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningBookingDetail.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : 'bookingid',
				name : 'diningBookingDetail.bookingid',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'menuid',
				name : 'diningBookingDetail.menuid',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'qty',
				name : 'diningBookingDetail.qty',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'amount',
				name : 'diningBookingDetail.amount',
				allowBlank : false,
				xtype : 'numberfield'
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningBookingDetail.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningBookingDetail'
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
			url : __ctxPath + '/diningMgnt/saveDiningBookingDetail.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningBookingDetailGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});