/**
 * @author 
 * @createtime 
 * @class ProRoomBedsForm
 * @extends Ext.Window
 * @description ProRoomBeds表单
 * @company 捷达世软件
 */
ProRoomBedsForm = Ext.extend(Ext.Window,
{
	//构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		ProRoomBedsForm.superclass.constructor.call(this,
		{
			id : 'ProRoomBedsFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '床位详细信息',
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
	},//end of the constructor
	//初始化组件
	initUIComponents : function()
	{
		this.formPanel = new Ext.FormPanel(
		{
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			//id : 'ProRoomBedsForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'proRoomBeds.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},			
			{
				xtype : 'hidden',
				name : 'proRoomBeds.roomId',
				allowBlank : false,
				value : this.roomid
			},			
			{					
				fieldLabel : '状态',
				hiddenName : 'proRoomBeds.isFree',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value : 1,
				store : [ [ '1', '可用' ], [ '0', '不可用' ]]					
							
			},
			{
				fieldLabel : '床位编号',
				name : 'proRoomBeds.bedCode',
				allowBlank : false,
				maxLength : 50
			},
			{
				fieldLabel : '描述',
				name : 'proRoomBeds.description',
				xtype : 'textarea',
				maxLength : 400
			}
]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined')
		{
			this.formPanel
					.loadData(
					{
						url : __ctxPath + '/operations/getProRoomBeds.do?id='
								+ this.id,
						root : 'data',
						preName : 'proRoomBeds'
					});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function()
	{
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
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
		if( this.formPanel.getForm().isValid())
		{
			this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/operations/saveProRoomBeds.do',
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) 
					{
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
						var gridPanel = Ext.getCmp('ProRoomBedsGrid');
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
						var gridPanel = Ext.getCmp('ProRoomBedsGrid');
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