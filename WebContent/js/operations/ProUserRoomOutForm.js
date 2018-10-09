/**
 * @author
 * @createtime
 * @class ProUserRoomForm
 * @extends Ext.Window
 * @description 宿舍员工表单
 * @company 捷达世软件
 */
ProUserRoomOutForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProUserRoomForm.superclass.constructor.call(this, {
			id : 'ProUserRoomFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '宿舍员工管理',
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
			// id : 'ProUserRoomForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proUserRoom.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				name : 'proUserRoom.userId',
				id : 'userId',
				xtype : 'hidden'
			}, {
				name : 'proUserRoom.bedId',
				id : 'bedId',
				xtype : 'hidden'
			}, {
				xtype : 'container',
				id:'userForm',
				layout : 'hbox',
				layoutConfigs : {
					align : 'middle'
				},
				defaults : {
					margins : '0 2 0 0'
				},
				height : 26,
				items : [ {
					xtype : 'label',
					text : '员工名称 :',
					width : 103
				}, {
					id : 'username',
					xtype : 'textfield',
					name : 'proUserRoom.appUser.fullname',
					editable : false,
					readOnly : true,
					allowBlank : false,
					width : 130
				}, {
					xtype : 'button',
					iconCls : 'btn-car',
					text : '选择人员',
					handler : function() {
						UserRoomSelector.getView(function(id, name) {
							Ext.getCmp('userId').setValue(id);
							Ext.getCmp('username').setValue(name);
						}, true, true

						).show();
					}

				}, {
					xtype : 'button',
					text : '消除记录',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('userId').setValue('');
						Ext.getCmp('username').setValue('');
					}
				} ]

			}, {
				id : 'roomId',
				name : 'proUserRoom.roomId',
				allowBlank : false,
				xtype : 'hidden'
			}, {
				xtype : 'container',
				id:'roomNum',
				layout : 'hbox',
				layoutConfigs : {
					align : 'middle'
				},
				defaults : {
					margins : '0 2 0 0'
				},
				height : 26,
				items : [ {
					xtype : 'label',
					text : '房间编号:',
					width : 103
				}, {
					id : 'code',
					xtype : 'textfield',
					name : 'proUserRoom.proDormRoom.code',
					editable : false,
					readOnly : true,
					allowBlank : false,
					width : 130
				}, {
					xtype : 'button',
					iconCls : 'btn-car',
					text : '选择房间',
					handler : function() {
						RoomSelector.getView(function(id, name) {

							Ext.getCmp('roomId').setValue(id);
							Ext.getCmp('code').setValue(name);
						}, true, true

						).show();
					}

				}, {
					xtype : 'button',
					text : '消除记录',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('roomId').setValue('');
						Ext.getCmp('code').setValue('');
					}
				} ]

			}, {
				xtype : 'container',
				id:'bedsNum',
				layout : 'hbox',
				layoutConfigs : {
					align : 'middle'
				},
				defaults : {
					margins : '0 2 0 0'
				},
				height : 26,
				items : [ {
					xtype : 'label',
					text : '床位编号:',
					width : 103
				}, {
					id : 'bedCode',
					xtype : 'textfield',
					name : 'proUserRoom.proRoomBeds.bedCode',
					editable : false,
					readOnly : true,
					allowBlank : false,
					width : 130
				}, {
					xtype : 'button',
					iconCls : 'btn-car',
					text : '选择床位',
					handler : function() {
						BedsSelector.getView(function(id, name) {
							Ext.getCmp('bedId').setValue(id);
							Ext.getCmp('bedCode').setValue(name);
						}, true, Ext.getCmp('roomId').getValue()

						).show();
					}

				}, {
					xtype : 'button',
					text : '消除记录',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('bedId').setValue('');
						Ext.getCmp('bedCode').setValue('');
					}
				} ]

			}, {
				fieldLabel : '入住时间',
				id:'checkInTime',
				name : 'proUserRoom.checkInTime',
				xtype : 'datefield',
				format : 'Y-m-d',
				allowBlank : false,
				editable : false,
				readOnly:true
			}]
		});
//		if (this.id == null) {
//			Ext.getCmp('isCheckOut').readOnly = true;
//			Ext.getCmp('checkOutTime').hide();
//		}
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel
					.loadData( {
						url : __ctxPath + '/operations/getProUserRoom.do?id='
								+ this.id,
						root : 'data',
						preName : 'proUserRoom'
					});
//			Ext.getCmp('isCheckOut').readOnly = false;
//			Ext.getCmp('checkOutTime').show();
//			Ext.getCmp('endTime').allowBlank=false;
		
//			Ext.getCmp('userForm').readOnly = false;
//			Ext.getCmp('roomNum').readOnly = false;
//			Ext.getCmp('bedsNum').readOnly = false;
//			Ext.getCmp('checkInTime').readOnly = false;
//			Ext.getCmp('checkOutTime').readOnly = false;
//			Ext.getCmp('isCheckOut').readOnly = false;			
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
			url : __ctxPath + '/operations/saveProUserRoom.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ProUserRoomGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});