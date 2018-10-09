/**
 * @author
 * @createtime
 * @class ProRoomEquipmentForm
 * @extends Ext.Window
 * @description ProRoomEquipment表单
 * @company 捷达世软件
 */
ProRoomEquipmentForm = Ext.extend(Ext.Window,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProRoomEquipmentForm.superclass.constructor.call(this,
		{
			id : 'ProRoomEquipmentFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 300,
			width : 500,
			maximizable : true,
			title : '设备详细信息',
			buttonAlign : 'center',
			buttons : [
			{
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			},
			{
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			},
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
			// id : 'ProRoomEquipmentForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'proRoomEquipment.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},
			{
				xtype : 'hidden',
				name : 'proRoomEquipment.roomId',
				allowBlank : false,
				value : this.roomid
			},
			{
				fieldLabel : '名称',
				name : 'proRoomEquipment.name',
				allowBlank : false,
				maxLength : 50
			},

			{
				fieldLabel : '数量',
				name : 'proRoomEquipment.quantiry',
				xtype : 'numberfield'
			},
			{
				fieldLabel : '类型',
				hiddenName : 'proRoomEquipment.type',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value : '1',
				store : [ [ '1', '家电' ], [ '2', '家具' ] ]

			},
			{
				fieldLabel : '描述',
				name : 'proRoomEquipment.desc',
				xtype : 'textarea',
				maxLength : 400
			},
			{
				name : 'proRoomEquipment.isDelete',
				xtype : 'hidden',
				value : 0
			}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined')
		{
			this.formPanel.loadData(
			{
				url : __ctxPath + '/operations/getProRoomEquipment.do?id='
						+ this.id,
				root : 'data',
				preName : 'proRoomEquipment'
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
		$postForm(
		{
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/operations/saveProRoomEquipment.do',
			callback : function(fp, action)
			{
				var gridPanel = Ext.getCmp('ProRoomEquipmentGrid');
				if (gridPanel != null)
				{
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});