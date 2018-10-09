/**
 * @author
 * @createtime
 * @class DiningChargeDetail
 * @extends Ext.Window
 * @description DiningCharge表单
 * @company 捷达世软件
 */
DiningChargeDetail = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningChargeDetail.superclass.constructor.call(this, {
			id : 'DiningChargeDetailWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '用餐费用详细信息',
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
			// id : 'DiningChargeDetail',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningCharge.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : 'userid',
				name : 'diningCharge.userid',
				allowBlank : false,
				xtype : 'hidden',
				value:this.userid
			}, {
				fieldLabel : '缴费日期',
				name : 'diningCharge.chargedate',
				editable:false,
				allowBlank : false,
				format : 'Y-m-d',
				xtype : 'datefield',				
				maxValue : new Date().clearTime()
			} , {
				fieldLabel : '缴费金额',
				name : 'diningCharge.chargeamount',
				allowBlank : false,
				xtype : 'numberfield'
			}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningCharge.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningCharge'
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
			url : __ctxPath + '/diningMgnt/saveDiningCharge.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DCFrmDiningChargeGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				var totalgridPanel = Ext.getCmp('DiningChargeGrid');
				if (totalgridPanel != null) {
					totalgridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});