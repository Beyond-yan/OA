/**
 * @author 
 * @createtime 
 * @class CarOilCardForm
 * @extends Ext.Window
 * @description CarOilCard表单
 * @company 捷达世软件
 */
CarOilCardForm = Ext.extend(Ext.Window, {
	//构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		CarOilCardForm.superclass.constructor.call(this, {
			id : 'CarOilCardFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '油卡详细信息',
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
	},//end of the constructor
	//初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			//id : 'CarOilCardForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'carOilCard.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, 
			{
				fieldLabel : '油类',
				hiddenName : 'carOilCard.type',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value : 2,
				store : [ [ '1', '柴油' ], [ '2', '93#汽油' ],
						[ '3', '97#汽油' ], [ '4', '其他' ] ]

			}			
			
			, {
				fieldLabel : '行政编号',
				name : 'carOilCard.code',
				maxLength : 30,
				allowBlank :false
			}, {
				fieldLabel : '卡号',
				name : 'carOilCard.sn',
				maxLength : 30,
				allowBlank :false
			}
			, {
				fieldLabel : '工本费',
				name : 'carOilCard.cost',
				id:'OilCardCost',
				xtype : 'numberfield',
				allowBlank :false,
				maxLength : 6
			}
			, {
				fieldLabel : '余额',
				name : 'carOilCard.remains',
				id:'OilCardRemain',
				allowBlank :false,
				xtype : 'numberfield',
				maxLength : 6
			}, {
				fieldLabel : '供油公司',
				name : 'carOilCard.oilCompany',
				maxLength : 30
			}, 
			{
				fieldLabel : '有效期至',
				name : 'carOilCard.validEDate',
				id:'carOilCardvalidEDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : '备注',
				name : 'carOilCard.remark',
				xtype : 'textarea',
				maxLength : 400
			}, 
			{					
				fieldLabel : '状态',
				hiddenName : 'carOilCard.status',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value : 1,
				store : [ [ '1', '可用' ], [ '0', '不可用' ], [ '2', '已绑定' ] ]					
							
			} ]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') 
		{
			Ext.getCmp('OilCardRemain').disabled   = true;
			Ext.getCmp('OilCardCost').disabled   = true;
			
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getCarOilCard.do?id=' + this.id,
				root : 'data',
				preName : 'carOilCard'
			});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() 
	{	
		var now = new Date();		

		var outdate = Ext.getCmp('carOilCardvalidEDate').getValue().format('Y-m-d');
		if(now.format('Y-m-d')>outdate)
		{
			Ext.ux.Toast.msg('操作信息', '请检查卡的到期日期,不能添加过期卡！');
			return ;	
		}
		

		
		
		if( this.formPanel.getForm().isValid())
		{
			this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/admin/saveCarOilCard.do',
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) 
					{
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
						var gridPanel = Ext.getCmp('CarOilCardGrid');
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
						var gridPanel = Ext.getCmp('CarOilCardGrid');
						if (gridPanel != null) 
						{
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
		}
	}

});