CarPassFeeCardForm = Ext.extend(Ext.Window,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CarPassFeeCardForm.superclass.constructor.call(this,
		{
			id : 'CarPassFeeCardFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '详细信息',
			buttonAlign : 'center',
			buttons : [
			{
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
	initUIComponents : function()
	{
		this.formPanel = new Ext.FormPanel(
		{
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'CarPassFeeCardForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'carPassFeeCard.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},
			{
				fieldLabel : '类型',
				hiddenName : 'carPassFeeCard.type',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value:1,
				store : [ [ '1', '记账卡' ], [ '2', '储值卡' ], [ '3', '其他' ] ]

			},
			{
				fieldLabel : '种类',

				hiddenName : 'carPassFeeCard.category',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value:1,
				store : [ [ '1', '粤通卡' ], [ '2', '闽通卡' ]]

			},
			{
				fieldLabel : '行政编号',
				name : 'carPassFeeCard.code',
				maxLength : 30,
				allowBlank :false
			},
			{
				fieldLabel : '卡号',
				name : 'carPassFeeCard.sn',
				maxLength : 30,
				allowBlank :false
			},
			{
				fieldLabel : '工本费',
				name : 'carPassFeeCard.cost',
				id:'carPassFeeCardCost',
				xtype : 'numberfield',
				allowBlank :false,
				maxLength : 5
			},
			{
				fieldLabel : '余额',
				name : 'carPassFeeCard.remains',
				id:'carPassFeeCardRemain',
				xtype : 'numberfield',
				allowBlank :false,
				maxLength : 18
			},
			{
				fieldLabel : '有效期至',
				name : 'carPassFeeCard.validEDate',
				id:'carPassFeeCardvalidEDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			},
			{
				fieldLabel : '备注',
				name : 'carPassFeeCard.remark',
				xtype : 'textarea',
				maxLength : 400
			},
			{
				fieldLabel : '状态',
				hiddenName : 'carPassFeeCard.status',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value:1,
				store : [ [ '1', '可用' ], [ '0', '不可用' ] , [ '2', '已绑定' ]]

			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined')
		{
			Ext.getCmp('carPassFeeCardCost').disabled  = true;
			Ext.getCmp('carPassFeeCardRemain').disabled  = true;
			this.formPanel.loadData(
			{
				url : __ctxPath + '/admin/getCarPassFeeCard.do?id=' + this.id,
				root : 'data',
				preName : 'carPassFeeCard'
			});
		}

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function()
	{
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function()
	{
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() 
	{	
		var now = new Date();
		var outdate = Ext.getCmp('carPassFeeCardvalidEDate').getValue().format('Y-m-d');
		if(now.format('Y-m-d')>outdate)
		{
			Ext.ux.Toast.msg('操作信息', '请检查卡的到期日期,不能添加过期卡！');
			return ;	
		}
		
		if( this.formPanel.getForm().isValid())
		{
			this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/admin/saveCarPassFeeCard.do',
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) 
					{
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
						var gridPanel = Ext.getCmp('CarPassFeeCardGrid');
						if (gridPanel != null) 
						{
							gridPanel.getStore().reload();
						}
						this.close();
					},
					failure : function(fp, action) 
					{
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错,' + action.result.msg,
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
						var gridPanel = Ext.getCmp('CarPassFeeCardGrid');
						if (gridPanel != null)
						{
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
		}
	}//end of save

});