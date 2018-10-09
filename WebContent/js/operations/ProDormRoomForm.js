/**
 * @author
 * @createtime
 * @class ProDormRoomForm
 * @extends Ext.Window
 * @description ProDormRoom表单
 * @company 捷达世软件
 */
ProDormRoomForm = Ext.extend(Ext.Window,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProDormRoomForm.superclass.constructor.call(this,
		{
			id : 'ProDormRoomFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '房间详细信息',
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
			// id : 'ProDormRoomForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'proDormRoom.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},
			{
				xtype : 'hidden',
				name : 'proDormRoom.chargeUser',
				id : 'chargeUserID'
			},
			{
				fieldLabel : '宿舍',
			    hiddenName : 'proDormRoom.dormitoryId',			 
				xtype : 'combo',
				editable : true,
				triggerAction : 'all',
				displayField : 'name',
				editable : false,
				valueField : 'id',
				mode : 'local',
				store :ProDormRoomForm.DomitoryStore
			},
			{
				fieldLabel : '编号',
				name : 'proDormRoom.code',
				allowBlank : false,
				maxLength : 30
			},	
			{
				xtype : 'container',
				layout : 'hbox',
				layoutConfigs :
				{
					align : 'middle'
				},
				defaults :
				{
					margins : '0 2 0 0'
				},
				height : 30,
				items : [
				{
					xtype : 'label',
					text : '管理员:',
					width : 103
				},
				{

					name : 'chargeUserName',
					id : 'chargeUserName',
					xtype : 'textfield',
					editable : false,
					allowBlank : false,
					readOnly : true,
					width : 130
				},
				{
					xtype : 'button',
					iconCls : 'btn-user-sel',
					text : '选择人员',
					handler : function()
					{
						UserSelector.getView(function(id, name)
						{
							Ext.getCmp('chargeUserName').setValue(name);
							Ext.getCmp('chargeUserID').setValue(id);
						}, true).show();
					}
				},
				{
					xtype : 'button',
					text : '清除纪录',
					iconCls : 'reset',
					handler : function()
					{
						Ext.getCmp('chargeUserName').setValue('');
						Ext.getCmp('chargeUserID').setValue('');
					}
				} ]
			},
			
			
			
			{
				fieldLabel : '可容纳人数',
				name : 'proDormRoom.capacity',
				id:'proDormRoomCapacity',
				xtype : 'numberfield',
				allowBlank : false
			},
			
			{
				xtype : 'container',
				style : 'padding-left:0px;margin-bottom:4px;',
				id : 'proDormRoomRemainingCon',
				layout : 'column',
				items:[{
					xtype : 'label',
					style : 'padding-left:0px;',
					text : '剩余床位:',
					width : 105
				},
				{
					name : 'proDormRoom.remaining',
					id:'proDormRoomRemaining',
					xtype : 'numberfield',
					width : 345
				}]
				
			},
			{
				fieldLabel : '栋别',
				name : 'proDormRoom.building',
				maxLength : 50
			},

			{
				fieldLabel : '描述',
				name : 'proDormRoom.description',
				xtype : 'textarea',
				maxLength : 400
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined')
		{
			Ext.getCmp('proDormRoomRemaining').disabled  = true;
			 this.formPanel.loadData(
			 {
			 url : __ctxPath + '/operations/getProDormRoom.do?id=' + this.id,
			 root : 'data',
			 preName : 'proDormRoom' ,
			 success : function(response,options) 
			 {
				 var json=Ext.util.JSON.decode(response.responseText);
				 Ext.getCmp('chargeUserName').setValue(json.data.ref1);
			 }

             
			 });
		}
		else
		{
			Ext.getCmp('proDormRoomRemainingCon').hide();			 
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
			url : __ctxPath + '/operations/saveProDormRoom.do',
			callback : function(fp, action)
			{
				var gridPanel = Ext.getCmp('ProDormRoomGrid');
				if (gridPanel != null)
				{
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});


ProDormRoomForm.DomitoryStore =  new Ext.data.SimpleStore(
{
	autoLoad : true,
	url : __ctxPath + "/operations/comboProDormitory.do",
	fields : [ 'id', 'name' ]
});
	